import React, { useEffect, useState } from 'react';
import { BeanOfWisdom, FieldLimits, getFieldLimits, updateBean } from '@/services/beanOfWisdomService';
import { Loader2, X, AlertCircle, Save } from 'lucide-react';

interface BeansOfWisdomFormProps {
  isOpen: boolean;
  onClose: () => void;
  bean: BeanOfWisdom | null;
  onSuccess?: () => void;
}

export default function BeansOfWisdomForm({ isOpen, onClose, bean, onSuccess }: BeansOfWisdomFormProps) {
  const [fieldLimits, setFieldLimits] = useState<FieldLimits | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState<Partial<BeanOfWisdom>>({
    title: "",
    subtitle: "",
    sectionTitle: "",
    description: "",
    keyPrinciple: "",
    quote: "",
    insightTag: "",
    insightText: "",
    tags: [],
  });

  useEffect(() => {
    const fetchLimits = async () => {
      try {
        const limits = await getFieldLimits();
        setFieldLimits(limits);
      } catch (err) {
        console.error('Error fetching field limits:', err);
        setError('Failed to load form validation rules');
      }
    };

    if (isOpen) {
      fetchLimits();
      setError(null);
      setFieldErrors({});
      
      if (bean) {
        setFormData({
          title: bean.title || "",
          subtitle: bean.subtitle || "",
          sectionTitle: bean.sectionTitle || "",
          description: bean.description || "",
          keyPrinciple: bean.keyPrinciple || "",
          quote: bean.quote || "",
          insightTag: bean.insightTag || "",
          insightText: bean.insightText || "",
          tags: bean.tags || [],
        });
      }
    }
  }, [isOpen, bean]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    setFormData((prev) => ({ ...prev, tags }));
    
    if (fieldErrors.tags) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.tags;
        return newErrors;
      });
    }
  };

  const getCharCount = (fieldName: keyof typeof formData): number => {
    const value = formData[fieldName];
    if (typeof value === 'string') {
      return value.length;
    }
    if (Array.isArray(value)) {
      return value.join(", ").length;
    }
    return 0;
  };

  const validateForm = (): boolean => {
    if (!fieldLimits) {
      setError('Form validation rules not loaded');
      return false;
    }

    const newFieldErrors: Record<string, string> = {};

    const fields = [
      { name: 'title', label: 'Title', limit: fieldLimits.title },
      { name: 'subtitle', label: 'Subtitle', limit: fieldLimits.subtitle },
      { name: 'sectionTitle', label: 'Section title', limit: fieldLimits.sectionTitle },
      { name: 'description', label: 'Description', limit: fieldLimits.description },
      { name: 'keyPrinciple', label: 'Key principle', limit: fieldLimits.keyPrinciple },
      { name: 'quote', label: 'Quote', limit: fieldLimits.quote },
      { name: 'insightTag', label: 'Insight tag', limit: fieldLimits.insightTag },
      { name: 'insightText', label: 'Insight text', limit: fieldLimits.insightText },
    ];

    for (const field of fields) {
      const value = (formData[field.name as keyof typeof formData] as string) || '';

      if (!value.trim()) {
        newFieldErrors[field.name] = `${field.label} is required`;
      } else if (value.length > field.limit) {
        newFieldErrors[field.name] = `Cannot exceed ${field.limit} characters`;
      }
    }

    if (!formData.tags || formData.tags.length === 0) {
      newFieldErrors.tags = 'At least one tag is required';
    } else {
      for (const tag of formData.tags) {
        if (tag.length > fieldLimits.tags) {
          newFieldErrors.tags = `Each tag cannot exceed ${fieldLimits.tags} characters`;
          break;
        }
      }
    }

    setFieldErrors(newFieldErrors);

    if (Object.keys(newFieldErrors).length > 0) {
      setError('Please fix the errors below');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    if (!bean?._id) {
      setError('Bean ID not found');
      return;
    }

    try {
      setLoading(true);
      await updateBean(bean._id, formData);
      onSuccess?.();
      onClose();
    } catch (err: any) {
      console.error('Error submitting bean:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to submit';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 md:px-8 py-6 border-b border-slate-200">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
              Edit Bean of Wisdom
            </h2>
            <p className="text-slate-600 mt-1">Update your daily investment insight</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-6 h-6 text-slate-500" />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mx-6 md:mx-8 mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-900">Error</p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Form Content - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 md:px-8 py-6">
          {!fieldLimits ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 className="w-10 h-10 animate-spin text-orange-500 mx-auto mb-4" />
                <p className="text-slate-600">Loading form...</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <FormField
                label="Title"
                name="title"
                value={formData.title || ''}
                onChange={handleInputChange}
                maxLength={fieldLimits.title}
                current={getCharCount('title')}
                max={fieldLimits.title}
                error={fieldErrors.title}
                placeholder="e.g., The Power of Compound Interest"
                required
              />

              {/* Subtitle */}
              <FormField
                label="Subtitle"
                name="subtitle"
                value={formData.subtitle || ''}
                onChange={handleInputChange}
                maxLength={fieldLimits.subtitle}
                current={getCharCount('subtitle')}
                max={fieldLimits.subtitle}
                error={fieldErrors.subtitle}
                placeholder="Brief description of the wisdom"
                textarea
                rows={2}
                required
              />

              {/* Two Column Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Section Title */}
                <FormField
                  label="Section Title"
                  name="sectionTitle"
                  value={formData.sectionTitle || ''}
                  onChange={handleInputChange}
                  maxLength={fieldLimits.sectionTitle}
                  current={getCharCount('sectionTitle')}
                  max={fieldLimits.sectionTitle}
                  error={fieldErrors.sectionTitle}
                  placeholder="e.g., Core Concept"
                  required
                />

                {/* Key Principle */}
                <FormField
                  label="Key Principle"
                  name="keyPrinciple"
                  value={formData.keyPrinciple || ''}
                  onChange={handleInputChange}
                  maxLength={fieldLimits.keyPrinciple}
                  current={getCharCount('keyPrinciple')}
                  max={fieldLimits.keyPrinciple}
                  error={fieldErrors.keyPrinciple}
                  placeholder="e.g., Patience & Discipline"
                  required
                />
              </div>

              {/* Description */}
              <FormField
                label="Description"
                name="description"
                value={formData.description || ''}
                onChange={handleInputChange}
                maxLength={fieldLimits.description}
                current={getCharCount('description')}
                max={fieldLimits.description}
                error={fieldErrors.description}
                placeholder="Detailed explanation of the wisdom..."
                textarea
                rows={4}
                required
              />

              {/* Quote */}
              <FormField
                label="Quote"
                name="quote"
                value={formData.quote || ''}
                onChange={handleInputChange}
                maxLength={fieldLimits.quote}
                current={getCharCount('quote')}
                max={fieldLimits.quote}
                error={fieldErrors.quote}
                placeholder="Inspirational quote..."
                textarea
                rows={3}
                required
              />

              {/* Insight Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  label="Insight Tag"
                  name="insightTag"
                  value={formData.insightTag || ''}
                  onChange={handleInputChange}
                  maxLength={fieldLimits.insightTag}
                  current={getCharCount('insightTag')}
                  max={fieldLimits.insightTag}
                  error={fieldErrors.insightTag}
                  placeholder="e.g., Practical"
                  required
                />

                <div className="md:col-span-2">
                  <FormField
                    label="Insight Text"
                    name="insightText"
                    value={formData.insightText || ''}
                    onChange={handleInputChange}
                    maxLength={fieldLimits.insightText}
                    current={getCharCount('insightText')}
                    max={fieldLimits.insightText}
                    error={fieldErrors.insightText}
                    placeholder="Additional insight..."
                    textarea
                    rows={3}
                    required
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Tags <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.tags?.join(", ") || ''}
                  onChange={handleTagsChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${
                    fieldErrors.tags 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-slate-200 focus:border-orange-500'
                  }`}
                  placeholder="e.g., investing, finance, wisdom (comma-separated)"
                />
                {fieldErrors.tags && (
                  <p className="mt-2 text-sm text-red-600">{fieldErrors.tags}</p>
                )}
                <p className="mt-2 text-sm text-slate-500">
                  Separate tags with commas. Max {fieldLimits.tags} characters per tag.
                </p>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 px-6 md:px-8 py-6 bg-slate-50 rounded-b-3xl">
          <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-3 text-slate-700 bg-white border-2 border-slate-200 hover:bg-slate-50 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || !fieldLimits}
              className="px-6 py-3 text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:shadow-lg rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  maxLength: number;
  current: number;
  max: number;
  error?: string;
  placeholder?: string;
  textarea?: boolean;
  rows?: number;
  required?: boolean;
}

function FormField({
  label,
  name,
  value,
  onChange,
  maxLength,
  current,
  max,
  error,
  placeholder,
  textarea,
  rows = 3,
  required,
}: FormFieldProps) {
  const isWarning = current > max * 0.8;
  const isError = current > max || !!error;

  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {textarea ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          maxLength={maxLength}
          rows={rows}
          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none transition-all ${
            isError 
              ? 'border-red-300 focus:border-red-500' 
              : 'border-slate-200 focus:border-orange-500'
          }`}
          placeholder={placeholder}
        />
      ) : (
        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          maxLength={maxLength}
          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${
            isError 
              ? 'border-red-300 focus:border-red-500' 
              : 'border-slate-200 focus:border-orange-500'
          }`}
          placeholder={placeholder}
        />
      )}
      <div className="flex justify-between items-center mt-2">
        {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
        <p
          className={`text-sm font-medium ml-auto ${
            isError ? 'text-red-600' : isWarning ? 'text-orange-600' : 'text-slate-500'
          }`}
        >
          {current}/{max}
        </p>
      </div>
    </div>
  );
}