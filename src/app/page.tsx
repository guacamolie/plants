
"use client";
import React, { useState } from 'react';
import { getPlants } from '@/lib/plants';
import Image from 'next/image';
import Link from 'next/link';


export default function Home() {
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);
  const [plants, setPlants] = useState<any[]>([]);

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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Available Plants</h1>
        <button onClick={handleSync} disabled={syncing} className="bg-blue-600 text-white px-4 py-2 rounded">
          {syncing ? 'Syncing...' : 'Sync Square Catalog'}
        </button>
      </div>
      {syncResult && <div className="mb-4 text-green-700">{syncResult}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {plants.map((plant) => (
          <div key={plant._id?.toString()} className="border rounded-lg p-4 flex flex-col items-center">
            <Image src={plant.image} alt={plant.name} width={200} height={200} className="mb-4 rounded" />
            <h2 className="text-xl font-semibold mb-2">{plant.name}</h2>
            <p className="mb-2">{plant.description}</p>
            <span className="font-bold mb-2">${plant.price?.toFixed(2)}</span>
            <Link href={`/plants/${plant._id}`} className="btn bg-green-600 text-white px-4 py-2 rounded">View</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
