import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req, { params }) {
  await connectDB();
  try {
    const post = await Post.findById(params.id)
      .populate("comments.user", "username name")
      .select("comments");
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

    return NextResponse.json(post.comments);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


export async function POST(req, { params }) {
  await connectDB();

  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const { text } = await req.json();
  if (!text || text.trim().length === 0)
    return NextResponse.json({ error: "Comment cannot be empty" }, { status: 400 });

  try {
    const post = await Post.findById(params.id);
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

    if (!Array.isArray(post.comments)) {
      post.comments = [];
    }
    post.comments.push({ user: decoded.id, text });
    await post.save();


    return NextResponse.json({ message: "Comment added successfully" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
