"use client";

import { useState, useTransition } from "react";
import { Heart, Send, Star, User } from "lucide-react";
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
      {/* Top Bar with Favorite Button */}
      <div className="flex items-center justify-between border-b pb-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Property Owner</h3>
          <p className="text-lg font-bold text-gray-800">{ownerName} ({ownerEmail})</p>
        </div>

        <button
          onClick={handleToggleFav}
          disabled={isPending}
          className={`flex items-center gap-2 rounded-xl px-5 py-3 font-semibold transition ${
            isFavorited
              ? "bg-red-50 text-red-600 border border-red-200"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <Heart className={`h-5 w-5 ${isFavorited ? "fill-red-600 text-red-600" : ""}`} />
          {isFavorited ? "Saved in Favorites" : "Add to Favorites"}
        </button>
      </div>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Contact Owner Form */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm space-y-4">
          <h3 className="text-2xl font-bold">Inquire About Property</h3>
          <p className="text-sm text-gray-500">
            Send a message directly to {ownerName}.
          </p>

          {inquirySent ? (
            <div className="rounded-xl bg-green-50 p-4 text-green-700 text-sm font-medium">
              ✓ Inquiry sent successfully! The owner will get back to you soon.
            </div>
          ) : (
            <form onSubmit={handleSendInquiry} className="space-y-4">
              <textarea
                value={inquiryMessage}
                onChange={(e) => setInquiryMessage(e.target.value)}
                placeholder="Hi, I am interested in this property. Is it available for a viewing?"
                required
                rows={4}
                className="w-full rounded-xl border bg-white p-4 text-sm outline-none transition focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={isPending}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
              >
                <Send size={18} />
                {isPending ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </div>

        {/* Write a Review */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm space-y-4">
          <h3 className="text-2xl font-bold">Leave a Review</h3>
          <p className="text-sm text-gray-500">
            Share your thoughts or experiences with this property.
          </p>

          <form onSubmit={handleAddReview} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 text-yellow-400 focus:outline-none"
                  >
                    <Star className={`h-6 w-6 ${star <= rating ? "fill-yellow-400" : "text-gray-300"}`} />
                  </button>
                ))}
              </div>
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your review here..."
              required
              rows={3}
              className="w-full rounded-xl border bg-white p-4 text-sm outline-none transition focus:border-blue-500"
            />

            <button
              type="submit"
              disabled={isPending}
              className="rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-60"
            >
              {isPending ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </div>
      </div>

      {/* Reviews List */}
      <div className="rounded-2xl border bg-white p-6 shadow-sm space-y-6">
        <h3 className="text-2xl font-bold">Reviews ({reviews.length})</h3>

        {reviews.length === 0 ? (
          <p className="text-sm text-gray-500">No reviews for this property yet. Be the first to leave one!</p>
        ) : (
          <div className="space-y-4 divide-y divide-gray-100">
            {reviews.map((rev) => (
              <div key={rev.id} className="pt-4 first:pt-0 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600 font-bold text-xs">
                      {rev.user.name.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="font-semibold text-gray-800">{rev.user.name}</span>
                  </div>
                  <div className="flex text-yellow-400">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg leading-relaxed">
                  {rev.comment}
                </p>
                <p className="text-[10px] text-gray-400">
                  {new Date(rev.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
