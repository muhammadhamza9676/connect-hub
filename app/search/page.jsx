"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (query.trim()) {
      fetchResults();
    }
  }, [query]);

  const fetchResults = async () => {
    try {
      const [usersRes, postsRes] = await Promise.all([
        fetch(`/api/search/users?q=${encodeURIComponent(query)}`),
        fetch(`/api/search/posts?q=${encodeURIComponent(query)}`)
      ]);

      const usersData = await usersRes.json();
      const postsData = await postsRes.json();

      if (!usersRes.ok) throw new Error(usersData.error);
      if (!postsRes.ok) throw new Error(postsData.error);

      setUsers(usersData);
      setPosts(postsData);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Search Results for "{query}"</h1>

      {/* Users */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Users</h2>
        {users.length === 0 && <p className="text-gray-500">No users found</p>}
        {users.map((u) => (
          <Link
            key={u._id}
            href={`/profile/${u.username}`}
            className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded"
          >
            <img
              src={u.avatar || "/default-avatar.png"}
              alt={u.username}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-medium">{u.name}</p>
              <p className="text-sm text-gray-500">@{u.username}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Posts */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Posts</h2>
        {posts.length === 0 && <p className="text-gray-500">No posts found</p>}
        {posts.map((p) => (
          <div
            key={p._id}
            className="p-3 border rounded mb-2 cursor-pointer hover:bg-gray-50"
          >
            <p>{p.content}</p>
            <span className="text-sm text-gray-500">
              by {p.author?.username}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
