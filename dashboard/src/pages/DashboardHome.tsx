import { useState } from 'react';
import { 
  GraduationCap, 
  Calendar, 
  BookOpen, 
  Award, 
  PlusCircle, 
  HelpCircle,
  FileText
} from 'lucide-react';
import { StatCard } from '../components/dashboard/StatCard';
import { DataTable } from '../components/dashboard/DataTable';
import type { Column } from '../components/dashboard/DataTable';
import { AlertBanner } from '../components/dashboard/AlertBanner';
import { FormSection } from '../components/forms/FormSection';
import { Accordion } from '../components/ui/Accordion';
import { Tabs } from '../components/ui/Tabs';
import type { Tab } from '../components/ui/Tabs';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Stepper } from '../components/ui/Stepper';

// Mock Data Types
interface Assignment {
  subject: string;
  title: string;
  dueDate: string;
  status: 'Pending' | 'Completed' | 'Overdue';
}

interface Exam {
  subject: string;
  type: string;
  date: string;
  room: string;
}

const mockAssignments: Assignment[] = [
  { subject: 'Chemistry 101', title: 'Lab Report 3: Acid/Base Titration', dueDate: 'Jul 01, 2026', status: 'Pending' },
  { subject: 'Advanced Physics', title: 'Chapter 4: Special Relativity Problems', dueDate: 'Jul 02, 2026', status: 'Pending' },
  { subject: 'Calculus II', title: 'Exercises 5.4: Integration by Parts', dueDate: 'Jun 25, 2026', status: 'Completed' },
  { subject: 'English Literature', title: 'Comparative Essay Draft', dueDate: 'Jun 20, 2026', status: 'Completed' },
];

const mockExams: Exam[] = [
  { subject: 'Calculus II', type: 'Final Examination', date: 'Jul 10, 2026', room: 'Hall B' },
  { subject: 'Chemistry 101', type: 'Lab Practical Assessment', date: 'Jul 12, 2026', room: 'Lab 304' },
  { subject: 'English Literature', type: 'Oral Presentation', date: 'Jul 15, 2026', room: 'Room 201' },
];

