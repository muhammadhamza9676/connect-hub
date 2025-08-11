"use client";

import Feed from "@/components/Feed";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function UserProfilePage({ params }) {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const res = await fetch(`/api/users/by-username/${params.username}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        if (res.ok) {
          setUserId(data._id);
        } else {
          toast.error(data.error || "User not found");
        }
      } catch {
        toast.error("Failed to load profile");
      }
    };
    fetchUserId();
  }, [params.username]);

  if (!userId) return <p className="text-center mt-6">Loading profile...</p>;

  return (
    <div className="max-w-xl mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-4">@{params.username}</h2>
      <Feed userId={userId} />
    </div>
  );
}
