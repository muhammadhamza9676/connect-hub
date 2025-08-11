import { connectDB } from "@/lib/db";
import Post from "@/models/Post";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const posts = await Post.find({ author: params.id })
      .sort({ createdAt: -1 })
      .populate("author", "username avatarUrl");

    return new Response(JSON.stringify(posts), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
