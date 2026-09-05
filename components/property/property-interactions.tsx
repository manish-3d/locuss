"use client";

import { useState, useTransition } from "react";
import { Heart, Send, Star, User, CheckCircle2 } from "lucide-react";
import { toggleFavorite, sendInquiry, addReview } from "@/lib/actions/interactions";

type ReviewWithUser = {
  id: string;
  rating: number;
  comment: string;
  createdAt: Date;
  user: {
    name: string;
  };
};

type Props = {
  propertyId: string;
  isFavorited: boolean;
  ownerName: string;
  ownerEmail: string;
  reviews: ReviewWithUser[];
};

export default function PropertyInteractions({
  propertyId,
  isFavorited: initialIsFavorited,
  ownerName,
  ownerEmail,
  reviews,
}: Props) {
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [inquirySent, setInquirySent] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const [isPending, startTransition] = useTransition();

  const handleToggleFav = () => {
    setIsFavorited(!isFavorited);
    startTransition(async () => {
      try {
        await toggleFavorite(propertyId);
      } catch (error: any) {
        setIsFavorited(isFavorited);
        alert(error.message || "Failed to update favorite");
      }
    });
  };

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        await sendInquiry(propertyId, inquiryMessage);
        setInquirySent(true);
        setInquiryMessage("");
      } catch (error: any) {
        alert(error.message || "Failed to send inquiry");
      }
    });
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        await addReview(propertyId, rating, comment);
        setComment("");
        alert("Review submitted successfully!");
      } catch (error: any) {
        alert(error.message || "Failed to submit review");
      }
    });
  };

  return (
    <div className="space-y-10">
      {/* Top Bar with Owner & Favorite Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e5ddd0] pb-6">
        <div>
          <h3 className="text-[11px] font-semibold text-[#7a7268] uppercase tracking-wider">
            Listed by
          </h3>
          <p className="text-base sm:text-lg font-serif font-semibold text-[#1e1b17]">
            {ownerName} <span className="text-xs font-sans font-normal text-[#7a7268]">({ownerEmail})</span>
          </p>
        </div>

        <button
          onClick={handleToggleFav}
          disabled={isPending}
          className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs sm:text-sm font-medium transition-all duration-200 ${
            isFavorited
              ? "border border-red-200 bg-red-50 text-red-600 shadow-xs"
              : "border border-[#e5ddd0] bg-white text-[#1e1b17] hover:border-[#b8924a] hover:bg-[#b8924a]/5"
          }`}
        >
          <Heart className={`h-4 w-4 transition-transform ${isFavorited ? "fill-red-600 text-red-600 scale-110" : ""}`} />
          {isFavorited ? "Saved in Favorites" : "Save Property"}
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Contact Owner Form */}
        <div className="rounded-2xl border border-[#e5ddd0] bg-white p-6 shadow-xs space-y-4">
          <div>
            <h3 className="font-serif text-xl font-bold text-[#1e1b17]">Inquire About Property</h3>
            <p className="text-xs sm:text-sm text-[#7a7268] mt-1">
              Send a direct inquiry or schedule viewing with {ownerName}.
            </p>
          </div>

          {inquirySent ? (
            <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs sm:text-sm font-medium text-emerald-800">
              <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
              <span>Inquiry sent successfully! The owner will get back to you shortly.</span>
            </div>
          ) : (
            <form onSubmit={handleSendInquiry} className="space-y-4">
              <textarea
                value={inquiryMessage}
                onChange={(e) => setInquiryMessage(e.target.value)}
                placeholder="Hi, I am interested in this property. Is it available for an in-person viewing?"
                required
                rows={4}
                className="w-full rounded-xl border border-[#e5ddd0] bg-[#faf7f2]/50 p-3.5 text-xs sm:text-sm text-[#1e1b17] outline-none transition focus:border-[#b8924a] focus:ring-1 focus:ring-[#b8924a]"
              />
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center gap-2 rounded-xl bg-[#1e1b17] px-6 py-2.5 text-xs sm:text-sm font-medium text-white transition hover:bg-[#b8924a] disabled:opacity-60 shadow-xs"
              >
                <Send size={15} />
                {isPending ? "Sending..." : "Send Inquiry"}
              </button>
            </form>
          )}
        </div>

        {/* Leave a Review */}
        <div className="rounded-2xl border border-[#e5ddd0] bg-white p-6 shadow-xs space-y-4">
          <div>
            <h3 className="font-serif text-xl font-bold text-[#1e1b17]">Leave a Review</h3>
            <p className="text-xs sm:text-sm text-[#7a7268] mt-1">
              Share your thoughts or viewing impressions on this listing.
            </p>
          </div>

          <form onSubmit={handleAddReview} className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-[#7a7268] uppercase tracking-wider mb-1.5">
                Rating
              </label>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 text-[#b8924a] focus:outline-none transition-transform hover:scale-110"
                    aria-label={`Rate ${star} stars`}
                  >
                    <Star className={`h-5 w-5 ${star <= rating ? "fill-[#b8924a] text-[#b8924a]" : "text-[#e5ddd0]"}`} />
                  </button>
                ))}
              </div>
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your review or notes here..."
              required
              rows={3}
              className="w-full rounded-xl border border-[#e5ddd0] bg-[#faf7f2]/50 p-3.5 text-xs sm:text-sm text-[#1e1b17] outline-none transition focus:border-[#b8924a] focus:ring-1 focus:ring-[#b8924a]"
            />

            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-xl border border-[#e5ddd0] bg-white px-6 py-2.5 text-xs sm:text-sm font-medium text-[#1e1b17] transition hover:border-[#b8924a] hover:bg-[#b8924a]/5 disabled:opacity-60"
            >
              {isPending ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </div>
      </div>

      {/* Reviews List */}
      <div className="rounded-2xl border border-[#e5ddd0] bg-white p-6 shadow-xs space-y-5">
        <h3 className="font-serif text-xl font-bold text-[#1e1b17]">
          Verified Reviews ({reviews.length})
        </h3>

        {reviews.length === 0 ? (
          <p className="text-xs sm:text-sm text-[#7a7268]">
            No reviews for this property yet. Be the first to share your experience.
          </p>
        ) : (
          <div className="space-y-4 divide-y divide-[#f2ece0]">
            {reviews.map((rev) => (
              <div key={rev.id} className="pt-4 first:pt-0 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f2ece0] text-[#1e1b17] font-semibold text-xs border border-[#e5ddd0]">
                      {rev.user.name.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-[#1e1b17]">{rev.user.name}</span>
                  </div>
                  <div className="flex text-[#b8924a]">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-[#b8924a] text-[#b8924a]" />
                    ))}
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-[#524b42] bg-[#faf7f2] border border-[#e5ddd0]/60 p-3.5 rounded-xl leading-relaxed">
                  {rev.comment}
                </p>
                <p className="text-[10px] text-[#7a7268]">
                  {new Date(rev.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
