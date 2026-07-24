"use client";

import { useState, useTransition } from "react";
import { User, Building2, Trash2, Shield, Settings, Users, Check } from "lucide-react";
import { updateUserRole, deleteUser } from "./actions";
import { deleteProperty } from "@/app/dashboard/properties/actions";

type AdminClientProps = {
  users: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: Date;
  }>;
  properties: Array<{
    id: string;
    title: string;
    price: bigint;
    city: string;
    status: string;
    owner: {
      name: string;
      email: string;
    };
  }>;
};

export default function AdminClient({ users: initialUsers, properties: initialProperties }: AdminClientProps) {
  const [activeTab, setActiveTab] = useState<"users" | "properties">("users");
  const [isPending, startTransition] = useTransition();

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (confirm(`Change user's role to ${newRole}?`)) {
      startTransition(async () => {
        try {
          await updateUserRole(userId, newRole);
        } catch (error: any) {
          alert(error.message || "Failed to update role");
        }
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm("Are you sure you want to delete this user? All their listings will be deleted as well.")) {
      startTransition(async () => {
        try {
          await deleteUser(userId);
        } catch (error: any) {
          alert(error.message || "Failed to delete user");
        }
      });
    }
  };

  const handleDeleteProperty = async (propertyId: string) => {
    if (confirm("Are you sure you want to delete this property listing?")) {
      startTransition(async () => {
        try {
          await deleteProperty(propertyId);
        } catch (error: any) {
          alert(error.message || "Failed to delete property");
        }
      });
    }
  };

  const totalUsers = initialUsers.length;
  const totalProperties = initialProperties.length;
  const totalSellers = initialUsers.filter((u) => u.role === "SELLER").length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold flex items-center gap-3">
          <Shield className="h-9 w-9 text-blue-600" />
          Admin Panel
        </h1>
        <p className="mt-2 text-gray-500">
          Global system administration dashboard. Manage all users, roles, and property listings.
        </p>
      </div>

      {/* Admin Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl border bg-white p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total System Users</p>
            <h3 className="mt-2 text-3xl font-bold">{totalUsers}</h3>
          </div>
          <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
            <Users className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Listings</p>
            <h3 className="mt-2 text-3xl font-bold">{totalProperties}</h3>
          </div>
          <div className="rounded-xl bg-green-50 p-3 text-green-600">
            <Building2 className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Sellers / Brokers</p>
            <h3 className="mt-2 text-3xl font-bold">{totalSellers}</h3>
          </div>
          <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
            <Settings className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("users")}
          className={`px-6 py-3 text-sm font-semibold border-b-2 transition ${
            activeTab === "users"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Manage Users ({totalUsers})
        </button>
        <button
          onClick={() => setActiveTab("properties")}
          className={`px-6 py-3 text-sm font-semibold border-b-2 transition ${
            activeTab === "properties"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Manage Properties ({totalProperties})
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === "users" ? (
        <div className="rounded-2xl border bg-white overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b text-gray-600 text-xs font-semibold uppercase">
                  <th className="p-4 pl-6">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Registered</th>
                  <th className="p-4">Role</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {initialUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50">
                    <td className="p-4 pl-6 font-semibold text-gray-800">{user.name}</td>
                    <td className="p-4 text-gray-600">{user.email}</td>
                    <td className="p-4 text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        disabled={isPending}
                        className="rounded-lg border bg-white px-2 py-1 outline-none text-xs font-medium focus:border-blue-500"
                      >
                        <option value="BUYER">BUYER</option>
                        <option value="SELLER">SELLER</option>
                        <option value="BROKER">BROKER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={isPending}
                        className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:opacity-60 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border bg-white overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b text-gray-600 text-xs font-semibold uppercase">
                  <th className="p-4 pl-6">Title</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Owner</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {initialProperties.map((property) => (
                  <tr key={property.id} className="hover:bg-gray-50/50">
                    <td className="p-4 pl-6 font-semibold text-gray-800 line-clamp-1 max-w-[200px]">
                      {property.title}
                    </td>
                    <td className="p-4 text-gray-500">{property.city}</td>
                    <td className="p-4 text-gray-600">
                      <div>{property.owner.name}</div>
                      <div className="text-xs text-gray-400">{property.owner.email}</div>
                    </td>
                    <td className="p-4 font-semibold text-gray-800">
                      ₹{Number(property.price).toLocaleString("en-IN")}
                    </td>
                    <td className="p-4">
                      <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700 uppercase">
                        {property.status}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <button
                        onClick={() => handleDeleteProperty(property.id)}
                        disabled={isPending}
                        className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:opacity-60 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
