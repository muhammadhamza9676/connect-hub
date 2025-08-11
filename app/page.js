"use client";

import PostForm from "@/components/PostForm";
import Feed from "@/components/Feed";
import { useState } from "react";
import Navbar from "@/components/Navbar";

export default function HomePage() {
  const [reloadFlag, setReloadFlag] = useState(false);

  const refreshFeed = () => {
    setReloadFlag(!reloadFlag);
  };

  return (
    <>
      <Navbar />
      <div className="max-w-xl mx-auto mt-6">
        <PostForm onPostCreated={refreshFeed} />
        <Feed key={reloadFlag} />
      </div>
    </>
  );
}
