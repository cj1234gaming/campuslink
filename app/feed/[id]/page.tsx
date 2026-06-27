"use client";

import { theme } from "@/components/Styles";
import { db } from "@/config/firebase";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import React, { use, useEffect, useState } from "react";
import { HiOutlineArrowLeft, HiOutlineCalendar, HiOutlineUser } from "react-icons/hi";

// 1. Explicitly type the Next.js dynamic Route Parameters
interface PageProps {
  params: Promise<{ id: string }>;
}

// 2. Explicitly type the expected Document structure from Firestore
interface NewsItem {
  docId: string;
  author?: string;
  img?: string;
  cat?: string;
  title?: string;
  newsUpdate?: string;
  timestamp?: string;
  userId?: string;
  [key: string]: any;
}

export default function FeedDetailPage({ params }: PageProps) {
  // Safely unwrap the async params Promise using React's use() hook
  const resolvedParams = use(params);
  const id = resolvedParams?.id;

  const [post, setPost] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      try {
        const docRef = doc(db, "news", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPost({
            docId: docSnap.id,
            ...docSnap.data(),
          });
        } else {
          console.log("No such document found!");
        }
      } catch (error) {
        console.error("Error fetching document details: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-slate-400 font-medium animate-pulse">Loading updates...</div>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 gap-4">
        <p className="text-slate-500 font-medium">This campus update could not be found.</p>
        <Link href="/feed" className="text-sm font-bold" style={{ color: theme.secondaryColor }}>
          Return to Feed
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans text-slate-800">
      <div className="max-w-2xl mx-auto">
        
        {/* Navigation Action Header Link */}
        <Link 
          href="/feed" 
          className="inline-flex items-center gap-2 text-sm font-semibold mb-6 hover:opacity-85 transition-opacity"
          style={{ color: theme.secondaryColor }}
        >
          <HiOutlineArrowLeft className="text-lg" />
          <span>Back to Feed</span>
        </Link>

        {/* Content Shell Presentation Container */}
        <article className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8 space-y-6">
          
          {/* Top Row: Meta Profiles & Badge Categorizations */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              {post.img ? (
                <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-100 bg-slate-100">
                  <img src={post.img} alt={post.author || "Author"} className="object-cover w-full h-full" />
                </div>
              ) : (
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white shadow-inner"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  {post.author ? post.author.charAt(0) : "?"}
                </div>
              )}
              <div>
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1">
                  <HiOutlineUser className="text-slate-400" /> {post.author || "Anonymous Contributor"}
                </h3>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                  <HiOutlineCalendar /> {post.timestamp || "Recent Update"}
                </p>
              </div>
            </div>

            <span
              className="text-xs font-bold tracking-wide uppercase px-2.5 py-1 rounded-md"
              style={{
                color: theme.secondaryColor,
                backgroundColor: `${theme.secondaryColor}15`,
              }}
            >
              {post.cat || "General"}
            </span>
          </div>

          {/* Core Post Typography Layout Block */}
          <div className="space-y-4">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug" style={{ color: theme.primaryColor }}>
              {post.title}
            </h1>
            <p className="text-slate-600 text-base leading-relaxed whitespace-pre-line">
              {post.newsUpdate}
            </p>
          </div>

          {/* Reference Footer Section Information Row */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>CampusLink Verified Resource</span>
            <span className="font-mono text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded">
              ID: {post.docId}
            </span>
          </div>

        </article>
      </div>
    </main>
  );
}