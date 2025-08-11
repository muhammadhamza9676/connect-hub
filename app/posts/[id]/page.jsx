"use client";

import Feed from "@/components/Feed";

export default function SinglePostPage({ params }) {
  return (
    <div className="max-w-xl mx-auto mt-6">
      <Feed singlePostId={params.id} />
    </div>
  );
}
