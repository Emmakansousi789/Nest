"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { addMessage } from "@/data/store";
import { CheckCircleOutline } from "./icons";

interface MessageButtonProps {
  vendorId: string;
  vendorName: string;
}

export default function MessageButton({ vendorId, vendorName }: MessageButtonProps) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState("");
  const [sent, setSent] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !user) return;
    addMessage({
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      vendorId,
      senderId: user.id,
      senderName: user.name,
      text: text.trim(),
      date: new Date().toISOString(),
      read: false,
    });
    setSent(true);
    setTimeout(() => {
      setIsOpen(false);
      setSent(false);
      setText("");
    }, 1500);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 bg-terracotta/10 text-terracotta rounded-xl text-sm font-medium hover:bg-terracotta/20 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 20.105V4.875A2.25 2.25 0 016 2.625h12A2.25 2.25 0 0120.25 4.875v10.5A2.25 2.25 0 0118 17.625H6.75L3.75 20.105z" />
        </svg>
        Message
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={() => setIsOpen(false)}>
          <div className="absolute inset-0 sheet-backdrop" />
          <div
            className="relative bg-cream rounded-t-3xl sm:rounded-2xl shadow-xl w-full sm:max-w-md border border-parchment"
            onClick={(e) => e.stopPropagation()}
          >
            {sent ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-sage/10 flex items-center justify-center mb-4">
                  <CheckCircleOutline size={36} className="text-sage" />
                </div>
                <h3 className="text-lg font-semibold text-charcoal mb-1">Message sent!</h3>
                <p className="text-sm text-stone">{vendorName} will be notified.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between px-5 pt-5 pb-3">
                  <h3 className="text-lg font-semibold text-charcoal">Message {vendorName}</h3>
                  <button onClick={() => setIsOpen(false)} className="p-1 text-stone hover:text-charcoal">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <form onSubmit={handleSend} className="px-5 pb-5 space-y-4">
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={`Hi! I'm interested in your business...`}
                    rows={4}
                    className="input-field resize-none"
                    required
                    autoFocus
                  />
                  <button
                    type="submit"
                    disabled={!text.trim()}
                    className="w-full py-3 bg-terracotta text-cream rounded-xl font-medium text-sm hover:bg-terracotta-dark transition-colors disabled:opacity-50"
                  >
                    Send Message
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
