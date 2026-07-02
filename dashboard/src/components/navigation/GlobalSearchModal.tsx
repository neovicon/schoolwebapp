import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, GraduationCap, ArrowRight, Loader2, Command } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { useGlobalStudentSearch } from '../../features/students/hooks/useStudents';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const navigate = useNavigate();

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(handler);
  }, [query]);

  // Query hook
  const { data: results = [], isLoading } = useGlobalStudentSearch(debouncedQuery);

  // Keyboard shortcut listener for global open (⌘K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent standard browser search on ⌘K / Ctrl+K and toggle our modal instead
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Since the parent manages state, we dispatch a custom event
        window.dispatchEvent(new CustomEvent('global-search:toggle'));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectStudent = (docId: string) => {
    onClose();
    setQuery('');
    navigate(`/admin/students/${docId}`);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-xl">
      <div className="space-y-4 select-none text-left">
        
        {/* Header / Info */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/5">
          <div className="flex items-center gap-2.5">
            <Search className="w-5 h-5 text-primary-500" />
            <h3 className="text-base font-extrabold text-slate-800 dark:text-white">
              Global Portal Search
            </h3>
          </div>
          <div className="flex items-center gap-1 text-2xs font-bold text-slate-400 dark:text-slate-500 uppercase">
            <Command className="w-3.5 h-3.5" />
            <span>K</span>
          </div>
        </div>

        {/* Input */}
        <div className="relative">
          <Input
            placeholder="Search students by name, admission no, roll no..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pr-10"
            autoFocus
          />
          {isLoading && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
              <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
            </div>
          )}
        </div>

        {/* Results Container */}
        <div className="max-h-72 overflow-y-auto space-y-2 pt-2">
          {debouncedQuery.trim().length < 2 ? (
            <div className="py-6 text-center text-xs font-bold text-slate-400 dark:text-slate-500">
              Type at least 2 characters to search records...
            </div>
          ) : results.length === 0 && !isLoading ? (
            <div className="py-6 text-center text-xs font-bold text-slate-400 dark:text-slate-500 flex flex-col items-center gap-2">
              <GraduationCap className="w-6 h-6 text-slate-350" />
              No matching records found for "{debouncedQuery}"
            </div>
          ) : (
            results.map((student) => (
              <button
                key={student.documentId}
                onClick={() => handleSelectStudent(student.documentId)}
                className="flex items-center justify-between w-full p-3.5 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 border border-transparent hover:border-slate-200/50 dark:hover:border-white/5 transition-all text-left cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-50 dark:bg-primary-950/10 text-primary-650 dark:text-primary-400 rounded-lg">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {student.fullName}
                    </h4>
                    <span className="text-2xs font-bold text-slate-450 dark:text-slate-500 mt-0.5 block">
                      Adm No: {student.admissionNumber} {student.currentEnrollment ? `· ${student.currentEnrollment.className} (${student.currentEnrollment.sectionName})` : ''}
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </button>
            ))
          )}
        </div>

      </div>
    </Modal>
  );
}
