import React from 'react';
import { Users, GraduationCap, Building, Trophy, Shield, Monitor } from 'lucide-react';

interface FeatureItem {
  id: number;
  title: string;
  description: string;
  icon: string;
}

interface FeaturesProps {
  title?: string;
  subtitle?: string;
  features?: FeatureItem[];
}

const defaultFeatures: FeatureItem[] = [
  { id: 1, title: 'Small Class Sizes', description: 'Personalized attention for every student to maximize learning potential.', icon: 'Users' },
  { id: 2, title: 'Experienced Faculty', description: 'Learn from highly qualified educators dedicated to student success.', icon: 'GraduationCap' },
  { id: 3, title: 'Modern Facilities', description: 'State-of-the-art labs, libraries, and sports complexes.', icon: 'Building' },
  { id: 4, title: 'Extracurricular Activities', description: 'A wide range of clubs and sports to develop well-rounded individuals.', icon: 'Trophy' },
  { id: 5, title: 'Safe Environment', description: 'Secure campus with 24/7 monitoring and strict safety protocols.', icon: 'Shield' },
  { id: 6, title: 'Technology-driven Learning', description: 'Integrating modern tech tools for interactive and effective education.', icon: 'Monitor' },
];

const iconMap: Record<string, React.ElementType> = {
  Users, GraduationCap, Building, Trophy, Shield, Monitor
};

export default function Features({ title = 'Why Choose Us?', subtitle = 'Discover what makes our school the best choice for your child.', features = defaultFeatures }: FeaturesProps) {
  return (
    <section className="py-24 bg-slate-50">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-slate-900 mb-4">{title}</h2>
          <p className="text-lg text-slate-600">{subtitle}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = iconMap[feature.icon] || Users;
            return (
              <div key={feature.id} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
                <div className="w-14 h-14 bg-primary-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary-600 transition-colors">
                  <Icon className="w-7 h-7 text-primary-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-semibold font-heading text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed line-clamp-2">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}