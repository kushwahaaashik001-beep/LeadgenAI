"use client";

import { useState } from 'react';
import Script from 'next/script';
import UpgradeModal from '@/components/UpgradeModal';
export default function UpgradePage() {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      // 1. Order ID mangwana
      const res = await fetch("/api/create-order", { method: "POST" });
      const data = await res.json();

      if (!data.orderId) {
        alert("Order creation failed. Check API keys!");
        return;
      }

      // 2. Razorpay Popup Options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, 
        amount: data.amount,
        currency: data.currency,
        name: "Optima Pro Plan",
        description: "10-Second Real-Time Alerts",
        order_id: data.orderId,
        handler: async function (response: any) {
          // 3. Payment Verification API call karna
          const verifyRes = await fetch("/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });

          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            alert("Mubarak ho! Aap Pro ban gaye hain. 🚀");
            setIsModalOpen(false);
          } else {
            alert("Verification fail ho gayi!");
          }
        },
        prefill: {
          name: "User Name",
          email: "user@example.com",
        },
        theme: { color: "#EAB308" }, // Yellow/Orange matching modal
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      {/* Script Load Karna Zaruri Hai */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      
      <h1 className="text-4xl font-bold text-slate-900 mb-4">Pricing Plans</h1>
      <p className="text-slate-600 mb-8 max-w-md">
        Choose the best plan to supercharge your lead generation with AI and real-time alerts.
      </p>

      <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200 max-w-sm w-full">
        <h2 className="text-xl font-bold text-slate-800">Pro Plan</h2>
        <div className="my-6">
           <span className="text-5xl font-black text-slate-900">₹199</span>
           <span className="text-slate-500">/month</span>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition shadow-lg"
        >
          View Benefits
        </button>
      </div>

      {/* Aapka Modal */}
      <UpgradeModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onUpgrade={handleUpgrade}
        loading={loading}
      />
    </div>
  );
}
