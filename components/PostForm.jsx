"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function PostForm({ onPostCreated }) {
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      toast.error("Post content is required");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in");
      return;
    }

    const loadingToast = toast.loading("Creating post...");

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content, imageUrl }),
      });

      const data = await res.json();
      toast.dismiss(loadingToast);

      if (!res.ok) {
        toast.error(data.error || "Failed to create post");
        return;
      }

      toast.success("Post created!");
      setContent("");
      setImageUrl("");
      if (onPostCreated) onPostCreated(data);
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Something went wrong");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow p-4 rounded mb-4"
    >
      <textarea
        className="w-full border p-2 rounded mb-2"
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={280}
      />
      <input
        type="text"
        placeholder="Image URL (optional)"
        className="w-full border p-2 rounded mb-2"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />
      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded"
      >
        Post
      </button>
    </form>
  );
}
