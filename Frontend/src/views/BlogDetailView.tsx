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
        <div className="flex justify-center items-center min-h-screen bg-slate-950/95">
          <Loader2 className="animate-spin text-blue-400" size={56} />
        </div>
      </Layout>
    );
  }

  if (!blog) {
    return (
      <Layout>
        <div className="container mx-auto px-4 sm:px-6 py-12 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
            Blog not found
          </h2>
          <button
            onClick={() => navigate("/blogs")}
            className="text-blue-400 hover:underline font-medium"
          >
            Return to blogs
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-slate-950/95 text-white">
        {/* Reading Progress Bar */}
        <div className="fixed top-0 left-0 w-full h-1 bg-white/10 z-50">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all duration-300 shadow-lg"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Hero Image Section - Fixed width */}
        <div className="pt-8 sm:pt-12 pb-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            {/* Hero Image - Thinner */}
            <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl">
              <div className="relative h-[160px] sm:h-[220px] lg:h-[280px] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
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
            {/* Title with Category Badge */}
            {/* <div className="mb-6">
              <span className="inline-flex items-center gap-2 bg-gradient-to-r from-accent/10 to-purple-500/10 text-accent px-4 py-1.5 rounded-full text-xs font-bold border border-accent/20 shadow-sm">
                <Tag size={12} />
                {blog.category}
              </span>
            </div> */}

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              {blog.title}
            </h1>

            {/* Metadata Bar with Author & Actions */}
            <div className="pb-6 mb-8 border-b-2 border-white/10">
          
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between lg:gap-6">
              
                <div className="flex flex-nowrap items-center gap-2 lg:gap-4 mb-4 lg:mb-0 overflow-x-auto pb-2 lg:pb-0">
                  <div className="flex items-center gap-1.5 text-white/60 text-xs lg:text-sm font-medium bg-white/5 border border-white/10 px-2.5 lg:px-4 py-1.5 lg:py-2 rounded-lg flex-shrink-0">
                    <Calendar size={14} className="text-blue-400" />
                    <span className="whitespace-nowrap text-xs">
                      {new Date(blog.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-white/60 text-xs lg:text-sm font-medium bg-white/5 border border-white/10 px-2.5 lg:px-4 py-1.5 lg:py-2 rounded-lg flex-shrink-0">
                    <Clock size={14} className="text-blue-400" />
                    <span className="whitespace-nowrap text-xs">{blog.readTime}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-white/60 text-xs lg:text-sm font-medium bg-white/5 border border-white/10 px-2.5 lg:px-4 py-1.5 lg:py-2 rounded-lg flex-shrink-0">
                    <Eye size={14} className="text-blue-400" />
                    <span className="whitespace-nowrap text-xs">{blog.views}</span>
                  </div>
                  
                  {/* Like Button */}
                  <button
                    onClick={handleLike}
                    disabled={likeLoading}
                    className={`flex items-center gap-1.5 px-2.5 lg:px-4 py-1.5 lg:py-2 rounded-lg text-xs lg:text-sm font-medium transition-all flex-shrink-0 ${
                      isLiked
                        ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                        : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {likeLoading ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Heart
                        size={14}
                        className={isLiked ? "fill-current" : ""}
                      />
                    )}
                    <span className="whitespace-nowrap">{likesCount}</span>
                  </button>
                </div>
              {/* Bottom - Author & Admin Actions */}
              <div className="flex flex-row items-center justify-between gap-3 w-full md:max-w-lg">
                {/* Author */}
                <div className="flex items-center gap-2">
                  <div className="w-9 lg:w-10 h-9 lg:h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg lg:rounded-xl flex items-center justify-center text-white font-bold text-xs lg:text-sm shadow-md flex-shrink-0">
                    {blog.author.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-white text-xs lg:text-sm truncate">
                      {blog.author.name}
                    </p>
                    <p className="text-xs text-white/40 truncate">{blog.author.email}</p>
                  </div>
                </div>

                {/* Admin Buttons - Right side */}
                {isAdmin && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={handleEdit}
                      className="bg-white/10 border border-white/20 text-white px-2.5 lg:px-4 py-1.5 lg:py-2 rounded-lg hover:bg-white/20 transition-all flex items-center gap-1 text-xs lg:text-sm font-bold"
                    >
                      <Edit2 size={13} />
                      <span className="hidden lg:inline">Edit</span>
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={deleteLoading}
                      className="bg-red-500/20 border border-red-500/30 text-red-400 px-2.5 lg:px-4 py-1.5 lg:py-2 rounded-lg hover:bg-red-500/30 transition-all flex items-center gap-1 text-xs lg:text-sm font-bold disabled:opacity-50"
                    >
                      {deleteLoading ? (
                        <Loader2 className="animate-spin" size={13} />
                      ) : (
                        <Trash2 size={13} />
                      )}
                      <span className="hidden lg:inline">Delete</span>
                    </button>
                  </div>
                )}
              </div>
              </div>

            </div>

            {/* Description */}
            {blog.description && (
              <div className="mb-8 rounded-xl p-5 border-l-4 border-blue-500 bg-white/5 border border-white/10">
                <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full" />
                  Overview
                </h2>
                <p className="text-base text-white/70 leading-relaxed">
                  {blog.description}
                </p>
              </div>
            )}

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="mb-8">
                <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                  <Tag size={16} className="text-blue-400" />
                  Topics
                </h3>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 text-white/70 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-white/10 transition-colors hover:scale-105 cursor-pointer"
                    >
                      <span className="text-blue-400">#</span>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Full Article with Integrated Header Sections */}
            <div className="mb-10 rounded-2xl p-6 sm:p-8 border border-white/10 bg-white/5 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="w-1.5 h-8 bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-500 rounded-full" />
                Full Article
              </h2>
              
              <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none prose-invert">
                {/* Main Content */}
                <div
                  className="text-white/70 leading-relaxed text-base sm:text-lg mb-6"
                  style={{ lineHeight: '1.8' }}
                  dangerouslySetInnerHTML={{
                    __html: blog.content.replace(/\n/g, "<br />")
                  }}
                />

                {/* Header Sections integrated as part of article */}
                {blog.headerSections && blog.headerSections.length > 0 && (
                  <div className="mt-8 space-y-8">
                    {blog.headerSections.map(
                      (section: HeaderSection, index: number) => (
                        <div key={index} className="space-y-3">
                          <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                            {section.header}
                          </h2>
                          <p className="text-white/70 leading-relaxed text-base" style={{ lineHeight: '1.8' }}>
                            {section.subHeader}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Back Button at Bottom */}
            <div className="mb-8">
              <button
                onClick={() => navigate("/blogs")}
                className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors group bg-white/5 border border-white/10 px-5 py-3 rounded-xl hover:bg-white/10"
              >
                <ArrowLeft
                  size={18}
                  className="group-hover:-translate-x-1 transition-transform"
                />
                <span className="text-sm font-semibold">Back to Blogs</span>
              </button>
            </div>
          </article>

          {/* Newsletter */}
          <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-blue-500/20 via-indigo-500/10 to-purple-500/10 backdrop-blur-2xl text-white p-8 sm:p-12 text-center mb-12 shadow-[0_30px_90px_-40px_rgba(81,148,246,0.3)]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full -ml-32 -mb-32" />
            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.1),_transparent_60%)]"></div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                <Bookmark size={32} className="text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-white">
                Stay Informed
              </h2>
              <p className="text-base sm:text-lg lg:text-xl mb-8 text-white/70 max-w-2xl mx-auto">
                Get the latest investment insights delivered straight to your inbox
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="flex-1 px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 font-medium"
                />
                <button
                  onClick={handleSubscribe}
                  className="bg-white text-slate-900 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl hover:scale-105"
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