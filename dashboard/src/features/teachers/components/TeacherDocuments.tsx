import { FileText, Image, FileDigit, Landmark, BadgeCheck, Upload, AlertCircle } from 'lucide-react';
import { Card, CardBody } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';

const REQUIRED_DOCS = [
  {
    key: 'degree_cert',
    name: 'Degree Certificate',
    description: 'Postgraduate or undergraduate academic degree verification copy',
    icon: FileDigit,
  },
  {
    key: 'resume',
    name: 'CV / Resume',
    description: 'Latest curriculum vitae displaying detailed academic/work record',
    icon: FileText,
  },
  {
    key: 'national_id',
    name: 'Citizenship / ID Card',
    description: 'National identity card or passport photocopy',
    icon: Image,
  },
  {
    key: 'experience_letter',
    name: 'Experience Letter',
    description: 'Reference or work certification letters from previous institutions',
    icon: Landmark,
  },
  {
    key: 'teaching_license',
    name: 'Teaching License',
    description: 'Official permit or registration license validating teaching authority',
    icon: BadgeCheck,
  },
];

export function TeacherDocuments() {
  return (
    <div className="space-y-6 select-none text-left">
      <div>
        <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white leading-tight">
          Required Teacher Documentation
        </h3>
        <span className="text-xs text-slate-450 dark:text-slate-500 font-semibold mt-0.5 block">
          View and manage files submitted during onboarding
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {REQUIRED_DOCS.map((doc) => {
          const Icon = doc.icon;
          return (
            <Card key={doc.key} className="relative hover:translate-y-0 shadow-sm border border-slate-200/60 dark:border-white/5 bg-white dark:bg-slate-900/50">
              <CardBody className="flex items-start gap-4 p-5">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-450 dark:text-slate-500 rounded-xl shrink-0">
                  <Icon className="w-5.5 h-5.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">
                      {doc.name}
                    </h4>
                    <Badge variant="warning" className="text-2xs font-extrabold uppercase tracking-wider shrink-0 px-2 py-0.5">
                      Pending
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-450 dark:text-slate-500 font-semibold mt-1 leading-normal">
                    {doc.description}
                  </p>
                  
                  {/* Upload Actions Placeholder */}
                  <div className="flex items-center gap-4 mt-4">
                    <button className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-350 cursor-pointer border-none bg-transparent">
                      <Upload className="w-3.5 h-3.5" />
                      Upload File
                    </button>
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800" />
                    <span className="inline-flex items-center gap-1 text-2xs text-slate-400 dark:text-slate-500 font-bold uppercase">
                      <AlertCircle className="w-3 h-3 text-slate-400" />
                      Max 5MB
                    </span>
                  </div>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
