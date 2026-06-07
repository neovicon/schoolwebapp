import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { Star } from 'lucide-react';

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
    <section className="py-24 bg-white">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-slate-900 mb-4">{title}</h2>
          <p className="text-lg text-slate-600">{subtitle}</p>
        </div>

        <div className="pb-12">
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
            className="w-full"
          >
            {testimonials.map((testimonial, index) => (
              <SwiperSlide key={index} className="h-auto">
                <div className="bg-slate-50 p-8 rounded-2xl h-full flex flex-col border border-slate-100">
                  <div className="flex text-yellow-400 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-5 h-5 ${i < testimonial.rating ? 'fill-current' : 'text-slate-300'}`} />
                    ))}
                  </div>
                  <blockquote className="text-slate-700 mb-8 flex-grow text-lg leading-relaxed italic">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="mt-auto">
                    <p className="font-semibold text-slate-900">{testimonial.author}</p>
                    <p className="text-sm text-slate-500">{testimonial.role}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}