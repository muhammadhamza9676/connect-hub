"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";

export default function Feed({ userId, singlePostId }) {
  const { user, token } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [commentInputs, setCommentInputs] = useState({});
  const limit = 10;

  useEffect(() => {
    fetchPosts();
  }, [page, userId, singlePostId]);

  const fetchPosts = async () => {
    try {
      let url = `/api/posts?page=${page}&limit=${limit}`;
      if (userId) url = `/api/users/${userId}/posts`;
      if (singlePostId) url = `/api/posts/${singlePostId}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load posts");

      setPosts(singlePostId ? [data] : data);
      console.log(posts)
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this post?")) return;

    const loadingToast = toast.loading("Deleting...");

    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      toast.dismiss(loadingToast);

      if (!res.ok) throw new Error(data.error || "Failed to delete");

      toast.success("Post deleted");
      setPosts((prev) => prev.filter((p) => p._id !== id));
      if (singlePostId) router.push("/"); // Redirect if viewing single post
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(err.message);
    }
  };

  const handleLike = async (postId) => {
    try {
      const res = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? { ...p, likes: data.likes, likedByUser: data.liked }
            : p
        )
      );
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleComment = async (postId) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return toast.error("Comment cannot be empty");

    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success("Comment added");
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId ? { ...p, comments: data } : p
        )
      );
      setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      {posts.length === 0 && (
        <p className="text-center text-gray-500">No posts yet</p>
      )}

      {posts.map((post) => (
        <div
          key={post._id}
          className="bg-white shadow p-4 rounded mb-4"
        >
          <div className="flex items-center justify-between mb-2">
            <div
              className="font-semibold cursor-pointer"
              onClick={() => router.push(`/profile/${post.author.username}`)}
            >
              {post.author.username}
              <span className="text-gray-500 text-sm ml-2">
                {new Date(post.createdAt).toLocaleString()}
              </span>
            </div>

            {user?._id === post.author._id && (
              <button
                onClick={() => handleDelete(post._id)}
                className="text-red-500 hover:underline text-sm"
              >
                Delete
              </button>
            )}
          </div>

          <div
            onClick={() => router.push(`/posts/${post._id}`)}
            className="cursor-pointer"
          >
            <p>{post.content}</p>
            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt="Post"
                className="mt-2 rounded max-h-60 object-cover"
              />
            )}
          </div>

          {/* Like */}
          <button
            onClick={() => handleLike(post._id)}
            className={`mt-3 px-3 py-1 rounded-full ${
              post.likedByUser ? "bg-red-500 text-white" : "bg-gray-200"
            }`}
          >
            ❤️ {post.likes?.length || 0}
          </button>

          {/* Comments */}
          <div className="mt-4">
            <input
              type="text"
              value={commentInputs[post._id] || ""}
              onChange={(e) =>
                setCommentInputs((prev) => ({
                  ...prev,
                  [post._id]: e.target.value,
                }))
              }
              placeholder="Add a comment..."
              className="border rounded px-3 py-1 w-full"
            />
            <button
              onClick={() => handleComment(post._id)}
              className="mt-2 px-3 py-1 bg-blue-500 text-white rounded"
            >
              Comment
            </button>

            {/* Show Comments */}
            <div className="mt-3 space-y-2">
              {Array.isArray(post.comments) &&
                post.comments.map((c) => (
                  <div key={c._id} className="bg-gray-100 p-2 rounded">
                    <p className="text-sm">
                      <strong>{c.user?.username}</strong> {c.text}
                    </p>
                    <span className="text-xs text-gray-500">
                      {new Date(c.createdAt).toLocaleString()}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      ))}

      {!singlePostId && posts.length >= limit && (
        <div className="flex justify-center mt-4 gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1 bg-gray-300 rounded"
            disabled={page === 1}
          >
            Prev
          </button>
          <button
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 bg-gray-300 rounded"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
