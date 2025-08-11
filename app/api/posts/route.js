import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", "username avatarUrl");

    return new Response(JSON.stringify(posts), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}


export async function POST(req) {
  try {
    await connectDB();
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { content, imageUrl } = await req.json();

    if (!content || content.length > 280) {
      return new Response(JSON.stringify({ error: "Content required (max 280 chars)" }), { status: 400 });
    }

    const newPost = await Post.create({
      author: decoded.id,
      content,
      imageUrl: imageUrl || null,
    });

    return new Response(JSON.stringify(newPost), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
