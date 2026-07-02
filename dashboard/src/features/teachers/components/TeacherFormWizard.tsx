import { useState, useEffect } from 'react';
import { useForm, FormProvider, useFieldArray, useFormContext } from 'react-hook-form';
import { ArrowLeft, ArrowRight, Save, User, Briefcase, BookOpen, FileCheck, Plus, Trash2 } from 'lucide-react';
import { Stepper } from '../../../components/ui/Stepper';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { Card, CardBody } from '../../../components/ui/Card';
import { useClasses, useAcademicYears, useSections, useSubjects } from '../hooks/useTeachers';
import type { TeacherProfile, Subject } from '../../../types/teacher.types';
import type { SchoolClass, AcademicYear } from '../../../types/student.types';

interface TeacherFormWizardProps {
  initialTeacher?: TeacherProfile;
  isEdit?: boolean;
  onSubmit: (data: any) => Promise<void>;
  isSubmitting: boolean;
}

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other' | '';
  bloodGroup: string;
  address: string;

  employeeId: string;
  qualification: string;
  joiningDate: string;
  status: string;

  assignments: Array<{
    subjectDocumentId: string;
    classDocumentId: string;
    sectionDocumentId: string;
    academicYearDocumentId: string;
  }>;
}

const STEPS = [
  'Personal Info',
  'Professional Info',
  'Teaching Assignments',
  'Review & Submit',
];

