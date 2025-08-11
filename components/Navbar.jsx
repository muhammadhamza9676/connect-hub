"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";
import Link from "next/link";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const handleSearch = () => {
    if (!query.trim()) return toast.error("Enter a search term");
    router.push(`/search?q=${encodeURIComponent(query)}`);
    setQuery("");
  };

  return (
    <nav className="bg-white border-b shadow-sm px-4 py-2 flex justify-between items-center">
      {/* Logo */}
      <Link href="/" className="text-xl font-bold text-blue-600">
        MyApp
      </Link>

      {/* Search */}
      <div className="flex items-center gap-2 max-w-md w-full">
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="border px-3 py-1 rounded w-full"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-1 rounded"
        >
          Search
        </button>
      </div>

      {/* Profile Menu */}
      <div className="relative">
        <img
          src={user?.avatar || "/default-avatar.png"}
          alt="Profile"
          className="w-10 h-10 rounded-full cursor-pointer border"
          onClick={() => setMenuOpen((prev) => !prev)}
        />
        {menuOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded border">
            <Link
              href={`/profile/${user?.username}`}
              className="block px-4 py-2 hover:bg-gray-100"
              onClick={() => setMenuOpen(false)}
            >
              My Profile
            </Link>
            <button
              onClick={() => {
                logout();
                setMenuOpen(false);
                router.push("/login");
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
