
"use client";
import { useSearchParams } from 'next/navigation';

export default function VendorsPage() {
  const searchParams = useSearchParams();
  const submitted = searchParams.get('submitted');

  return (
    <div className="max-w-2xl mx-auto py-12">
      {submitted ? (
        <div className="bg-green-100 border border-green-300 text-green-800 px-6 py-4 rounded mb-8">
          <h1 className="text-2xl font-bold mb-2">Thank you for applying!</h1>
          <p>
            Your vendor application has been received. Our team will review your information and notify you when you are approved.
          </p>
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-6">Become a Vendor</h1>
          <p className="mb-4">
            Want to sell your plants on our marketplace? Click below to start the onboarding process. All vendors are vetted before becoming active.
          </p>
          <a
            href="/api/square/oauth/start"
            className="bg-purple-600 text-white px-6 py-3 rounded text-lg font-semibold hover:bg-purple-700 transition"
          >
            Connect with Square
          </a>
          <p className="mt-6 text-gray-600 text-sm">
            After connecting, our team will review your application and notify you when you are approved.
          </p>
        </>
      )}
    </div>
  );
}
