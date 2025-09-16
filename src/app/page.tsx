

"use client";
import React, { useState } from 'react';
import { getPlants } from '@/lib/plants';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';


export default function Home() {
  const { data: session, status } = useSession();
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);
  const [plants, setPlants] = useState<any[]>([]);
  const [qrModal, setQrModal] = useState<{ open: boolean; qr?: string; name?: string } | null>(null);

  async function fetchPlants() {
    const res = await fetch('/api/plants');
    if (res.ok) {
      setPlants(await res.json());
    }
  }

  async function handleSync() {
    setSyncing(true);
    setSyncResult(null);
    const res = await fetch('/api/square/sync', { method: 'POST' });
    const data = await res.json();
    setSyncResult(data.success ? `Synced ${data.count} items!` : data.error || 'Sync failed');
    setSyncing(false);
    fetchPlants();
  }

  // Fetch plants on mount
  React.useEffect(() => {
    fetchPlants();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-4">
        {status === "loading" ? (
          <span>Checking sign-in status...</span>
        ) : session ? (
          <span className="text-green-700">Signed in as {session.user?.name || session.user?.email}</span>
        ) : (
          <span className="text-red-700">Not signed in</span>
        )}
      </div>
      <div className="flex justify-between items-center mb-8 gap-4 flex-wrap">
        <h1 className="text-3xl font-bold">Available Plants</h1>
        <div className="flex gap-2">
          <Link href="/auth/signin" className="bg-blue-600 text-white px-4 py-2 rounded">Login</Link>
          <Link href="/auth/register" className="bg-green-600 text-white px-4 py-2 rounded">Register</Link>
          <button onClick={handleSync} disabled={syncing} className="bg-blue-600 text-white px-4 py-2 rounded">
            {syncing ? 'Syncing...' : 'Sync Square Catalog'}
          </button>
          <Link href="/vendors" className="bg-purple-600 text-white px-4 py-2 rounded">Vendors</Link>
        </div>
      </div>
      {syncResult && <div className="mb-4 text-green-700">{syncResult}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {plants.map((plant, idx) => {
          let idStr = '';
          if (plant._id) {
            if (typeof plant._id === 'object' && typeof plant._id.toHexString === 'function') {
              idStr = plant._id.toHexString();
            } else if (typeof plant._id === 'string' || typeof plant._id === 'number') {
              idStr = String(plant._id);
            } else {
              idStr = String(idx);
            }
          } else {
            idStr = String(idx);
          }
          const key = `${idStr}-${idx}`;
          return (
            <div key={key} className="border rounded-lg p-4 flex flex-col items-center">
              <Image
                src={plant.image && plant.image.trim() !== "" ? plant.image : "/default-plant.jpg"}
                alt={plant.name}
                width={200}
                height={200}
                className="mb-4 rounded"
              />
              <h2 className="text-xl font-semibold mb-2">{plant.name}</h2>
              <p className="mb-2">{plant.description}</p>
              <span className="font-bold mb-2">${plant.price?.toFixed(2)}</span>
              <div className="flex gap-2">
                <Link href={`/plants/${idStr}`} className="btn bg-green-600 text-white px-4 py-2 rounded">View</Link>
                <button
                  className="btn bg-gray-700 text-white px-4 py-2 rounded"
                  onClick={async () => {
                    const res = await fetch(`/api/plants/qr?id=${plant._id}&name=${encodeURIComponent(plant.name)}&price=${plant.price}${plant.sku ? `&sku=${encodeURIComponent(plant.sku)}` : ''}`);
                    const data = await res.json();
                    setQrModal({ open: true, qr: data.qr, name: plant.name });
                  }}
                >
                  QR Label
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {/* QR Modal */}
      {qrModal?.open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg flex flex-col items-center">
            <h3 className="text-lg font-bold mb-2">QR Code Label{qrModal.name ? ` for ${qrModal.name}` : ''}</h3>
            <img src={qrModal.qr} alt="QR Code" className="mb-4" />
            <button
              className="bg-gray-700 text-white px-4 py-2 rounded"
              onClick={() => setQrModal(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