export function DashboardHome() {
  const [activeTab, setActiveTab] = useState('assignments');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');
  const [details, setDetails] = useState('');
  const [errors, setErrors] = useState<{ name?: string; grade?: string }>({});

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { name?: string; grade?: string } = {};
    if (!name.trim()) newErrors.name = 'Full name is required';
    if (!grade.trim()) newErrors.grade = 'Grade / Class is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 5000);
    setName('');
    setGrade('');
    setDetails('');
  };

  const tabs: Tab[] = [
    { label: 'Active Assignments', value: 'assignments' },
    { label: 'Upcoming Exams', value: 'exams' },
  ];

  // DataTable Columns Configuration
  const assignmentColumns: Column<Assignment>[] = [
    { header: 'Subject', accessorKey: 'subject' },
    { header: 'Assignment Title', accessorKey: 'title' },
    { header: 'Due Date', accessorKey: 'dueDate' },
    { 
      header: 'Status', 
      accessorKey: 'status',
      align: 'right',
      render: (row) => {
        const variants = {
          Pending: 'info',
          Completed: 'success',
          Overdue: 'danger'
        } as const;
        return <Badge variant={variants[row.status]}>{row.status}</Badge>;
      }
    }
  ];

  const examColumns: Column<Exam>[] = [
    { header: 'Subject', accessorKey: 'subject' },
    { header: 'Assessment Type', accessorKey: 'type' },
    { header: 'Scheduled Date', accessorKey: 'date' },
    { 
      header: 'Location / Room', 
      accessorKey: 'room',
      align: 'right',
      render: (row) => <Badge variant="secondary">{row.room}</Badge>
    }
  ];

  const faqItems = [
    {
      title: 'How do I submit my course assignments online?',
      content: 'Navigate to the Assignments tab in the sidebar, click on the pending assignment item, upload your PDF or document attachment, and click Submit. You will receive an email confirmation containing your transaction ID.'
    },
    {
      title: 'When is the term enrollment fee payment due?',
      content: 'Term enrollment fees are due in full by the first day of classes for each term. You can set up a monthly payment plan in the Tuition & Billing portal (accessible via settings) before the deadline.'
    },
    {
      title: 'How do I schedule an appointment with my Academic Advisor?',
      content: 'Under your Profile settings page, scroll to Advisor Appointments, pick a date and time slot from the scheduling widget, and outline your discussion topics. A meeting link will be emailed to you.'
    }
  ];

  return (
    <div className="space-y-8 select-none text-left">
      
      {/* Alert Notices */}
      <AlertBanner 
        type="info" 
        message="System Maintenance Window" 
        description="The school portal will undergo scheduled maintenance this Sunday from 02:00 AM to 04:00 AM UTC. Some features may be temporarily unavailable." 
      />

      {formSubmitted && (
        <AlertBanner
          type="success"
          message="Inquiry Submitted Successfully!"
          description="Your admissions inquiry has been recorded. Our counselors will reach out to you within 2 business days."
          isDismissible
        />
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Attendance" 
          value="95.4%" 
          icon={<Calendar className="w-6 h-6" />}
          trend={{ value: '+1.2%', isPositive: true }}
          description="VS LAST MONTH"
        />
        <StatCard 
          title="Pending Assignments" 
          value="2 Pending" 
          icon={<BookOpen className="w-6 h-6" />}
          trend={{ value: '2 Due Tomorrow', isPositive: false }}
          description="DEADLINE SOON"
        />
        <StatCard 
          title="GPA Average" 
          value="3.82" 
          icon={<Award className="w-6 h-6" />}
          trend={{ value: '+0.06', isPositive: true }}
          description="CUMULATIVE SCORE"
        />
        <StatCard 
          title="Total Credits" 
          value="48 / 120" 
          icon={<GraduationCap className="w-6 h-6" />}
          description="DEGREE COMPLETED"
        />
      </div>

      {/* Central Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Interactive Tab list and details */}
        <div className="lg:col-span-2 space-y-6 flex flex-col items-stretch">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <Tabs tabs={tabs} value={activeTab} onChange={setActiveTab} className="w-full sm:w-auto" />
            
            {/* Modal Trigger */}
            <Button 
              variant="outline" 
              size="sm" 
              leftIcon={<PlusCircle className="w-4 h-4" />}
              onClick={() => setIsModalOpen(true)}
              className="cursor-pointer"
            >
              Enrollment Stepper Demo
            </Button>
          </div>

          <div className="flex-1">
            {activeTab === 'assignments' ? (
              <DataTable columns={assignmentColumns} data={mockAssignments} />
            ) : (
              <DataTable columns={examColumns} data={mockExams} />
            )}
          </div>
        </div>

        {/* Right: FAQs and Help Resources */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm flex flex-col">
            <div className="flex items-center gap-2.5 mb-6 text-slate-900 dark:text-white">
              <HelpCircle className="w-5.5 h-5.5 text-primary-500" />
              <h3 className="text-lg font-bold font-heading">Frequently Asked Questions</h3>
            </div>
            <Accordion items={faqItems} />
          </div>
        </div>

      </div>

      {/* Bottom Row: Forms Demonstration */}
      <div className="w-full">
        <form onSubmit={handleFormSubmit}>
          <FormSection 
            title="Admissions Inquiry Form" 
            description="Use this form to submit inquiries directly to our enrollment council. All fields marked with label are evaluated."
          >
            <Input 
              label="Full Name" 
              placeholder="e.g. Sarah Connor" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
            />
            <Input 
              label="Intended Grade / Level" 
              placeholder="e.g. Class 11 - Science" 
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              error={errors.grade}
            />
            <div className="md:col-span-2">
              <Input 
                label="Inquiry Details" 
                placeholder="Briefly describe what information you require..." 
                multiline 
                rows={4}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
              />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <Button type="submit" variant="primary" className="cursor-pointer">
                Submit Inquiry Info
              </Button>
            </div>
          </FormSection>
        </form>
      </div>

      {/* Showcase Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Admissions Progress Stepper">
        <div className="space-y-6">
          <Stepper 
            steps={['Profile Setup', 'Documents Upload', 'Billing Info', 'Final Review']} 
            currentStep={currentStep} 
          />
          
          <div className="py-6 border-y border-slate-100 dark:border-white/5 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-primary-50 dark:bg-primary-950/20 text-primary-500 flex items-center justify-center mb-3">
              <FileText className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-800 dark:text-white">
              Step {currentStep + 1}: {['Set up your bio information', 'Upload transcripts & ID card', 'Provide registration payment details', 'Verify and sign application'][currentStep]}
            </h4>
            <p className="text-sm text-slate-400 mt-1 max-w-sm">
              Use the control triggers below to test the Stepper progress line and scale states.
            </p>
          </div>

          <div className="flex justify-between">
            <Button 
              variant="outline" 
              size="sm" 
              disabled={currentStep === 0} 
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="cursor-pointer"
            >
              Previous Step
            </Button>
            {currentStep < 3 ? (
              <Button 
                variant="primary" 
                size="sm" 
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="cursor-pointer"
              >
                Next Step
              </Button>
            ) : (
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => setIsModalOpen(false)}
                className="cursor-pointer"
              >
                Finish Enrollment
              </Button>
            )}
          </div>
        </div>
      </Modal>

    </div>
  );
}
