'use client';

import { useState } from 'react';
import { Trash2, Star } from 'lucide-react';
import type { Review } from '@/lib/supabase';
import { deleteReview } from '@/lib/supabase';

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={14}
          className={star <= rating ? 'text-[#F283AE] fill-[#F283AE]' : 'text-[#FAC1B5]/30'}
        />
      ))}
      <span className="ml-1.5 text-xs font-semibold text-[#98898D]">{rating}/5</span>
    </div>
  );
}

export default function AdminReviewsTable({ reviews: initialReviews }: { reviews: Review[] }) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await deleteReview(id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error('Failed to delete review:', err);
      alert('Failed to delete review. Please try again.');
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  }

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : '—';

  return (
    <div className="space-y-6">
      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-[#FAC1B5]/20 p-5 shadow-sm">
          <p className="text-xs font-semibold text-[#98898D] uppercase tracking-wide mb-1">Total Reviews</p>
          <p className="text-3xl font-serif text-[#2C2C2C]">{reviews.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-[#FAC1B5]/20 p-5 shadow-sm">
          <p className="text-xs font-semibold text-[#98898D] uppercase tracking-wide mb-1">Avg Rating</p>
          <div className="flex items-center gap-2">
            <p className="text-3xl font-serif text-[#2C2C2C]">{avgRating}</p>
            <Star size={18} className="text-[#F283AE] fill-[#F283AE]" />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#FAC1B5]/20 p-5 shadow-sm">
          <p className="text-xs font-semibold text-[#98898D] uppercase tracking-wide mb-1">5-Star Reviews</p>
          <p className="text-3xl font-serif text-[#2C2C2C]">
            {reviews.filter((r) => r.rating === 5).length}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-[#FAC1B5]/20 overflow-hidden">
        {reviews.length === 0 ? (
          <div className="py-20 text-center">
            <Star size={36} className="mx-auto text-[#FAC1B5]/40 mb-4" />
            <p className="text-[#98898D] font-medium">No customer reviews yet.</p>
            <p className="text-sm text-[#98898D]/70 mt-1">Reviews submitted on the website will appear here.</p>
          </div>
        ) : (
          <>
            {/* Mobile cards */}
            <div className="space-y-3 p-4 md:hidden">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-xl border border-[#FAC1B5]/20 bg-[#FFFBF8] p-4 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-[#2C2C2C]">{review.name}</p>
                      <p className="text-xs text-[#98898D] mt-0.5">
                        {review.created_at ? new Date(review.created_at).toLocaleDateString('en-PK', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                      </p>
                    </div>
                    <StarDisplay rating={review.rating} />
                  </div>
                  <p className="text-sm text-[#2C2C2C] leading-relaxed">{review.review_text}</p>

                  {confirmId === review.id ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDelete(review.id!)}
                        disabled={deletingId === review.id}
                        className="flex-1 rounded-lg bg-red-500 py-2 text-xs font-semibold text-white transition-colors hover:bg-red-600 disabled:opacity-60"
                      >
                        {deletingId === review.id ? 'Deleting…' : 'Confirm Delete'}
                      </button>
                      <button
                        onClick={() => setConfirmId(null)}
                        className="flex-1 rounded-lg border border-[#FAC1B5]/30 py-2 text-xs font-semibold text-[#98898D] hover:bg-[#F0E8DF]/30"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmId(review.id!)}
                      className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-red-200 py-2 text-xs font-semibold text-red-500 transition-colors hover:bg-red-50"
                    >
                      <Trash2 size={13} />
                      Delete
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-[#FAC1B5]/20 bg-[#F0E8DF]/30">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#98898D]">Customer</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#98898D]">Rating</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#98898D]">Review</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#98898D]">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#98898D]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((review) => (
                    <tr
                      key={review.id}
                      className="border-b border-[#FAC1B5]/10 transition-colors hover:bg-[#F0E8DF]/20"
                    >
                      <td className="px-6 py-4">
                        <p className="font-semibold text-[#2C2C2C]">{review.name}</p>
                      </td>
                      <td className="px-6 py-4">
                        <StarDisplay rating={review.rating} />
                      </td>
                      <td className="px-6 py-4 max-w-sm">
                        <p className="text-sm text-[#2C2C2C] line-clamp-2 leading-relaxed">
                          {review.review_text}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#98898D] whitespace-nowrap">
                        {review.created_at
                          ? new Date(review.created_at).toLocaleDateString('en-PK', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })
                          : '—'}
                      </td>
                      <td className="px-6 py-4">
                        {confirmId === review.id ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleDelete(review.id!)}
                              disabled={deletingId === review.id}
                              className="rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white transition-colors hover:bg-red-600 disabled:opacity-60"
                            >
                              {deletingId === review.id ? 'Deleting…' : 'Confirm'}
                            </button>
                            <button
                              onClick={() => setConfirmId(null)}
                              className="text-xs font-semibold text-[#98898D] hover:text-[#2C2C2C]"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmId(review.id!)}
                            className="flex items-center gap-1.5 text-sm font-semibold text-red-400 transition-colors hover:text-red-600"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      <p className="text-sm text-[#98898D]">Total: {reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
    </div>
  );
}
