import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import jwt from "jsonwebtoken";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const post = await Post.findById(params.id).populate("author", "username avatarUrl");

    if (!post) {
      return new Response(JSON.stringify({ error: "Post not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(post), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}



export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const post = await Post.findById(params.id);
    if (!post) {
      return new Response(JSON.stringify({ error: "Post not found" }), { status: 404 });
    }

    if (post.author.toString() !== decoded.id) {
      return new Response(JSON.stringify({ error: "Not authorized" }), { status: 403 });
    }

    await post.deleteOne();
    return new Response(JSON.stringify({ message: "Post deleted" }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
