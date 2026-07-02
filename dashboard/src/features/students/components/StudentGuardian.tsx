import { ShieldAlert, UserCheck, Phone, Heart } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../../components/ui/Card';
import type { StudentProfile } from '../../../types/student.types';

interface StudentGuardianProps {
  student: StudentProfile;
}

export function parseEmergencyContact(contactStr?: string) {
  if (!contactStr) {
    return { name: '—', phone: '—', relation: '—' };
  }
  
  try {
    const parts = contactStr.split('-');
    const namePhonePart = parts[0]?.trim() ?? '';
    const relation = parts[1]?.trim() ?? 'Guardian';
    
    const phoneStart = namePhonePart.indexOf('(');
    const phoneEnd = namePhonePart.indexOf(')');
    
    if (phoneStart !== -1 && phoneEnd !== -1) {
      const name = namePhonePart.substring(0, phoneStart).trim();
      const phone = namePhonePart.substring(phoneStart + 1, phoneEnd).trim();
      return { name: name || '—', phone: phone || '—', relation: relation || '—' };
    }
    
    return { name: namePhonePart || '—', phone: '—', relation: relation || '—' };
  } catch {
    return { name: contactStr, phone: '—', relation: '—' };
  }
}

export function StudentGuardian({ student }: StudentGuardianProps) {
  const { name, phone, relation } = parseEmergencyContact(student.emergencyContact);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 select-none text-left">
      
      {/* Guardian Details Card */}
      <Card>
        <CardHeader className="flex items-center gap-3">
          <div className="p-2 bg-primary-50 dark:bg-primary-950/20 text-primary-650 dark:text-primary-400 rounded-xl">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white leading-tight">
              Primary Guardian
            </h3>
            <span className="text-xs text-slate-450 dark:text-slate-500 font-semibold">
              Primary contact person details
            </span>
          </div>
        </CardHeader>

        <CardBody className="space-y-4">
          <div>
            <span className="text-xs text-slate-450 dark:text-slate-500 font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-slate-400" /> Guardian Name
            </span>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">{name}</p>
          </div>

          <hr className="border-slate-100 dark:border-white/5" />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-slate-450 dark:text-slate-500 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-slate-400" /> Relationship
              </span>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1 capitalize">{relation}</p>
            </div>
            <div>
              <span className="text-xs text-slate-450 dark:text-slate-500 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" /> Phone Number
              </span>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">{phone}</p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Emergency Contact & Alternate Card */}
      <Card>
        <CardHeader className="flex items-center gap-3">
          <div className="p-2 bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400 rounded-xl">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white leading-tight">
              Emergency Contact String
            </h3>
            <span className="text-xs text-slate-450 dark:text-slate-500 font-semibold">
              Raw emergency contact representation in the ERP
            </span>
          </div>
        </CardHeader>

        <CardBody className="space-y-4">
          <div>
            <span className="text-xs text-slate-450 dark:text-slate-500 font-semibold uppercase tracking-wider">
              System Value
            </span>
            <div className="mt-2.5 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-white/5">
              <code className="text-xs font-mono font-bold text-slate-700 dark:text-slate-350 select-text break-all">
                {student.emergencyContact ?? '—'}
              </code>
            </div>
          </div>
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 leading-relaxed">
            The emergency contact string is structured as <code>Name (Phone Number) - Relationship</code> to support flexible legacy schemas without schema migration overhead.
          </p>
        </CardBody>
      </Card>

    </div>
  );
}
