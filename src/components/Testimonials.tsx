import React from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import useEmblaCarousel from 'embla-carousel-react';
import { Tables } from '@/integrations/supabase/types';

type Testimonial = Tables<"testimonials">;

const Testimonials = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });

  const { data: testimonials = [], isLoading, error } = useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_published', true)
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as Testimonial[];
    }
  });

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  // Don't render section if no testimonials and not loading
  if (!isLoading && testimonials.length === 0) {
    return null;
  }

  return (
    <section id="testimonials" className="section-padding bg-white">
      <div className="container mx-auto">
        <h2 className="section-title text-center">What Our Clients Say</h2>
        <p className="section-subtitle text-center">
          Don't just take our word for it - hear from businesses that trust Buckeye DataCom
        </p>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-50 p-6 rounded-lg">
                <div className="flex mb-4 gap-1">
                  {[...Array(5)].map((_, j) => (
                    <Skeleton key={j} className="w-5 h-5 rounded" />
                  ))}
                </div>
                <Skeleton className="h-24 w-full mb-6" />
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-4 w-48" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">Failed to load testimonials</p>
          </div>
        ) : testimonials.length <= 3 ? (
          // Grid for 3 or fewer testimonials
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        ) : (
          // Carousel for more than 3 testimonials
          <div className="relative mt-12">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex gap-6">
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="flex-[0_0_100%] min-w-0 md:flex-[0_0_33.333%]">
                    <TestimonialCard testimonial={testimonial} />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Carousel Controls */}
            <button
              onClick={scrollPrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6 text-buckeye-gray" />
            </button>
            <button
              onClick={scrollNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6 text-buckeye-gray" />
            </button>
          </div>
        )}
        
        <div className="mt-12 text-center">
          <p className="text-buckeye-gray font-medium">
            Join hundreds of satisfied businesses across Ohio who trust Buckeye DataCom
          </p>
        </div>
      </div>
    </section>
  );
};

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
  const rating = testimonial.rating || 5;
  const displayPosition = [testimonial.position, testimonial.company]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow h-full flex flex-col">
      <div className="flex mb-4">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} size={20} fill="#BB0000" color="#BB0000" />
        ))}
        {[...Array(5 - rating)].map((_, i) => (
          <Star key={i + rating} size={20} color="#E5E5E5" />
        ))}
      </div>
      <p className="text-buckeye-gray italic mb-6 flex-grow">
        "{testimonial.quote}"
      </p>
      <div className="mt-auto">
        <p className="font-bold text-buckeye-black">{testimonial.name}</p>
        {displayPosition && (
          <p className="text-sm text-buckeye-gray">{displayPosition}</p>
        )}
      </div>
    </div>
  );
};

export default Testimonials;
