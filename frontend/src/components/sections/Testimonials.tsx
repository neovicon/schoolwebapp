import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  rating: number;
}

interface TestimonialsProps {
  title?: string;
  subtitle?: string;
  testimonials?: Testimonial[];
}

const defaultTestimonials: Testimonial[] = [
  {
    quote: "The academic rigor combined with a supportive environment has truly helped my child flourish. The teachers go above and beyond.",
    author: "Sarah Johnson",
    role: "Parent of Grade 8 Student",
    rating: 5,
  },
  {
    quote: "Moving to this school was the best decision for our family. The focus on both academics and character development is outstanding.",
    author: "Michael Chen",
    role: "Parent of Grade 5 Student",
    rating: 5,
  },
  {
    quote: "I love the extracurricular activities offered here. They have helped me discover my passion for robotics and debate.",
    author: "Emily Davis",
    role: "Grade 10 Student",
    rating: 4,
  },
  {
    quote: "A truly inclusive and diverse community. My children look forward to going to school every single day.",
    author: "Robert Wilson",
    role: "Parent of Grade 2 & 4 Students",
    rating: 5,
  }
];

export default function Testimonials({ title = 'What Our Community Says', subtitle = 'Read stories from parents and students about their experience with us.', testimonials = defaultTestimonials }: TestimonialsProps) {
  return (
    <section className="py-24 relative overflow-hidden bg-slate-50 dark:bg-slate-950">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-400/10 filter blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary-400/10 filter blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-noise opacity-50 pointer-events-none" />

      <div className="container-custom relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary-500/20 text-sm font-bold text-primary-600 dark:text-primary-400 mb-6">
            <Star className="w-4 h-4 fill-primary-500" />
            Testimonials
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-heading text-slate-900 dark:text-white tracking-tighter mb-6">{title}</h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 font-light">{subtitle}</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="pb-16"
        >
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            pagination={{ clickable: true, dynamicBullets: true }}
            className="w-full !pb-16"
          >
            {testimonials.map((testimonial, index) => (
              <SwiperSlide key={index} className="h-auto pb-4">
                <div className="glass-card h-full p-8 flex flex-col relative group">
                  <div className="absolute top-6 right-8 text-primary-200 dark:text-primary-900/50 group-hover:scale-110 transition-transform duration-300">
                    <Quote className="w-12 h-12" />
                  </div>
                  
                  <div className="flex text-amber-400 mb-8 relative z-10">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-5 h-5 ${i < testimonial.rating ? 'fill-current' : 'text-slate-200 dark:text-slate-700'}`} />
                    ))}
                  </div>
                  
                  <blockquote className="text-slate-700 dark:text-slate-300 mb-8 flex-grow text-lg leading-relaxed relative z-10">
                    "{testimonial.quote}"
                  </blockquote>
                  
                  <div className="mt-auto relative z-10 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                      {testimonial.author.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{testimonial.author}</p>
                      <p className="text-sm font-medium text-primary-600 dark:text-primary-400">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  );
}