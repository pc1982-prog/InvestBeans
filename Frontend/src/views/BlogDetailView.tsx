import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { getBlogById, deleteBlog, toggleLike, Blog } from "@/services/blogService";
import {
  Loader2,
  ArrowLeft,
  Edit2,
  Trash2,
  Eye,
  Calendar,
  Clock,
  Tag,
  Bookmark,
  Heart,
} from "lucide-react";
import { useAuth } from "@/controllers/AuthContext";

interface HeaderSection {
  header: string;
  subHeader: string;
}

const BlogDetailView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin, user } = useAuth();

  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const articleRef = useRef<HTMLDivElement | null>(null);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  // Derived state for like status
  const isLiked = blog && user && blog.likedBy ? blog.likedBy.includes(user._id) : false;
  const likesCount = blog?.likes || 0;

  useEffect(() => {
    if (id) {
      fetchBlog();
    }
  }, [id]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  useEffect(() => {
    const onScroll = () => {
      const el = articleRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const total = rect.height + windowHeight;
      const scrolled = windowHeight - rect.top;
      const raw = (scrolled / total) * 100;
      const pct = Math.min(100, Math.max(0, Number(raw.toFixed(0))));
      setProgress(pct);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [blog]);

  const fetchBlog = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const response = await getBlogById(id);
      setBlog(response);
      setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
    } catch (error) {
      console.error("Error fetching blog:", error);
      const errorMessage =
        error?.response?.data?.message || "Failed to load blog";
      alert(errorMessage);
      navigate("/blogs");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!blog) return;
    
    if (!user) {
      alert("Please login to like this blog");
      return;
    }

    setLikeLoading(true);
    try {
      const response = await toggleLike(blog._id);
      
      // Update blog state with new like data
      setBlog(prev => prev ? {
        ...prev,
        likes: response.likes,
        likedBy: response.likedBy
      } : null);
    } catch (error) {
      console.error("Error toggling like:", error);
      const errorMessage = error?.response?.data?.message || "Failed to update like";
      alert(errorMessage);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!blog || !confirm("Are you sure you want to delete this blog?")) return;

    setDeleteLoading(true);
    try {
      await deleteBlog(blog._id);
      alert("Blog deleted successfully");
      navigate("/blogs");
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("Failed to delete blog");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleEdit = () => {
    if (blog) {
      navigate(`/blogs?edit=${blog._id}`);
    }
  };

  const handleSubscribe = useCallback(() => {
    if (!email || !/^[\w-.]+@[\w-]+\.[a-z]{2,}$/i.test(email)) {
      alert("Please enter a valid email.");
      return;
    }
    setSubscribed(true);
    setEmail("");
    setTimeout(() => alert("Thanks for subscribing!"), 100);
  }, [email]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-blue-50/30 via-white to-purple-50/20">
          <Loader2 className="animate-spin text-navy" size={56} />
        </div>
      </Layout>
    );
  }

  if (!blog) {
    return (
      <Layout>
        <div className="container mx-auto px-4 sm:px-6 py-12 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-navy mb-4">
            Blog not found
          </h2>
          <button
            onClick={() => navigate("/blogs")}
            className="text-accent hover:underline font-medium"
          >
            Return to blogs
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-blue-50/30 via-white to-purple-50/20">
        {/* Reading Progress Bar */}
        <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
          <div
            className="h-full bg-gradient-to-r from-navy via-accent to-purple-600 transition-all duration-300 shadow-lg"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Hero Image Section - Fixed width */}
        <div className="pt-8 sm:pt-12 pb-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            {/* Back Button */}
            <div className="mb-6">
              <button
                onClick={() => navigate("/blogs")}
                className="inline-flex items-center gap-2 text-gray-600 hover:text-navy transition-colors group bg-white px-4 py-2 rounded-xl shadow-sm hover:shadow-md"
              >
                <ArrowLeft
                  size={18}
                  className="group-hover:-translate-x-1 transition-transform"
                />
                <span className="text-sm font-semibold">Back to Blogs</span>
              </button>
            </div>

            {/* Hero Image - Smaller height so title is visible */}
            <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl">
              <div className="relative h-[200px] sm:h-[280px] lg:h-[350px] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                <img
                  src={blog.blogImage}
                  alt={blog.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                
                {!blog.isPublished && (
                  <div className="absolute top-6 right-6">
                    <span className="bg-yellow-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg backdrop-blur-sm">
                      Draft
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Container - Wider width */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          {/* Article Content */}
          <article ref={articleRef} className="pb-12">
            {/* Category Badge */}
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 bg-gradient-to-r from-accent/10 to-purple-500/10 text-accent px-5 py-2 rounded-full text-sm font-bold border border-accent/20 shadow-sm">
                <Tag size={14} />
                {blog.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-8 leading-tight">
              {blog.title}
            </h1>

            {/* Metadata Bar with Like Button */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-6 pb-6 mb-8 border-b-2 border-gray-200">
              <div className="flex items-center gap-2 text-gray-600 text-sm font-medium bg-gray-50 px-4 py-2 rounded-lg">
                <Calendar size={16} className="text-accent" />
                <span>
                  {new Date(blog.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 text-sm font-medium bg-gray-50 px-4 py-2 rounded-lg">
                <Clock size={16} className="text-accent" />
                <span>{blog.readTime}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 text-sm font-medium bg-gray-50 px-4 py-2 rounded-lg">
                <Eye size={16} className="text-accent" />
                <span>{blog.views} views</span>
              </div>
              
              {/* Like Button */}
              <button
                onClick={handleLike}
                disabled={likeLoading}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isLiked
                    ? "bg-red-50 text-red-600 hover:bg-red-100"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {likeLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Heart
                    size={16}
                    className={isLiked ? "fill-current" : ""}
                  />
                )}
                <span>{likesCount}</span>
              </button>
            </div>

            {/* Author & Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12 pb-8 border-b-2 border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-navy via-accent to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {blog.author.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-base sm:text-lg">
                    {blog.author.name}
                  </p>
                  <p className="text-sm text-gray-500">{blog.author.email}</p>
                </div>
              </div>

              {isAdmin && (
                <div className="flex gap-3 w-full sm:w-auto">
                  <button
                    onClick={handleEdit}
                    className="flex-1 sm:flex-none bg-navy text-white px-6 py-3 rounded-xl hover:bg-navy/90 transition-all flex items-center justify-center gap-2 text-sm font-bold shadow-md hover:shadow-lg"
                  >
                    <Edit2 size={16} />
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleteLoading}
                    className="flex-1 sm:flex-none bg-red-500 text-white px-6 py-3 rounded-xl hover:bg-red-600 transition-all flex items-center justify-center gap-2 text-sm font-bold shadow-md hover:shadow-lg disabled:opacity-50"
                  >
                    {deleteLoading ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <Trash2 size={16} />
                    )}
                    Delete
                  </button>
                </div>
              )}
            </div>

            {/* Description */}
            {blog.description && (
              <div className="mb-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 sm:p-8 border-l-4 border-accent shadow-sm">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-1.5 h-8 bg-gradient-to-b from-accent to-purple-600 rounded-full" />
                  Overview
                </h2>
                <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
                  {blog.description}
                </p>
              </div>
            )}

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="mb-12">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Tag size={18} className="text-accent" />
                  Topics
                </h3>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {blog.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1.5 bg-white text-gray-700 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm hover:shadow-md hover:scale-105 cursor-pointer"
                    >
                      <span className="text-accent">#</span>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Full Article with Integrated Header Sections */}
            <div className="mb-12 bg-white rounded-2xl p-6 sm:p-8 lg:p-12 shadow-sm border border-gray-100">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <div className="w-1.5 h-10 bg-gradient-to-b from-navy via-accent to-purple-600 rounded-full" />
                Full Article
              </h2>
              
              <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
                {/* Main Content */}
                <div
                  className="text-gray-700 leading-relaxed text-base sm:text-lg mb-8"
                  style={{ lineHeight: '1.8' }}
                  dangerouslySetInnerHTML={{
                    __html: blog.content.replace(/\n/g, "<br />")
                  }}
                />

                {/* Header Sections integrated as part of article */}
                {blog.headerSections && blog.headerSections.length > 0 && (
                  <div className="mt-12 space-y-10">
                    {blog.headerSections.map(
                      (section: HeaderSection, index: number) => (
                        <div key={index} className="space-y-4">
                          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                            {section.header}
                          </h2>
                          <p className="text-gray-700 leading-relaxed text-base sm:text-lg" style={{ lineHeight: '1.8' }}>
                            {section.subHeader}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Credits */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200/50 mb-12">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Source & Credits
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Author:</span>
                  <p className="text-foreground font-medium">{blog.author.name}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Published:</span>
                  <p className="text-foreground">
                    {new Date(blog.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </article>

          {/* Newsletter */}
          <div className="bg-gradient-to-br from-navy via-accent to-purple-600 text-white rounded-3xl p-8 sm:p-12 text-center mb-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32" />
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                <Bookmark size={32} className="text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
                Stay Informed
              </h2>
              <p className="text-base sm:text-lg lg:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Get the latest investment insights delivered straight to your inbox
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="flex-1 px-6 py-4 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/30 font-medium shadow-lg"
                />
                <button
                  onClick={handleSubscribe}
                  className="bg-white text-navy px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:scale-105"
                >
                  {subscribed ? "Subscribed ✓" : "Subscribe"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BlogDetailView;