import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useSchoolSettings } from '../hooks/useSchoolSettings';
import { Award, BookOpen, Users, Globe, Heart, Target } from 'lucide-react';
import { usePageBackground } from '../hooks/usePageBackground';

export default function About() {
  const { data: bgImage } = usePageBackground('about');
  const { data: settings } = useSchoolSettings();

  const values = [
    { title: 'Excellence', description: 'Striving for the highest standards in all endeavors.', icon: Award },
    { title: 'Integrity', description: 'Acting with honesty, transparency, and moral courage.', icon: Heart },
    { title: 'Innovation', description: 'Embracing new ideas and creative problem-solving.', icon: Target },
    { title: 'Diversity', description: 'Celebrating differences and fostering an inclusive community.', icon: Globe },
    { title: 'Collaboration', description: 'Working together to achieve common goals.', icon: Users },
    { title: 'Lifelong Learning', description: 'Cultivating a continuous thirst for knowledge.', icon: BookOpen },
  ];

  const timeline = [
    { year: '1995', title: 'Foundation', description: 'Global Excellence Academy was established with a vision to provide world-class education.' },
    { year: '2002', title: 'Campus Expansion', description: 'Inaugurated the new science wing and state-of-the-art sports complex.' },
    { year: '2010', title: 'International Recognition', description: 'Awarded the prestigious Global Education Award for innovative curriculum.' },
    { year: '2018', title: 'Digital Transformation', description: 'Integrated smart classrooms and 1:1 device programs across all grades.' },
    { year: '2023', title: 'Sustainability Initiative', description: 'Achieved 100% renewable energy usage across the entire campus.' },
  ];

  return (
    <>
      <Helmet>
        <title>About Us - {settings?.name || 'Global Excellence Academy'}</title>
        <meta name="description" content="Learn about our history, mission, vision, and core values." />
      </Helmet>

      {/* Hero Banner */}
      <section 
        className="bg-primary-900 py-20 text-center text-white relative"
        style={bgImage ? { backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
      >
        {bgImage && <div className="absolute inset-0 bg-primary-900/80"></div>}
        <div className="container-custom relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">About Us</h1>
          <p className="text-lg md:text-xl text-primary-100 max-w-2xl mx-auto">
            Discover our rich history, inspiring mission, and the core values that drive our commitment to educational excellence.
          </p>
        </div>
      </section>

      {/* Principal's Message */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="w-full md:w-1/3">
              <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[3/4]">
                <img 
                  src="https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=1000&auto=format&fit=crop" 
                  alt="Principal" 
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-900/80 to-transparent p-6 text-white text-center">
                  <h3 className="text-xl font-bold font-heading">Dr. Sarah Williams</h3>
                  <p className="text-primary-200">Principal</p>
                </div>
              </div>
            </div>
            <div className="w-full md:w-2/3">
              <h2 className="text-3xl font-bold font-heading text-slate-900 mb-6">A Message from the Principal</h2>
              <div className="prose prose-lg text-slate-600 max-w-none">
                <p>
                  Welcome to {settings?.name || 'Global Excellence Academy'}. For over two decades, our institution has been at the forefront of providing holistic, world-class education.
                </p>
                <p>
                  We believe that every child is unique and possesses immense potential. Our role as educators is not just to impart knowledge, but to ignite curiosity, foster critical thinking, and instill values that will guide our students throughout their lives.
                </p>
                <p>
                  In a rapidly changing world, we equip our students with the skills they need to adapt, innovate, and lead. Our dedicated faculty, modern facilities, and rigorous curriculum ensure that our graduates are well-prepared for the challenges and opportunities of the future.
                </p>
                <p className="font-medium text-slate-800 italic mt-6">
                  "Education is the most powerful weapon which you can use to change the world."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-slate-50">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-6">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold font-heading text-slate-900 mb-4">Our Mission</h3>
              <p className="text-slate-600 leading-relaxed text-lg">
                To empower students with the knowledge, skills, and values necessary to achieve academic excellence, personal growth, and global citizenship in a nurturing and inclusive environment.
              </p>
            </div>
            <div className="bg-primary-900 text-white p-10 rounded-2xl shadow-sm flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary-800 text-primary-200 rounded-full flex items-center justify-center mb-6">
                <Globe className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold font-heading mb-4">Our Vision</h3>
              <p className="text-primary-100 leading-relaxed text-lg">
                To be a globally recognized institution that cultivates lifelong learners, innovative thinkers, and compassionate leaders who positively impact the world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold font-heading text-slate-900 mb-4">Our Core Values</h2>
            <p className="text-lg text-slate-600">The guiding principles that shape our school culture and community.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                <div className="w-14 h-14 bg-white shadow-sm rounded-lg flex items-center justify-center text-primary-600 mb-4">
                  <value.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-semibold font-heading text-slate-900 mb-2">{value.title}</h3>
                <p className="text-slate-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-slate-50">
        <div className="container-custom max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold font-heading text-slate-900 mb-4">Our History</h2>
            <p className="text-lg text-slate-600">A journey of excellence and continuous growth.</p>
          </div>
          <div className="relative border-l-2 border-primary-200 ml-3 md:ml-6 space-y-12">
            {timeline.map((item, index) => (
              <div key={index} className="relative pl-8 md:pl-12">
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-primary-600 ring-4 ring-white"></div>
                <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4 mb-2">
                  <span className="text-primary-600 font-bold text-xl">{item.year}</span>
                  <h3 className="text-xl font-semibold text-slate-900">{item.title}</h3>
                </div>
                <p className="text-slate-600 text-lg leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Accreditations */}
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="container-custom text-center">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-8">Accreditations & Affiliations</h3>
          <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
             {/* Placeholder for logos */}
            <div className="text-2xl font-bold font-heading text-slate-300">Cambridge</div>
            <div className="text-2xl font-bold font-heading text-slate-300">IB World School</div>
            <div className="text-2xl font-bold font-heading text-slate-300">CIS</div>
            <div className="text-2xl font-bold font-heading text-slate-300">NEASC</div>
          </div>
        </div>
      </section>
    </>
  );
}