export function TeacherFormWizard({
  initialTeacher,
  isEdit = false,
  onSubmit,
  isSubmitting,
}: TeacherFormWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);

  // 1. Setup Default Values
  const getDefaults = (): FormValues => {
    if (initialTeacher) {
      return {
        firstName: initialTeacher.firstName,
        lastName: initialTeacher.lastName,
        email: initialTeacher.email ?? '',
        phoneNumber: initialTeacher.phoneNumber,
        dateOfBirth: initialTeacher.dateOfBirth ?? '',
        gender: initialTeacher.gender ?? '',
        bloodGroup: initialTeacher.bloodGroup ?? '',
        address: initialTeacher.address ?? '',
        employeeId: initialTeacher.employeeId,
        qualification: initialTeacher.qualification ?? '',
        joiningDate: initialTeacher.joiningDate ?? '',
        status: initialTeacher.status,
        assignments: [], // Managed in Details tab during edit mode
      };
    }

    return {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      dateOfBirth: '',
      gender: '',
      bloodGroup: '',
      address: '',
      employeeId: '',
      qualification: '',
      joiningDate: new Date().toISOString().split('T')[0],
      status: 'active',
      assignments: [],
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
    control,
    formState: { errors },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'assignments',
  });

  // 2. Fetch Placement Metadata
  const { data: classes = [] } = useClasses();
  const { data: academicYears = [] } = useAcademicYears();
  const { data: subjects = [] } = useSubjects();

  // Set default current Academic Year for creation mode if available
  useEffect(() => {
    if (!isEdit && academicYears.length > 0) {
      const currentYear = academicYears.find((y) => y.isCurrent);
      if (currentYear && fields.length === 0) {
        // Pre-populate first assignment row with default year
        // We'll let the user add rows manually
      }
    }
  }, [academicYears, isEdit, fields.length]);

  // 3. Step Validation Before Moving
  const stepFields: Record<number, (keyof FormValues)[]> = {
    0: ['firstName', 'lastName', 'email', 'phoneNumber', 'dateOfBirth', 'gender', 'bloodGroup', 'address'],
    1: ['employeeId', 'qualification', 'joiningDate', 'status'],
    2: ['assignments'],
  };

  const handleNext = async () => {
    const fieldsToValidate = stepFields[currentStep];
    const isStepValid = await trigger(fieldsToValidate);

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
      setCurrentStep(1); // Jump back to Professional Info
    } else {
      setCurrentStep((prev) => Math.max(prev - 1, 0));
    }
  };

  const onFormSubmit = async (values: FormValues) => {
    await onSubmit(values);
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
                placeholder="e.g. Walter"
                error={errors.firstName?.message}
                {...register('firstName', { required: 'First name is required' })}
              />
              <Input
                label="Last Name"
                placeholder="e.g. White"
                error={errors.lastName?.message}
                {...register('lastName', { required: 'Last name is required' })}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                type="email"
                label="Email Address"
                placeholder="e.g. w.white@westfield.edu"
                error={errors.email?.message}
                {...register('email', {
                  required: 'Email address is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
              />
              <Input
                label="Phone Number"
                placeholder="e.g. +1 555-0201"
                error={errors.phoneNumber?.message}
                {...register('phoneNumber', { required: 'Phone number is required' })}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                type="date"
                label="Date of Birth"
                error={errors.dateOfBirth?.message}
                {...register('dateOfBirth')}
              />
              <Select
                label="Gender"
                error={errors.gender?.message}
                {...register('gender')}
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
                placeholder="e.g. A+, O-"
                error={errors.bloodGroup?.message}
                {...register('bloodGroup')}
              />
            </div>
            <Input
              label="Address"
              placeholder="e.g. 308 Negra Arroyo Lane"
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
              <Briefcase className="w-5 h-5 text-primary-500" /> Professional Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Employee ID"
                placeholder="e.g. EMP-2026-001"
                disabled={isEdit}
                error={errors.employeeId?.message}
                {...register('employeeId', { required: 'Employee ID is required' })}
              />
              <Input
                label="Qualification"
                placeholder="e.g. Ph.D. in Chemistry"
                error={errors.qualification?.message}
                {...register('qualification', { required: 'Qualification is required' })}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                type="date"
                label="Joining Date"
                error={errors.joiningDate?.message}
                {...register('joiningDate', { required: 'Joining date is required' })}
              />
              <Select
                label="Employment Status"
                error={errors.status?.message}
                {...register('status', { required: 'Status is required' })}
                options={[
                  { value: 'active', label: 'Active' },
                  { value: 'on_leave', label: 'On Leave' },
                  { value: 'retired', label: 'Retired' },
                  { value: 'resigned', label: 'Resigned' },
                  { value: 'archived', label: 'Archived' },
                ]}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 text-left">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-heading text-slate-800 dark:text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary-500" /> Teaching Assignments
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                leftIcon={<Plus className="w-4 h-4" />}
                onClick={() =>
                  append({
                    subjectDocumentId: '',
                    classDocumentId: '',
                    sectionDocumentId: '',
                    academicYearDocumentId: academicYears.find((y) => y.isCurrent)?.documentId ?? '',
                  })
                }
              >
                Add Assignment
              </Button>
            </div>

            {fields.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-slate-200 dark:border-white/5 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50 select-none">
                <BookOpen className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-500 dark:text-slate-400">No teaching assignments added</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Click Add Assignment to map classes, sections and subjects.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {fields.map((field, idx) => (
                  <AssignmentRow
                    key={field.id}
                    index={idx}
                    remove={remove}
                    classes={classes}
                    academicYears={academicYears}
                    subjects={subjects}
                  />
                ))}
              </div>
            )}
          </div>
        );

      case 3:
        const formVals = watch();
        return (
          <div className="space-y-6 text-left">
            <h3 className="text-lg font-bold font-heading text-slate-800 dark:text-white flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-primary-500" /> Review Teacher Profile
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-white/5">
              <div className="space-y-4">
                <h4 className="text-sm font-extrabold uppercase text-slate-450 dark:text-slate-500 tracking-wider">
                  Personal Information
                </h4>
                <p className="text-sm text-slate-650 dark:text-slate-350">
                  Name: <span className="font-bold text-slate-950 dark:text-white">{formVals.firstName} {formVals.lastName}</span>
                </p>
                <p className="text-sm text-slate-650 dark:text-slate-350">
                  Email: <span className="font-bold text-slate-950 dark:text-white">{formVals.email}</span>
                </p>
                <p className="text-sm text-slate-650 dark:text-slate-350">
                  Phone: <span className="font-bold text-slate-950 dark:text-white">{formVals.phoneNumber}</span>
                </p>
                <p className="text-sm text-slate-650 dark:text-slate-350">
                  DOB: <span className="font-bold text-slate-950 dark:text-white">{formVals.dateOfBirth || '—'}</span>
                </p>
                <p className="text-sm text-slate-650 dark:text-slate-350">
                  Gender: <span className="font-bold text-slate-950 dark:text-white capitalize">{formVals.gender || '—'}</span>
                </p>
                <p className="text-sm text-slate-650 dark:text-slate-350">
                  Address: <span className="font-bold text-slate-950 dark:text-white">{formVals.address || '—'}</span>
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-extrabold uppercase text-slate-450 dark:text-slate-500 tracking-wider">
                  Professional Info
                </h4>
                <p className="text-sm text-slate-650 dark:text-slate-350">
                  Employee ID: <span className="font-bold text-slate-950 dark:text-white">{formVals.employeeId}</span>
                </p>
                <p className="text-sm text-slate-650 dark:text-slate-350">
                  Qualification: <span className="font-bold text-slate-950 dark:text-white">{formVals.qualification}</span>
                </p>
                <p className="text-sm text-slate-650 dark:text-slate-350">
                  Joining Date: <span className="font-bold text-slate-950 dark:text-white">{formVals.joiningDate}</span>
                </p>
                <p className="text-sm text-slate-650 dark:text-slate-350">
                  Status: <span className="font-bold text-slate-950 dark:text-white capitalize">{formVals.status}</span>
                </p>
                {!isEdit && (
                  <p className="text-sm text-slate-650 dark:text-slate-350">
                    Teaching Assignments: <span className="font-bold text-slate-950 dark:text-white">{formVals.assignments.length} assigned</span>
                  </p>
                )}
              </div>
            </div>

            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">
              Please double check all values. Submitting this form will {isEdit ? 'update the teacher profile.' : 'create the teacher profile and assign their initial teaching classes.'}
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
                  {isEdit ? 'Save Changes' : 'Submit & Register'}
                </Button>
              )}
            </div>
          </form>
        </CardBody>
      </Card>
    </FormProvider>
  );
}

