"use client";

import { useTransition } from "react";
import { MessageSquare, ArrowUpRight, ArrowDownLeft, Calendar, Trash2 } from "lucide-react";
import { InquiryStatus } from "@prisma/client";
import { updateInquiryStatus, deleteInquiry } from "@/lib/actions/interactions";

type InquiryWithBuyer = {
  id: string;
  message: string;
  status: InquiryStatus;
  createdAt: Date;
  buyer: {
    name: string;
    email: string;
  };
  property: {
    id: string;
    title: string;
  };
};

type InquiryWithOwner = {
  id: string;
  message: string;
  status: InquiryStatus;
  createdAt: Date;
  property: {
    id: string;
    title: string;
    owner: {
      name: string;
      email: string;
    };
  };
};

type MessagesClientProps = {
  receivedInquiries: InquiryWithBuyer[];
  sentInquiries: InquiryWithOwner[];
};

export default function MessagesClient({ receivedInquiries, sentInquiries }: MessagesClientProps) {
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (inquiryId: string, status: InquiryStatus) => {
    startTransition(async () => {
      try {
        await updateInquiryStatus(inquiryId, status);
      } catch (error: any) {
        alert(error.message || "Failed to update status");
      }
    });
  };

  const handleDelete = (inquiryId: string) => {
    if (confirm("Are you sure you want to delete this inquiry?")) {
      startTransition(async () => {
        try {
          await deleteInquiry(inquiryId);
        } catch (error: any) {
          alert(error.message || "Failed to delete inquiry");
        }
      });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Messages & Inquiries</h1>
        <p className="mt-2 text-gray-500">
          Communicate with buyers, sellers, and agents. Manage property inquiries.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Received Inquiries */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 border-b pb-4">
            <ArrowDownLeft className="h-6 w-6 text-green-600" />
            <h2 className="text-xl font-semibold">Inquiries Received ({receivedInquiries.length})</h2>
          </div>

          <div className="mt-6 space-y-4">
            {receivedInquiries.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                <MessageSquare className="mx-auto mb-3 h-8 w-8 text-gray-300" />
                <p className="text-sm">No inquiries received yet.</p>
              </div>
            ) : (
              receivedInquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  className="rounded-xl border p-4 hover:border-blue-500 transition space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-800">{inquiry.buyer.name}</span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(inquiry.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded inline-block">
                    Property: {inquiry.property.title}
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-lg">
                    {inquiry.message}
                  </p>
                  <div className="flex justify-between items-center text-xs pt-2 border-t">
                    <span className="text-gray-400">Email: {inquiry.buyer.email}</span>
                    <div className="flex items-center gap-2">
                      <select
                        value={inquiry.status}
                        onChange={(e) => handleStatusChange(inquiry.id, e.target.value as InquiryStatus)}
                        disabled={isPending}
                        className="rounded-lg border bg-white px-2 py-1 outline-none text-xs font-medium"
                      >
                        <option value="OPEN">OPEN</option>
                        <option value="CONTACTED">CONTACTED</option>
                        <option value="CLOSED">CLOSED</option>
                      </select>
                      <button
                        onClick={() => handleDelete(inquiry.id)}
                        disabled={isPending}
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                        title="Delete Inquiry"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sent Inquiries */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 border-b pb-4">
            <ArrowUpRight className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold">Inquiries Sent ({sentInquiries.length})</h2>
          </div>

          <div className="mt-6 space-y-4">
            {sentInquiries.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                <MessageSquare className="mx-auto mb-3 h-8 w-8 text-gray-300" />
                <p className="text-sm">You haven&apos;t sent any inquiries yet.</p>
              </div>
            ) : (
              sentInquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  className="rounded-xl border p-4 hover:border-blue-500 transition space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-800">
                      Owner: {inquiry.property.owner.name}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(inquiry.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded inline-block">
                    Property: {inquiry.property.title}
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-lg">
                    {inquiry.message}
                  </p>
                  <div className="flex justify-between items-center text-xs pt-2 border-t">
                    <span className="text-gray-400">Email: {inquiry.property.owner.email}</span>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-blue-50 px-2 py-0.5 font-semibold text-blue-700 uppercase text-[10px]">
                        {inquiry.status}
                      </span>
                      <button
                        onClick={() => handleDelete(inquiry.id)}
                        disabled={isPending}
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                        title="Delete Inquiry"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
