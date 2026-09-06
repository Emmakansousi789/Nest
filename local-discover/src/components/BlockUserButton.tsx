"use client";

import { useState, useEffect } from "react";
import { secureGet, secureSet } from "@/lib/secure-storage";

const BLOCKED_KEY = "ld-blocked-users";

interface BlockUserButtonProps {
  userId: string;
  userName: string;
}

/**
 * Block/unblock a user. Blocked users' reviews and messages
 * are hidden from the blocker's view. Stored in encrypted storage.
 */
export default function BlockUserButton({ userId, userName }: BlockUserButtonProps) {
  const [isBlocked, setIsBlocked] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    secureGet(BLOCKED_KEY).then((stored) => {
      try {
        const blocked: string[] = stored ? JSON.parse(stored) : [];
        setIsBlocked(blocked.includes(userId));
      } catch {
        setIsBlocked(false);
      }
    });
  }, [userId]);

  const handleToggle = async () => {
    if (isBlocked) {
      // Unblock
      const stored = await secureGet(BLOCKED_KEY);
      const blocked: string[] = stored ? JSON.parse(stored) : [];
      const updated = blocked.filter((id) => id !== userId);
      await secureSet(BLOCKED_KEY, JSON.stringify(updated));
      setIsBlocked(false);
      setShowConfirm(false);
    } else {
      // Show confirmation first
      setShowConfirm(true);
    }
  };

  const confirmBlock = async () => {
    const stored = await secureGet(BLOCKED_KEY);
    const blocked: string[] = stored ? JSON.parse(stored) : [];
    if (!blocked.includes(userId)) {
      blocked.push(userId);
      await secureSet(BLOCKED_KEY, JSON.stringify(blocked));
    }
    setIsBlocked(true);
    setShowConfirm(false);
  };

  if (showConfirm) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-3">
        <p className="text-sm text-charcoal">
          Block <strong>{userName}</strong>? You won&apos;t see their reviews or messages anymore.
        </p>
        <div className="flex gap-2">
          <button
            onClick={confirmBlock}
            className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-xl hover:bg-red-700 transition-colors"
          >
            Block
          </button>
          <button
            onClick={() => setShowConfirm(false)}
            className="px-4 py-2 text-sm text-stone font-medium rounded-xl hover:bg-ecru transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={handleToggle}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
        isBlocked
          ? "bg-ecru text-stone hover:bg-parchment"
          : "text-red-600 hover:bg-red-50"
      }`}
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        {isBlocked ? (
          <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        )}
      </svg>
      {isBlocked ? "Unblock User" : "Block User"}
    </button>
  );
}
