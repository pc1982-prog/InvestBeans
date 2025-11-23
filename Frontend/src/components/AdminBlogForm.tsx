import React, { useState, useRef, useEffect } from 'react';
import { X, Loader2, Image as ImageIcon, Tag, Plus, Trash2 } from 'lucide-react';
import { createBlog, updateBlog, Blog } from '@/services/blogService';

interface AdminBlogFormProps {
  onClose: () => void;
  onSuccess: () => void;
  editBlog?: Blog | null;
}

interface HeaderSection {
  header: string;
  subHeader: string;
}

const categories = [
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

const AdminBlogForm: React.FC<AdminBlogFormProps> = ({ onClose, onSuccess, editBlog }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: '',
    tags: '',
    isPublished: true,
  });
  
  const [headerSections, setHeaderSections] = useState<HeaderSection[]>([
    { header: '', subHeader: '' }
  ]);
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadProgress, setUploadProgress] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize form with editBlog data
  useEffect(() => {
    if (editBlog) {
      setFormData({
        title: editBlog.title || '',
        description: editBlog.description || '',
        content: editBlog.content || '',
        category: editBlog.category || '',
        tags: editBlog.tags?.join(', ') || '',
        isPublished: editBlog.isPublished ?? true,
      });
      
      setHeaderSections(
        editBlog.headerSections && editBlog.headerSections.length > 0
          ? editBlog.headerSections
          : [{ header: '', subHeader: '' }]
      );
      
      setImagePreview(editBlog.blogImage || '');
    }
  }, [editBlog]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleHeaderSectionChange = (index: number, field: 'header' | 'subHeader', value: string) => {
    const newSections = [...headerSections];
    newSections[index][field] = value;
    setHeaderSections(newSections);
  };

  const addHeaderSection = () => {
    setHeaderSections([...headerSections, { header: '', subHeader: '' }]);
  };

  const removeHeaderSection = (index: number) => {
    if (headerSections.length > 1) {
      setHeaderSections(headerSections.filter((_, i) => i !== index));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, blogImage: 'Please select a valid image file' }));
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, blogImage: 'Image size must be less than 2MB' }));
      return;
    }

    setUploadProgress(true);
    setImageFile(file);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      setUploadProgress(false);
      setErrors(prev => ({ ...prev, blogImage: '' }));
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    if (!editBlog && !imageFile) {
      newErrors.blogImage = 'Blog image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append('title', formData.title.trim());
      submitData.append('description', formData.description.trim());
      submitData.append('content', formData.content.trim());
      submitData.append('category', formData.category);
      submitData.append('isPublished', String(formData.isPublished));
      submitData.append('tags', formData.tags.trim());
      
      // Filter and send only non-empty header sections
      const validSections = headerSections.filter(
        section => section.header.trim() || section.subHeader.trim()
      );
      submitData.append('headerSections', JSON.stringify(validSections));

      if (imageFile) {
        submitData.append('blogImage', imageFile);
      }

      if (editBlog) {
        await updateBlog(editBlog._id, submitData);
        alert('Blog updated successfully!');
      } else {
        await createBlog(submitData);
        alert('Blog created successfully!');
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error saving blog:', error);
      const errorMessage = error?.response?.data?.message || 'Failed to save blog';
      setErrors({ submit: errorMessage });
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-4xl my-8 shadow-2xl">
        <div className="sticky top-0 bg-gradient-to-r from-navy to-navy/90 text-white px-6 py-5 flex items-center justify-between z-10 rounded-t-2xl">
          <h2 className="text-2xl font-bold">
            {editBlog ? '✏️ Edit Blog' : '✨ Create New Blog'}
          </h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all"
            type="button"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(90vh-100px)] overflow-y-auto">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3">
              📸 Blog Image *
            </label>
            
            {imagePreview ? (
              <div className="relative group">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-xl"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all shadow-lg opacity-0 group-hover:opacity-100"
                >
                  <X size={20} />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center cursor-pointer hover:border-navy hover:bg-navy/5 transition-all"
              >
                {uploadProgress ? (
                  <div className="flex flex-col items-center">
                    <Loader2 className="animate-spin text-navy mb-2" size={40} />
                    <p className="text-gray-600 font-medium">Processing image...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <ImageIcon className="text-gray-400 mb-3" size={48} />
                    <p className="text-gray-700 font-medium mb-1">Click to upload image</p>
                    <p className="text-sm text-gray-500">PNG, JPG, JPEG (max 2MB)</p>
                  </div>
                )}
              </div>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            
            {errors.blogImage && (
              <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                <span>⚠️</span> {errors.blogImage}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-sm font-semibold text-gray-800 mb-2">
                📝 Title * <span className="text-gray-500 text-xs font-normal">({formData.title.length}/150)</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                maxLength={150}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-navy focus:border-navy transition-all"
                placeholder="Enter an engaging title"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">⚠️ {errors.title}</p>}
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-semibold text-gray-800 mb-2">
                📂 Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-navy focus:border-navy transition-all"
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-sm mt-1">⚠️ {errors.category}</p>}
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <Tag size={16} className="text-navy" />
                Tags (Optional)
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-navy focus:border-navy transition-all"
                placeholder="Investing, Finance, Stocks"
              />
            </div>
          </div>

          {/* Header Sections */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-blue-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                📋 Header Sections (Optional)
              </h3>
              <button
                type="button"
                onClick={addHeaderSection}
                className="flex items-center gap-2 bg-navy text-white px-4 py-2 rounded-lg hover:bg-navy/90 transition-all text-sm font-medium"
              >
                <Plus size={16} />
                Add Section
              </button>
            </div>

            <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
              {headerSections.map((section, index) => (
                <div key={index} className="bg-white p-4 rounded-lg border-2 border-gray-200 relative">
                  <div className="flex items-start justify-between mb-3">
                    <span className="bg-navy text-white px-3 py-1 rounded-full text-xs font-bold">
                      Section {index + 1}
                    </span>
                    {headerSections.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeHeaderSection(index)}
                        className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Header (H2)
                      </label>
                      <input
                        type="text"
                        value={section.header}
                        onChange={(e) => handleHeaderSectionChange(index, 'header', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-navy text-sm"
                        placeholder="e.g., How to Choose the Right Tech Field"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Content (Paragraph)
                      </label>
                      <textarea
                        value={section.subHeader}
                        onChange={(e) => handleHeaderSectionChange(index, 'subHeader', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-navy text-sm resize-none"
                        placeholder="Write the paragraph content for this section..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-800 mb-2">
              📄 Description * <span className="text-gray-500 text-xs font-normal">({formData.description.length}/500)</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              maxLength={500}
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-navy focus:border-navy transition-all resize-none"
              placeholder="Brief summary of the blog"
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">⚠️ {errors.description}</p>}
          </div>

          {/* Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-semibold text-gray-800 mb-2">
              ✍️ Content *
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              rows={12}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-navy focus:border-navy transition-all resize-none"
              placeholder="Write your detailed blog content here..."
            />
            {errors.content && <p className="text-red-500 text-sm mt-1">⚠️ {errors.content}</p>}
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="bg-red-50 border-2 border-red-200 text-red-600 p-4 rounded-lg text-sm font-medium">
              ⚠️ {errors.submit}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 justify-end pt-6 border-t-2 border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-navy to-navy/90 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading && <Loader2 className="animate-spin" size={18} />}
              {editBlog ? '💾 Update Blog' : '✨ Create Blog'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminBlogForm;