import { User, Calendar, HelpCircle, Droplet, Phone, MapPin, Mail } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../../components/ui/Card';
import type { StudentProfile } from '../../../types/student.types';

interface StudentOverviewProps {
  student: StudentProfile;
}

export function StudentOverview({ student }: StudentOverviewProps) {
  // Format Date Of Birth
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 select-none text-left">
      
      {/* Card 1: Personal Details */}
      <Card>
        <CardHeader className="flex items-center gap-3">
          <div className="p-2 bg-primary-50 dark:bg-primary-950/20 text-primary-650 dark:text-primary-400 rounded-xl">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white leading-tight">
              Personal Details
            </h3>
            <span className="text-xs text-slate-450 dark:text-slate-500 font-semibold">
              Demographic and general attributes
            </span>
          </div>
        </CardHeader>
        
        <CardBody className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-slate-450 dark:text-slate-500 font-semibold uppercase tracking-wider">First Name</span>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">{student.firstName}</p>
            </div>
            <div>
              <span className="text-xs text-slate-450 dark:text-slate-500 font-semibold uppercase tracking-wider">Last Name</span>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">{student.lastName}</p>
            </div>
          </div>

          <hr className="border-slate-100 dark:border-white/5" />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-slate-450 dark:text-slate-500 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> Date of Birth
              </span>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">{formatDate(student.dateOfBirth)}</p>
            </div>
            <div>
              <span className="text-xs text-slate-450 dark:text-slate-500 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-slate-400" /> Gender
              </span>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1 capitalize">{student.gender ?? '—'}</p>
            </div>
          </div>

          <hr className="border-slate-100 dark:border-white/5" />

          <div>
            <span className="text-xs text-slate-450 dark:text-slate-500 font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Droplet className="w-3.5 h-3.5 text-slate-400" /> Blood Group
            </span>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">{student.bloodGroup ?? '—'}</p>
          </div>
        </CardBody>
      </Card>

      {/* Card 2: Contact Information */}
      <Card>
        <CardHeader className="flex items-center gap-3">
          <div className="p-2 bg-secondary-50 dark:bg-secondary-950/20 text-secondary-650 dark:text-secondary-400 rounded-xl">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white leading-tight">
              Contact Details
            </h3>
            <span className="text-xs text-slate-450 dark:text-slate-500 font-semibold">
              Contact address and digital reachability
            </span>
          </div>
        </CardHeader>

        <CardBody className="space-y-4">
          <div>
            <span className="text-xs text-slate-450 dark:text-slate-500 font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" /> Email Address
            </span>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
              {student.user?.email ?? 'No system user account linked'}
            </p>
          </div>

          <hr className="border-slate-100 dark:border-white/5" />

          <div>
            <span className="text-xs text-slate-450 dark:text-slate-500 font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" /> Phone Number
            </span>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">{student.phone ?? '—'}</p>
          </div>

          <hr className="border-slate-100 dark:border-white/5" />

          <div>
            <span className="text-xs text-slate-450 dark:text-slate-500 font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" /> Residential Address
            </span>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1 leading-relaxed">{student.address ?? '—'}</p>
          </div>
        </CardBody>
      </Card>

    </div>
  );
}
