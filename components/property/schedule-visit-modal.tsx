"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, Calendar, Clock, CheckCircle2, User, Phone, Mail, MapPin } from "lucide-react";
import { formatPrice } from "@/app/properties/components/property-card";

interface ScheduleVisitModalProps {
  property: {
    id: string;
    title: string;
    price: bigint | number;
    address?: string;
    city?: string;
    state?: string;
    images?: Array<{ url: string }>;
  };
  isOpen: boolean;
  onClose: () => void;
}

const TIME_SLOTS = ["10:00 AM", "12:00 PM", "2:00 PM", "4:00 PM", "6:00 PM"];

export function ScheduleVisitModal({ property, isOpen, onClose }: ScheduleVisitModalProps) {
  const [selectedDate, setSelectedDate] = useState<number>(12); // September 12 default
  const [selectedTime, setSelectedTime] = useState<string>("12:00 PM");
  const [name, setName] = useState("Manish Kumar");
  const [email, setEmail] = useState("manish@example.com");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsConfirmed(true);
    }, 600);
  };

  const days = [
    { day: "Su", date: 7 },
    { day: "M", date: 8 },
    { day: "Tu", date: 9 },
    { day: "W", date: 10 },
    { day: "Th", date: 11 },
    { day: "F", date: 12 },
    { day: "Sa", date: 13 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-hidden rounded-t-3xl sm:rounded-3xl bg-[#faf7f2] shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e5ddd0] px-4 py-3 bg-white/80 backdrop-blur-xs">
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#faf7f2] text-[#524b42]"
          >
            <X className="h-4 w-4" />
          </button>
          <h2 className="font-serif text-sm sm:text-base font-bold text-[#1e1b17]">
            Schedule a Visit
          </h2>
          <div className="w-8" />
        </div>

        {isConfirmed ? (
          <div className="p-8 text-center space-y-4 my-auto">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#eef7ee] text-[#2d7a36]">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#1e1b17]">
              Visit Confirmed!
            </h3>
            <p className="text-xs text-[#7a7268] max-w-xs mx-auto leading-relaxed">
              Your guided tour for <strong>{property.title}</strong> is scheduled for{" "}
              <strong>Sept {selectedDate}, 2026 at {selectedTime}</strong>. A confirmation has been sent to your email.
            </p>
            <div className="pt-3">
              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-xl bg-[#1e1b17] py-3 text-xs font-semibold text-white shadow-md hover:bg-[#2b241e]"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleConfirm} className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* 1. Property Summary Preview Card */}
            <div className="flex items-center gap-3 rounded-2xl border border-[#e5ddd0] bg-white p-2.5 shadow-2xs">
              <div className="relative h-14 w-16 shrink-0 overflow-hidden rounded-xl bg-[#ede8df]">
                {property.images?.[0]?.url ? (
                  <Image
                    src={property.images[0].url}
                    alt={property.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[8px] text-[#7a7268]">
                    Property
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-serif text-xs font-bold text-[#1e1b17]">
                  {formatPrice(property.price)}
                </p>
                <h4 className="font-serif text-xs font-semibold text-[#1e1b17] truncate">
                  {property.title}
                </h4>
                <p className="text-[10px] text-[#7a7268] truncate">
                  {property.city || property.address || "Gurgaon, Haryana"}
                </p>
              </div>
            </div>

            {/* 2. Select Date (Compact Week/Month selector) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-xs font-bold uppercase tracking-wider text-[#1e1b17]">
                  Select Date
                </h3>
                <span className="text-xs font-semibold text-[#7a7268]">September 2026</span>
              </div>

              <div className="grid grid-cols-7 gap-1.5 text-center">
                {days.map((item) => {
                  const isSelected = selectedDate === item.date;
                  return (
                    <button
                      key={item.date}
                      type="button"
                      onClick={() => setSelectedDate(item.date)}
                      className={`flex flex-col items-center justify-center rounded-xl py-2 transition-all ${
                        isSelected
                          ? "bg-[#6b583f] text-white shadow-2xs"
                          : "border border-[#e5ddd0] bg-white text-[#1e1b17] hover:bg-[#faf7f2]"
                      }`}
                    >
                      <span className="text-[9px] font-medium opacity-80">{item.day}</span>
                      <span className="text-xs font-bold mt-0.5">{item.date}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Select Time */}
            <div className="space-y-2">
              <h3 className="font-serif text-xs font-bold uppercase tracking-wider text-[#1e1b17]">
                Select Time
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {TIME_SLOTS.map((time) => {
                  const isSelected = selectedTime === time;
                  return (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setSelectedTime(time)}
                      className={`rounded-xl py-2 text-xs font-semibold transition-all text-center ${
                        isSelected
                          ? "bg-[#6b583f] text-white shadow-2xs"
                          : "border border-[#e5ddd0] bg-white text-[#524b42] hover:bg-[#faf7f2]"
                      }`}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Your Details */}
            <div className="space-y-2">
              <h3 className="font-serif text-xs font-bold uppercase tracking-wider text-[#1e1b17]">
                Your Details
              </h3>
              <div className="space-y-2">
                <div className="relative flex items-center rounded-xl border border-[#e5ddd0] bg-white px-3 py-2">
                  <User className="h-3.5 w-3.5 text-[#7a7268] mr-2 shrink-0" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Full Name"
                    required
                    className="w-full text-xs text-[#1e1b17] outline-none bg-transparent"
                  />
                </div>

                <div className="relative flex items-center rounded-xl border border-[#e5ddd0] bg-white px-3 py-2">
                  <Mail className="h-3.5 w-3.5 text-[#7a7268] mr-2 shrink-0" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    required
                    className="w-full text-xs text-[#1e1b17] outline-none bg-transparent"
                  />
                </div>

                <div className="relative flex items-center rounded-xl border border-[#e5ddd0] bg-white px-3 py-2">
                  <Phone className="h-3.5 w-3.5 text-[#7a7268] mr-2 shrink-0" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone Number"
                    required
                    className="w-full text-xs text-[#1e1b17] outline-none bg-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2 pb-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-[#1e1b17] py-3.5 text-xs font-semibold text-white shadow-md hover:bg-[#2b241e] disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? "Confirming Visit…" : "Confirm Visit"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
