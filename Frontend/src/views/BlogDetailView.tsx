import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { getBlogById, deleteBlog, Blog } from "@/services/blogService";
import {
  Loader2,
  ArrowLeft,
  Edit2,
  Trash2,
  Eye,
  Calendar,
  Clock,
  Share2,
} from "lucide-react";
import { useAuth } from "@/controllers/AuthContext";

interface HeaderSection {
  header: string;
  subHeader: string;
}

const SUBHEADER_PREVIEW_LENGTH = 150;

const BlogDetailView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>({});
  const [progress, setProgress] = useState<number>(0);
  const articleRef = useRef<HTMLDivElement | null>(null);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

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

  const toggleSection = (index: number) => {
    setExpandedSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const truncateSubHeader = (text: string) => {
    if (text.length <= SUBHEADER_PREVIEW_LENGTH) return { preview: text, hasMore: false };
    return {
      preview: text.substring(0, SUBHEADER_PREVIEW_LENGTH) + "...",
      hasMore: true,
    };
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen bg-white">
          <Loader2 className="animate-spin text-navy" size={48} />
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

  const contentPreview = blog.content.substring(0, 500);
  const hasMoreContent = blog.content.length > 500;

  return (
    <Layout>
      <div className="min-h-screen bg-white">
        {/* Reading Progress Bar */}
        <div className="fixed top-0 left-0 w-full h-0.5 bg-gray-100 z-50">
          <div
            className="h-full bg-accent transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Hero Image Section */}
        <div className="relative w-full">
          <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] overflow-hidden bg-gray-100">
            <img
              src={blog.blogImage}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
            {!blog.isPublished && (
              <div className="absolute top-6 right-6">
                <span className="bg-yellow-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  Draft
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Main Content Container */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          {/* Back Button */}
          <div className="py-6">
            <button
              onClick={() => navigate("/blogs")}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-navy transition-colors group"
            >
              <ArrowLeft
                size={18}
                className="group-hover:-translate-x-1 transition-transform"
              />
              <span className="text-sm font-medium">Back to Blogs</span>
            </button>
          </div>

          {/* Article Content */}
          <article ref={articleRef} className="pb-12">
            {/* Category Badge */}
            <div className="mb-4">
              <span className="inline-block bg-accent/10 text-accent px-4 py-1.5 rounded-full text-sm font-semibold">
                {blog.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {blog.title}
            </h1>

            {/* Metadata Bar */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pb-6 mb-8 border-b border-gray-200">
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <Calendar size={16} />
                <span>
                  {new Date(blog.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <Clock size={16} />
                <span>{blog.readTime}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <Eye size={16} />
                <span>{blog.views} views</span>
              </div>
            </div>

            {/* Author & Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12 pb-8 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-navy to-accent rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                  {blog.author.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-base">
                    {blog.author.name}
                  </p>
                  <p className="text-sm text-gray-500">{blog.author.email}</p>
                </div>
              </div>

              {isAdmin && (
                <div className="flex gap-3 w-full sm:w-auto">
                  <button
                    onClick={handleEdit}
                    className="flex-1 sm:flex-none bg-navy text-white px-5 py-2.5 rounded-lg hover:bg-navy/90 transition-all flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    <Edit2 size={16} />
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleteLoading}
                    className="flex-1 sm:flex-none bg-red-500 text-white px-5 py-2.5 rounded-lg hover:bg-red-600 transition-all flex items-center justify-center gap-2 text-sm font-medium disabled:opacity-50"
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
              <div className="mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                  Descriptions
                </h2>
                <p className="text-xl sm:text-2xl text-gray-700 leading-relaxed font-light border-l-4 border-accent pl-6">
                  {blog.description}
                </p>
              </div>
            )}

            {/* Tags - Mobile Optimized */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="mb-12">
                
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-block bg-gray-100 text-gray-700 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium hover:bg-gray-200 transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Key Insights */}
            {blog.headerSections && blog.headerSections.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
                  Key Insights
                </h2>

                <div className="space-y-6">
                  {blog.headerSections.map(
                    (section: HeaderSection, index: number) => {
                      const { preview, hasMore } = truncateSubHeader(section.subHeader);
                      const isExpanded = expandedSections[index];

                      return (
                        <div
                          key={index}
                          className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors"
                        >
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
                            {section.header}
                          </h3>
                          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                            {isExpanded ? section.subHeader : preview}
                          </p>
                          {hasMore && (
                            <button
                              onClick={() => toggleSection(index)}
                              className="mt-3 text-accent hover:text-accent/80 font-medium text-sm"
                            >
                              {isExpanded ? "Show less" : "Read more"}
                            </button>
                          )}
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            )}

            {/* Full Article */}
            <div className="mb-12">
               <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                  Contents
                </h2>
              <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
                <div
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: showFullContent
                      ? blog.content.replace(/\n/g, "<br />")
                      : contentPreview.replace(/\n/g, "<br />") +
                        '<span class="text-gray-400"> ...</span>',
                  }}
                />
              </div>

              {hasMoreContent && (
                <div className="mt-8 text-center">
                  <button
                    onClick={() => setShowFullContent(!showFullContent)}
                    className="inline-block bg-navy text-white px-8 py-3 rounded-lg font-medium hover:bg-navy/90 transition-all"
                  >
                    {showFullContent ? "Show Less" : "Continue Reading"}
                  </button>
                </div>
              )}
            </div>

          
          </article>

          {/* Newsletter */}
          <div className="bg-gradient-to-r from-navy to-navy/95 text-white rounded-2xl p-8 sm:p-12 text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Stay Informed
            </h2>
            <p className="text-base sm:text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Get the latest investment insights delivered to your inbox
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-1 px-5 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <button
                onClick={handleSubscribe}
                className="bg-accent text-white px-8 py-3 rounded-lg font-medium hover:bg-accent/90 transition-all"
              >
                {subscribed ? "Subscribed ✓" : "Subscribe"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BlogDetailView;