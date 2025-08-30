"use client";
import { useEffect, useState } from "react";

interface Vendor {
  _id: string;
  merchant_id: string;
  business_name?: string;
  status: string;
  createdAt?: string;
}

export default function AdminVendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/vendors")
      .then((res) => res.json())
      .then((data) => {
        setVendors(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load vendors");
        setLoading(false);
      });
  }, []);

  const updateStatus = async (merchant_id: string, status: string) => {
    setUpdating(merchant_id);
    await fetch("/api/vendors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ merchant_id, status }),
    });
    setVendors((prev) =>
      prev.map((v) =>
        v.merchant_id === merchant_id ? { ...v, status } : v
      )
    );
    setUpdating(null);
  };

  return (
    <div className="max-w-3xl mx-auto py-12">
      <h1 className="text-3xl font-bold mb-6">Vendor Applications</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : vendors.length === 0 ? (
        <p>No vendors found.</p>
      ) : (
        <table className="w-full border mt-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Business Name</th>
              <th className="p-2 text-left">Merchant ID</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((vendor) => (
              <tr key={vendor._id} className="border-t">
                <td className="p-2">{vendor.business_name || <span className="italic text-gray-400">N/A</span>}</td>
                <td className="p-2">{vendor.merchant_id}</td>
                <td className="p-2 capitalize">{vendor.status}</td>
                <td className="p-2">
                  {vendor.status === "pending" && (
                    <button
                      className="bg-green-600 text-white px-3 py-1 rounded mr-2 disabled:opacity-50"
                      disabled={updating === vendor.merchant_id}
                      onClick={() => updateStatus(vendor.merchant_id, "approved")}
                    >
                      Approve
                    </button>
                  )}
                  {vendor.status === "approved" && (
                    <button
                      className="bg-yellow-500 text-white px-3 py-1 rounded disabled:opacity-50"
                      disabled={updating === vendor.merchant_id}
                      onClick={() => updateStatus(vendor.merchant_id, "pending")}
                    >
                      Set Pending
                    </button>
                  )}
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded disabled:opacity-50"
                    disabled={updating === vendor.merchant_id}
                    onClick={() => updateStatus(vendor.merchant_id, "rejected")}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
