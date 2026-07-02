import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { ArrowLeft, ArrowRight, Save, User, UserCheck, GraduationCap, FileCheck } from 'lucide-react';
import { Stepper } from '../../../components/ui/Stepper';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { Card, CardBody } from '../../../components/ui/Card';
import { parseEmergencyContact } from './StudentGuardian';
import { useClasses, useAcademicYears, useSections } from '../hooks/useStudents';
import type { StudentProfile } from '../../../types/student.types';

interface StudentFormWizardProps {
  initialStudent?: StudentProfile;
  isEdit?: boolean;
  onSubmit: (data: any) => Promise<void>;
  isSubmitting: boolean;
}

interface FormValues {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other' | '';
  bloodGroup: string;
  phone: string;
  address: string;
  guardianName: string;
  guardianPhone: string;
  guardianRelationship: string;
  admissionNumber: string;
  rollNumber: string;
  enrollmentDate: string;
  classDocumentId: string;
  sectionDocumentId: string;
  academicYearDocumentId: string;
}

const STEPS = [
  'Personal Info',
  'Guardian Info',
  'Academic Placement',
  'Review & Submit',
];

export function StudentFormWizard({
  initialStudent,
  isEdit = false,
  onSubmit,
  isSubmitting,
}: StudentFormWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);

  // 1. Setup Default Values
  const getDefaults = (): FormValues => {
    if (initialStudent) {
      const activeEnrollment = initialStudent.enrollments?.find((e) => e.status === 'active') ?? initialStudent.enrollments?.[0];
      const guardian = parseEmergencyContact(initialStudent.emergencyContact);

      return {
        firstName: initialStudent.firstName,
        lastName: initialStudent.lastName,
        dateOfBirth: initialStudent.dateOfBirth,
        gender: initialStudent.gender ?? '',
        bloodGroup: initialStudent.bloodGroup ?? '',
        phone: initialStudent.phone ?? '',
        address: initialStudent.address ?? '',
        guardianName: guardian.name === '—' ? '' : guardian.name,
        guardianPhone: guardian.phone === '—' ? '' : guardian.phone,
        guardianRelationship: guardian.relation === '—' ? '' : guardian.relation,
        admissionNumber: initialStudent.admissionNumber,
        rollNumber: activeEnrollment?.rollNumber ?? '',
        enrollmentDate: activeEnrollment?.enrollmentDate ?? '',
        classDocumentId: activeEnrollment?.section?.class?.documentId ?? '',
        sectionDocumentId: activeEnrollment?.section?.documentId ?? '',
        academicYearDocumentId: activeEnrollment?.academicYear?.documentId ?? '',
      };
    }

    return {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: '',
      bloodGroup: '',
      phone: '',
      address: '',
      guardianName: '',
      guardianPhone: '',
      guardianRelationship: '',
      admissionNumber: '',
      rollNumber: '',
      enrollmentDate: new Date().toISOString().split('T')[0],
      classDocumentId: '',
      sectionDocumentId: '',
      academicYearDocumentId: '',
    };
  };

  const methods = useForm<FormValues>({
    defaultValues: getDefaults(),
    mode: 'onChange',
  });

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = methods;

  // Watch Class & Academic Year to load sections dynamically
  const selectedClass = watch('classDocumentId');
  const selectedAcademicYear = watch('academicYearDocumentId');

  // 2. Fetch Placement Metadata
  const { data: classes = [] } = useClasses();
  const { data: academicYears = [] } = useAcademicYears();
  const { data: sections = [] } = useSections(selectedClass || undefined, selectedAcademicYear || undefined);

  // Set default current Academic Year if available
  useEffect(() => {
    if (!isEdit && academicYears.length > 0 && !selectedAcademicYear) {
      const currentYear = academicYears.find((y) => y.isCurrent);
      if (currentYear) {
        setValue('academicYearDocumentId', currentYear.documentId);
      }
    }
  }, [academicYears, isEdit, selectedAcademicYear, setValue]);

  // Reset section if class changes
  useEffect(() => {
    if (!isEdit) {
      setValue('sectionDocumentId', '');
    }
  }, [selectedClass, setValue, isEdit]);

  // 3. Step Validation Before Moving
  const stepFields: Record<number, (keyof FormValues)[]> = {
    0: ['firstName', 'lastName', 'dateOfBirth', 'gender', 'phone', 'address'],
    1: ['guardianName', 'guardianPhone', 'guardianRelationship'],
    2: ['admissionNumber', 'rollNumber', 'enrollmentDate', 'classDocumentId', 'sectionDocumentId', 'academicYearDocumentId'],
  };

  const handleNext = async () => {
    // If edit mode and Step is 1 (Guardian Info), we skip Academic Placement (Step 2) because it is read-only
    const fields = stepFields[currentStep];
    const isStepValid = await trigger(fields);
    
    if (isStepValid) {
      if (isEdit && currentStep === 1) {
        setCurrentStep(3); // Jump straight to Review
      } else {
        setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
      }
    }
  };

  const handlePrev = () => {
    if (isEdit && currentStep === 3) {
      setCurrentStep(1); // Jump back to Guardian Info
    } else {
      setCurrentStep((prev) => Math.max(prev - 1, 0));
    }
  };

  const onFormSubmit = async (values: FormValues) => {
    // Format emergencyContact
    const emergencyContact = `${values.guardianName} (${values.guardianPhone}) - ${values.guardianRelationship}`;
    
    const payload = {
      ...values,
      emergencyContact,
    };
    
    await onSubmit(payload);
  };

  // Render Step Contents
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6 text-left">
            <h3 className="text-lg font-bold font-heading text-slate-800 dark:text-white flex items-center gap-2">
              <User className="w-5 h-5 text-primary-500" /> Personal Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="First Name"
                placeholder="e.g. John"
                error={errors.firstName?.message}
                {...register('firstName', { required: 'First name is required' })}
              />
              <Input
                label="Last Name"
                placeholder="e.g. Doe"
                error={errors.lastName?.message}
                {...register('lastName', { required: 'Last name is required' })}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                type="date"
                label="Date of Birth"
                error={errors.dateOfBirth?.message}
                {...register('dateOfBirth', { required: 'Date of birth is required' })}
              />
              <Select
                label="Gender"
                error={errors.gender?.message}
                {...register('gender', { required: 'Gender is required' })}
                options={[
                  { value: '', label: 'Select Gender' },
                  { value: 'male', label: 'Male' },
                  { value: 'female', label: 'Female' },
                  { value: 'other', label: 'Other' },
                ]}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Blood Group"
                placeholder="e.g. O+, AB-"
                error={errors.bloodGroup?.message}
                {...register('bloodGroup')}
              />
              <Input
                label="Phone Number"
                placeholder="e.g. +1 555-0100"
                error={errors.phone?.message}
                {...register('phone')}
              />
            </div>
            <Input
              label="Address"
              placeholder="e.g. 123 Main Street"
              multiline
              rows={3}
              error={errors.address?.message}
              {...register('address')}
            />
          </div>
        );

      case 1:
        return (
          <div className="space-y-6 text-left">
            <h3 className="text-lg font-bold font-heading text-slate-800 dark:text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-primary-500" /> Guardian Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Guardian Name"
                placeholder="e.g. Robert Doe"
                error={errors.guardianName?.message}
                {...register('guardianName', { required: 'Guardian name is required' })}
              />
              <Input
                label="Guardian Phone"
                placeholder="e.g. +1 555-0199"
                error={errors.guardianPhone?.message}
                {...register('guardianPhone', { required: 'Guardian phone number is required' })}
              />
            </div>
            <Input
              label="Relationship to Student"
              placeholder="e.g. Father, Mother, Aunt, Legal Guardian"
              error={errors.guardianRelationship?.message}
              {...register('guardianRelationship', { required: 'Relationship is required' })}
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 text-left">
            <h3 className="text-lg font-bold font-heading text-slate-800 dark:text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-primary-500" /> Academic Placement
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Admission Number"
                placeholder="e.g. ADM-2026-001"
                disabled={isEdit}
                error={errors.admissionNumber?.message}
                {...register('admissionNumber', { required: 'Admission number is required' })}
              />
              <Input
                label="Roll Number"
                placeholder="e.g. 10A05"
                disabled={isEdit}
                error={errors.rollNumber?.message}
                {...register('rollNumber', { required: 'Roll number is required' })}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                type="date"
                label="Enrollment Date"
                disabled={isEdit}
                error={errors.enrollmentDate?.message}
                {...register('enrollmentDate', { required: 'Enrollment date is required' })}
              />
              <Select
                label="Academic Year"
                disabled={isEdit}
                error={errors.academicYearDocumentId?.message}
                {...register('academicYearDocumentId', { required: 'Academic Year is required' })}
              >
                <option value="">Select Academic Year</option>
                {academicYears.map((ay) => (
                  <option key={ay.documentId} value={ay.documentId}>
                    {ay.name} {ay.isCurrent ? '(Current)' : ''}
                  </option>
                ))}
              </Select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Class"
                disabled={isEdit}
                error={errors.classDocumentId?.message}
                {...register('classDocumentId', { required: 'Class is required' })}
              >
                <option value="">Select Class</option>
                {classes.map((c) => (
                  <option key={c.documentId} value={c.documentId}>
                    {c.name}
                  </option>
                ))}
              </Select>
              <Select
                label="Section"
                disabled={isEdit || !selectedClass}
                error={errors.sectionDocumentId?.message}
                {...register('sectionDocumentId', { required: 'Section is required' })}
              >
                <option value="">Select Section</option>
                {sections.map((s) => (
                  <option key={s.documentId} value={s.documentId}>
                    {s.name} {s.room ? `(${s.room})` : ''}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        );

      case 3:
        const formVals = watch();
        const className = classes.find((c) => c.documentId === formVals.classDocumentId)?.name ?? '—';
        const sectionName = sections.find((s) => s.documentId === formVals.sectionDocumentId)?.name ?? '—';
        const yearName = academicYears.find((y) => y.documentId === formVals.academicYearDocumentId)?.name ?? '—';

        return (
          <div className="space-y-6 text-left">
            <h3 className="text-lg font-bold font-heading text-slate-800 dark:text-white flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-primary-500" /> Review Student Profile
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-white/5">
              <div className="space-y-4">
                <h4 className="text-sm font-extrabold uppercase text-slate-450 dark:text-slate-500 tracking-wider">
                  Personal & Contact
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-350">
                  Name: <span className="font-bold text-slate-950 dark:text-white">{formVals.firstName} {formVals.lastName}</span>
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-350">
                  DOB: <span className="font-bold text-slate-950 dark:text-white">{formVals.dateOfBirth}</span>
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-350">
                  Gender: <span className="font-bold text-slate-950 dark:text-white capitalize">{formVals.gender}</span>
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-350">
                  Phone: <span className="font-bold text-slate-950 dark:text-white">{formVals.phone || '—'}</span>
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-350">
                  Address: <span className="font-bold text-slate-950 dark:text-white">{formVals.address || '—'}</span>
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-extrabold uppercase text-slate-450 dark:text-slate-500 tracking-wider">
                  Guardian & Academic
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-350">
                  Guardian: <span className="font-bold text-slate-950 dark:text-white">{formVals.guardianName} ({formVals.guardianRelationship})</span>
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-350">
                  Guardian Phone: <span className="font-bold text-slate-950 dark:text-white">{formVals.guardianPhone}</span>
                </p>
                {!isEdit && (
                  <>
                    <p className="text-sm text-slate-600 dark:text-slate-350">
                      Admission No: <span className="font-bold text-slate-950 dark:text-white">{formVals.admissionNumber}</span>
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-350">
                      Placement: <span className="font-bold text-slate-950 dark:text-white">{className} - {sectionName} (Roll: {formVals.rollNumber})</span>
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-350">
                      Academic Year: <span className="font-bold text-slate-950 dark:text-white">{yearName}</span>
                    </p>
                  </>
                )}
              </div>
            </div>
            
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">
              Please double check all values. Submitting this form will {isEdit ? 'update the student profile' : 'create the student profile and automatically enroll them in the selected class'}.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <FormProvider {...methods}>
      <Card glass className="max-w-4xl mx-auto shadow-xl">
        <CardBody className="p-6 md:p-10 flex flex-col gap-8">
          {/* Stepper display */}
          <Stepper steps={STEPS} currentStep={isEdit && currentStep === 3 ? 2 : currentStep} />

          {/* Form Content */}
          <form onSubmit={handleSubmit(onFormSubmit)} className="flex-1 mt-4">
            {renderStepContent()}

            {/* Navigation buttons */}
            <div className="flex items-center justify-between border-t border-slate-100 dark:border-white/5 pt-8 mt-8">
              <Button
                type="button"
                variant="ghost"
                disabled={currentStep === 0}
                onClick={handlePrev}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
              >
                Back
              </Button>

              {currentStep < STEPS.length - 1 ? (
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleNext}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Continue
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="secondary"
                  isLoading={isSubmitting}
                  leftIcon={<Save className="w-4 h-4" />}
                >
                  {isEdit ? 'Save Changes' : 'Submit & Enroll'}
                </Button>
              )}
            </div>
          </form>
        </CardBody>
      </Card>
    </FormProvider>
  );
}