// ─── Nested Assignment Row Component ──────────────────────────────────────────

function AssignmentRow({
  index,
  remove,
  classes,
  academicYears,
  subjects,
}: {
  index: number;
  remove: (index: number) => void;
  classes: SchoolClass[];
  academicYears: AcademicYear[];
  subjects: Subject[];
}) {
  const { register, watch, setValue, formState: { errors } } = useFormContext<FormValues>();
  const selectedClass = watch(`assignments.${index}.classDocumentId`);
  const selectedAcademicYear = watch(`assignments.${index}.academicYearDocumentId`);

  // Fetch sections dynamically for this row's class and academic year
  const { data: sections = [] } = useSections(selectedClass || undefined, selectedAcademicYear || undefined);

  // Reset section if class changes
  useEffect(() => {
    setValue(`assignments.${index}.sectionDocumentId`, '');
  }, [selectedClass, setValue, index]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-white/5 rounded-2xl relative group items-end">
      
      {/* Subject */}
      <Select
        label="Subject"
        error={(errors.assignments?.[index] as any)?.subjectDocumentId?.message}
        {...register(`assignments.${index}.subjectDocumentId`, { required: 'Subject is required' })}
      >
        <option value="">Select Subject</option>
        {subjects.map((sub) => (
          <option key={sub.documentId} value={sub.documentId}>
            {sub.name} ({sub.code})
          </option>
        ))}
      </Select>

      {/* Class */}
      <Select
        label="Class"
        error={(errors.assignments?.[index] as any)?.classDocumentId?.message}
        {...register(`assignments.${index}.classDocumentId`, { required: 'Class is required' })}
      >
        <option value="">Select Class</option>
        {classes.map((cls) => (
          <option key={cls.documentId} value={cls.documentId}>
            {cls.name}
          </option>
        ))}
      </Select>

      {/* Section */}
      <Select
        label="Section"
        disabled={!selectedClass}
        error={(errors.assignments?.[index] as any)?.sectionDocumentId?.message}
        {...register(`assignments.${index}.sectionDocumentId`, { required: 'Section is required' })}
      >
        <option value="">Select Section</option>
        {sections.map((sec) => (
          <option key={sec.documentId} value={sec.documentId}>
            {sec.name} {sec.room ? `(${sec.room})` : ''}
          </option>
        ))}
      </Select>

      {/* Academic Year */}
      <div className="flex gap-3 items-end w-full">
        <div className="flex-1">
          <Select
            label="Academic Year"
            error={(errors.assignments?.[index] as any)?.academicYearDocumentId?.message}
            {...register(`assignments.${index}.academicYearDocumentId`, { required: 'Academic Year is required' })}
          >
            <option value="">Select Academic Year</option>
            {academicYears.map((ay) => (
              <option key={ay.documentId} value={ay.documentId}>
                {ay.name} {ay.isCurrent ? '(Current)' : ''}
              </option>
            ))}
          </Select>
        </div>
        <Button
          type="button"
          variant="ghost"
          onClick={() => remove(index)}
          className="mb-1 p-2.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl cursor-pointer"
        >
          <Trash2 className="w-4.5 h-4.5" />
        </Button>
      </div>
    </div>
  );
}
