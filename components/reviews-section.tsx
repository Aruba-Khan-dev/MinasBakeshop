'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Quote, CheckCircle } from 'lucide-react';
import StarRating from './star-rating';
import { supabase } from '@/lib/supabase';

interface Review {
  id: number;
  name: string;
  date: string;
  rating: number;
  text: string;
}

const curatedReviews: Review[] = [
  {
    id: 1,
    name: 'Customer',
    date: 'April 2026',
    rating: 5,
    text: "Thankyouuu so so so much for making very cutesy boxes and the cake was sooo good. The packaging ufff I Loved ittt!!! And I requested you just 3-4 hours before to add one more deal in it and you happily did without any fuss and extra charges. I LOVE LOVE LOVEDDD ORDERING FROM YOU. I'll definitely be ordering from you next time inshallah thankyouuu so muchhh",
  },
  {
    id: 3,
    name: 'Customer',
    date: 'Feb 2026',
    rating: 4,
    text: "The cake was amazing and loved how it was exactly like the picture, also the packaging was so cute, would look forward to order more from you",
  },
  {
    id: 2,
    name: 'Customer',
    date: 'Dec 2025',
    rating: 4,
    text: "The cake was very delicious... its our 1st experience but you made it worth remembered. We will definitely love to order again on next event in sha allah",
  },
  {
    id: 4,
    name: 'Customer',
    date: 'Mar 2025',
    rating: 5,
    text: "The cake was sooo good, we ate it up within an hour. Loved everything! Thankyou so much!",
  },
  {
    id: 5,
    name: 'Customer',
    date: 'July 2024',
    rating: 5,
    text: "Hey!! Thank u for the cake it was soooo yummy. My mom and my sisters loved it so much and we were fighting over bites it was so good and my sister was soo happy with it",
  },
  {
    id: 6,
    name: 'Customer',
    date: 'June 2024',
    rating: 4,
    text: "Everyone loved the cakee smmm. The cake itself tasted SO GOOD. More than half cake vanished within minutes haha. Loved the cake, the aesthetic and especially the cute little note. 10/10 would deff try again",
  },
  {
    id: 7,
    name: 'Customer',
    date: 'May 2024',
    rating: 5,
    text: "Hey! I hope you are doing well. The cake was absolutely amazing, beautiful & cute. The aroma i got just after opening the box ohhhhhh soooo good. I even like the packing. Flavour was great i m glad i went with cherry chocolate fantasy. You actually made cake came out of fantasy world.",
  }
];

export default function ReviewsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    rating: 0,
    review: ''
  });

  // Auto-play carousel
  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % curatedReviews.length);
      }, 5000);
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isAutoPlaying]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + curatedReviews.length) % curatedReviews.length);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % curatedReviews.length);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.review.trim() || formData.rating === 0) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');
    try {
      const { error } = await supabase
        .from('reviews')
        .insert([
          {
            name: formData.name.trim(),
            rating: formData.rating,
            review_text: formData.review.trim(),
            status: 'approved'
          },
        ]);

      if (error) throw error;

      setFormData({ name: '', rating: 0, review: '' });
      setSubmitStatus('success');
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 3000);
    } catch (err: unknown) {
      const e = err as { message?: string; code?: string; details?: string };
      console.error('Error submitting review:', e?.message, e?.code, e?.details, err);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentReview = curatedReviews[currentIndex];

  return (
    <section className="py-16 md:py-24 px-6 md:px-12 bg-gradient-to-b from-[#FDF8F5] to-[#F8E8E0]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif text-[#2C2C2C] mb-4">
            What Our Customers Say
          </h2>
          <p className="text-[#98898D] max-w-xl mx-auto">
            Real reviews from our lovely customers who trusted us with their special moments
          </p>
        </div>

        {/* Featured Review Carousel */}
        <div className="relative mb-12">
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-[#FAC1B5]/20 p-8 md:p-12">
            <Quote className="w-10 h-10 text-[#FAC1B5] mb-6" />
            
            <div className="mb-4">
              <StarRating value={currentReview.rating} onChange={() => {}} interactive={false} size="md" showNumber={true} />
            </div>
            
            <p className="text-[#2C2C2C] text-lg leading-relaxed mb-6">
              {currentReview.text}
            </p>
            
            <div className="flex items-center justify-end">
              <p className="text-sm text-[#98898D]">{currentReview.date}</p>
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={goToPrevious}
            className="absolute left-2 md:-left-4 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-3 hover:bg-[#FDF8F5] transition-colors z-10"
            aria-label="Previous review"
          >
            <ChevronLeft className="w-6 h-6 text-[#2C2C2C]" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 md:-right-4 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-3 hover:bg-[#FDF8F5] transition-colors z-10"
            aria-label="Next review"
          >
            <ChevronRight className="w-6 h-6 text-[#2C2C2C]" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {curatedReviews.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setCurrentIndex(index);
                }}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-[#F283AE] w-8'
                    : 'bg-[#FAC1B5]/40 hover:bg-[#FAC1B5]'
                }`}
                aria-label={`Go to review ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Review Form */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#FAC1B5]/20">
          <h3 className="text-xl font-semibold text-[#2C2C2C] mb-6">
            Share Your Experience
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-[#2C2C2C] mb-2">Name</label>
              <input
                type="text"
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-[#FAC1B5]/30 rounded-lg focus:outline-none focus:border-[#F283AE]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#2C2C2C] mb-3">Rating</label>
              <StarRating 
                value={formData.rating} 
                onChange={(rating) => setFormData({ ...formData, rating })}
                interactive={true}
                size="lg"
                showNumber={true}
              />
            </div>
            <textarea
              placeholder="Tell us about your experience..."
              value={formData.review}
              onChange={(e) => setFormData({ ...formData, review: e.target.value })}
              className="w-full px-4 py-3 border border-[#FAC1B5]/30 rounded-lg focus:outline-none focus:border-[#F283AE] resize-none h-24"
              required
            />
            {submitStatus === 'error' && (
              <p className="text-red-500 text-sm font-medium">
                Something went wrong. Please try again.
              </p>
            )}
            <button
              type="submit"
              disabled={isSubmitting || formData.rating === 0}
              className="w-full bg-[#F283AE] hover:bg-[#E86FA3] disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-colors"
            >
              {isSubmitting ? 'Submitting…' : 'Submit Review'}
            </button>
          </form>
        </div>
      </div>

      {/* Success Popup Overlay */}
      {submitStatus === 'success' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm transition-all duration-300">
          <div className="flex flex-col items-center bg-white rounded-2xl p-8 shadow-xl border border-[#FAC1B5]/30 max-w-sm w-full animate-in fade-in zoom-in duration-300">
            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
            <h3 className="text-xl font-semibold text-[#2C2C2C] mb-2 text-center">Thank You!</h3>
            <p className="text-center text-[#98898D]">
              Your review has been successfully submitted.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
