import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import AdminBlogForm from '@/components/AdminBlogForm';
import { getAllBlogs, getAdminBlogs, deleteBlog, getBlogById, Blog } from '@/services/blogService';
import { Loader2, Plus, Edit2, Trash2, Eye, Search, Tag, Calendar, TrendingUp, Sparkles } from 'lucide-react';
import { useAuth } from '@/controllers/AuthContext';

const BlogsView = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editBlog, setEditBlog] = useState<Blog | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const categories = [
    'All',
    'Market Decoded',
    'Behavioral Finance & Psychology',
    'Learning & Financial Literacy',
    "Founder's Lens",
    'Global Pulse',
    'Investbeans Intelligence',
    'Women & Wealth',
    'Investor Stories & Testimonials',
    'Financial Wellness & Mindfulness',
    'Other'
  ];

  useEffect(() => {
    const editBlogId = searchParams.get('edit');
    if (editBlogId && isAdmin) {
      // Fetch the blog to edit
      const fetchEditBlog = async () => {
        try {
          const blog = await getBlogById(editBlogId);
          setEditBlog(blog);
          setShowForm(true);
          // Remove the edit parameter from URL after a small delay
          setTimeout(() => {
            searchParams.delete('edit');
            setSearchParams(searchParams, { replace: true });
          }, 100);
        } catch (error) {
          console.error('Error fetching blog for edit:', error);
          alert('Failed to load blog for editing');
        }
      };
      fetchEditBlog();
    }
  }, [searchParams.get('edit'), isAdmin]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const params = {
        search: searchQuery,
        category: selectedCategory === 'All' ? '' : selectedCategory,
        page: currentPage,
        limit: 6,
        sort: sortOrder,
      };

      const response = isAdmin 
        ? await getAdminBlogs(params)
        : await getAllBlogs(params);

      setBlogs(response.blogs);
      setTotalPages(response.pagination.totalPages);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [selectedCategory, searchQuery, currentPage, sortOrder, isAdmin]);

  const handleDelete = async (blogId: string) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;

    setDeleteLoading(blogId);
    try {
      await deleteBlog(blogId);
      fetchBlogs();
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('Failed to delete blog');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleEdit = (blog: Blog) => {
    setEditBlog(blog);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditBlog(null);
  };

  const handleFormSuccess = () => {
    fetchBlogs();
  };

  const handleReadMore = (blogId: string) => {
    navigate(`/blogs/${blogId}`);
  };

  const featuredBlog = blogs.find(blog => blog.isPublished) || blogs[0];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-7xl">
          {/* Header */}
          <div className="text-center mb-12 sm:mb-16">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
              <div className="text-center sm:text-left">
                <div className="inline-flex items-center gap-3 mb-4">
                  <div className="h-12 w-1 bg-gradient-to-b from-navy to-accent rounded-full" />
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-navy">
                    Investment Blog
                  </h1>
                </div>
                <p className="text-lg sm:text-xl text-gray-600 font-medium">
                  Expert insights for smart investors
                </p>
              </div>
              {isAdmin && (
                <button
                  onClick={() => setShowForm(true)}
                  className="w-full sm:w-auto bg-gradient-to-r from-navy to-accent text-white px-8 py-4 rounded-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3 font-bold text-base shadow-lg hover:scale-105"
                >
                  <Plus size={22} />
                  Create Blog
                </button>
              )}
            </div>
          </div>

          {/* Filters Section */}
          <div className="mb-10 sm:mb-12 space-y-6">
            {/* Search and Sort */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400" size={22} />
                <input
                  type="text"
                  placeholder="Search blogs by title, description..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-14 pr-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-navy focus:border-navy transition-all shadow-sm text-base font-medium placeholder-gray-400"
                />
              </div>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                className="lg:w-56 px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-navy focus:border-navy transition-all shadow-sm font-semibold text-base bg-white cursor-pointer"
              >
                <option value="desc">📅 Newest First</option>
                <option value="asc">📅 Oldest First</option>
              </select>
            </div>

            {/* Categories - Improved Responsive Grid */}
            <div>
              <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Sparkles size={16} className="text-accent" />
                Filter by Category
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-3 rounded-xl text-sm font-bold transition-all shadow-sm hover:shadow-md ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-navy to-accent text-white shadow-lg scale-105 ring-2 ring-navy/20'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-navy/30'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-32">
              <Loader2 className="animate-spin text-navy" size={56} />
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-32 bg-white rounded-3xl shadow-lg">
              <p className="text-gray-500 text-2xl font-semibold">📭 No blogs found</p>
              <p className="text-gray-400 mt-2">Try adjusting your filters</p>
            </div>
          ) : (
            <>
              {/* Featured Article */}
              {featuredBlog && currentPage === 1 && selectedCategory === 'All' && !searchQuery && (
                <div className="mb-16 sm:mb-20">
                  <div className="flex items-center gap-3 mb-8">
                    <TrendingUp size={28} className="text-accent" />
                    <h2 className="text-3xl sm:text-4xl font-bold text-navy">
                      Featured Article
                    </h2>
                  </div>
                  
                  <div className="bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-300">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                      {/* Image */}
                      <div 
                        className="relative h-80 lg:h-full cursor-pointer group overflow-hidden"
                        onClick={() => handleReadMore(featuredBlog._id)}
                      >
                        <img
                          src={featuredBlog.blogImage}
                          alt={featuredBlog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>

                      {/* Content */}
                      <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-center">
                        {/* Metadata */}
                        <div className="flex flex-wrap items-center gap-3 mb-6">
                          <span className="inline-flex items-center gap-2 bg-gradient-to-r from-accent to-accent/80 text-white px-4 py-2 rounded-full text-sm font-bold shadow-md">
                            <Sparkles size={14} />
                            {featuredBlog.category}
                          </span>
                          <span className="text-gray-500 text-sm font-semibold">
                            {featuredBlog.readTime}
                          </span>
                          {!featuredBlog.isPublished && (
                            <span className="bg-yellow-500 text-white px-3 py-1.5 rounded-full text-sm font-bold">
                              Draft
                            </span>
                          )}
                        </div>
                        
                        {/* Title */}
                        <h3 
                          onClick={() => handleReadMore(featuredBlog._id)}
                          className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy mb-5 hover:text-navy/80 cursor-pointer line-clamp-2 leading-tight"
                        >
                          {featuredBlog.title}
                        </h3>
                        
                        {/* Description */}
                        <p className="text-gray-600 mb-6 text-base sm:text-lg line-clamp-3 leading-relaxed">
                          {featuredBlog.description}
                        </p>
                        
                        {/* Tags */}
                        {featuredBlog.tags && featuredBlog.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-8">
                            {featuredBlog.tags.slice(0, 5).map((tag, index) => (
                              <span 
                                key={index} 
                                className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-xs font-medium border border-gray-200"
                              >
                                <Tag size={12} />
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        {/* Author and Actions */}
                        <div className="flex flex-col gap-6">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-navy to-accent rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                              {featuredBlog.author.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-navy text-base">
                                {featuredBlog.author.name}
                              </p>
                              <p className="text-sm text-gray-500 flex items-center gap-1.5">
                                <Calendar size={14} />
                                {new Date(featuredBlog.createdAt).toLocaleDateString('en-US', {
                                  month: 'long',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex gap-3">
                            {isAdmin ? (
                              <>
                                <button
                                  onClick={() => handleEdit(featuredBlog)}
                                  className="flex-1 bg-navy text-white px-5 py-3 rounded-xl hover:bg-navy/90 transition-all flex items-center justify-center gap-2 text-sm font-bold shadow-md hover:shadow-lg"
                                >
                                  <Edit2 size={16} />
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(featuredBlog._id)}
                                  disabled={deleteLoading === featuredBlog._id}
                                  className="flex-1 bg-red-500 text-white px-5 py-3 rounded-xl hover:bg-red-600 transition-all flex items-center justify-center gap-2 text-sm font-bold shadow-md hover:shadow-lg disabled:opacity-50"
                                >
                                  {deleteLoading === featuredBlog._id ? (
                                    <Loader2 className="animate-spin" size={16} />
                                  ) : (
                                    <Trash2 size={16} />
                                  )}
                                  Delete
                                </button>
                              </>
                            ) : (
                              <button 
                                onClick={() => handleReadMore(featuredBlog._id)}
                                className="w-full bg-gradient-to-r from-navy to-accent text-white px-8 py-4 rounded-xl hover:shadow-xl transition-all font-bold text-base hover:scale-105"
                              >
                                Read Article →
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Articles Grid */}
              <div className="mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-10 flex items-center gap-3">
                  <div className="h-10 w-1 bg-gradient-to-b from-navy to-accent rounded-full" />
                  {currentPage === 1 && selectedCategory === 'All' && !searchQuery ? 'Latest Articles' : 'Articles'}
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {blogs
                    .filter(blog => !(currentPage === 1 && selectedCategory === 'All' && !searchQuery && blog._id === featuredBlog?._id))
                    .map((post) => (
                      <article
                        key={post._id}
                        className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col group"
                      >
                        {/* Image */}
                        <div 
                          className="relative h-56 overflow-hidden cursor-pointer"
                          onClick={() => handleReadMore(post._id)}
                        >
                          <img
                            src={post.blogImage}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>

                        {/* Content */}
                        <div className="p-6 flex flex-col flex-grow">
                          {/* Metadata */}
                          <div className="flex items-center gap-2 mb-4 flex-wrap">
                            <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-gray-200">
                              <Sparkles size={12} />
                              {post.category}
                            </span>
                            <span className="text-gray-500 text-xs font-medium">
                              {post.readTime}
                            </span>
                            <span className="text-gray-500 text-xs flex items-center gap-1">
                              <Eye size={12} /> {post.views}
                            </span>
                          </div>
                          
                          {/* Title */}
                          <h3 
                            onClick={() => handleReadMore(post._id)}
                            className="text-xl font-bold text-navy mb-3 line-clamp-2 hover:text-navy/80 cursor-pointer leading-tight"
                          >
                            {post.title}
                          </h3>
                          
                          {/* Description */}
                          <p className="text-gray-600 text-sm mb-5 line-clamp-3 flex-grow leading-relaxed">
                            {post.description}
                          </p>
                          
                          {/* Tags */}
                          {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-5">
                              {post.tags.slice(0, 3).map((tag, index) => (
                                <span 
                                  key={index} 
                                  className="inline-flex items-center gap-1 bg-gray-50 text-gray-600 px-2.5 py-1 rounded-full text-xs border border-gray-200"
                                >
                                  <Tag size={10} />
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                          
                          {/* Footer */}
                          <div className="flex items-center justify-between pt-5 border-t-2 border-gray-100">
                            <div className="flex items-center gap-2.5">
                              <div className="w-10 h-10 bg-gradient-to-br from-navy to-accent rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                                {post.author.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-bold text-navy text-sm">
                                  {post.author.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {new Date(post.createdAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </p>
                              </div>
                            </div>
                            
                            {/* Action Buttons */}
                            {isAdmin ? (
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => handleEdit(post)} 
                                  className="text-navy hover:text-accent transition-colors p-2 hover:bg-gray-100 rounded-lg"
                                >
                                  <Edit2 size={18} />
                                </button>
                                <button
                                  onClick={() => handleDelete(post._id)}
                                  disabled={deleteLoading === post._id}
                                  className="text-red-500 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-lg"
                                >
                                  {deleteLoading === post._id ? (
                                    <Loader2 className="animate-spin" size={18} />
                                  ) : (
                                    <Trash2 size={18} />
                                  )}
                                </button>
                              </div>
                            ) : (
                              <button 
                                onClick={() => handleReadMore(post._id)}
                                className="text-accent hover:text-accent/80 text-sm font-bold hover:underline"
                              >
                                Read →
                              </button>
                            )}
                          </div>
                        </div>
                      </article>
                    ))}
                </div>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-3 mb-16 flex-wrap">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-6 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-bold transition-all hover:border-navy disabled:hover:border-gray-300"
                  >
                    ← Previous
                  </button>
                  
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-5 py-3 rounded-xl text-sm font-bold transition-all ${
                        currentPage === page
                          ? 'bg-gradient-to-r from-navy to-accent text-white shadow-lg scale-105'
                          : 'border-2 border-gray-300 hover:bg-gray-50 hover:border-navy'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-6 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-bold transition-all hover:border-navy disabled:hover:border-gray-300"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}

          {/* Newsletter */}
          <div className="bg-gradient-to-br from-navy via-navy/95 to-accent text-white rounded-3xl p-10 sm:p-14 shadow-2xl">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Stay Updated
              </h2>
              <p className="text-lg sm:text-xl mb-10 opacity-90">
                Subscribe to our newsletter for the latest investment insights and market analysis.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-5 rounded-xl text-navy placeholder-gray-500 font-medium shadow-inner text-base focus:outline-none focus:ring-4 focus:ring-white/30"
                />
                <button className="bg-white text-navy px-10 py-5 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl text-base hover:scale-105">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <AdminBlogForm
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
          editBlog={editBlog}
        />
      )}
    </Layout>
  );
};

export default BlogsView;