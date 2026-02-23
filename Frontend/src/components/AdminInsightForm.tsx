import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/api/axios";

interface InsightData {
  _id?: string;
  title: string;
  description: string;
  investBeansInsight: string;
  sentiment: string;
  category: string;
  marketType: string;
  credits: {
    source: string;
    author?: string;
    url?: string;
  };
}

interface AdminInsightFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingInsight?: Partial<InsightData>;
}

const AdminInsightForm = ({
  isOpen,
  onClose,
  onSuccess,
  editingInsight,
}: AdminInsightFormProps) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    investBeansInsight: "",
    creditSource: "",
    creditAuthor: "",
    creditUrl: "",
    sentiment: "neutral",
    category: "",
    marketType: "domestic",
  
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingInsight) {
      setFormData({
        title: (editingInsight.title as string) || "",
        description: (editingInsight.description as string) || "",
        investBeansInsight: (editingInsight.investBeansInsight as string) || "",
        creditSource: (editingInsight.credits?.source as string) || "",
        creditAuthor: (editingInsight.credits?.author as string) || "",
        creditUrl: (editingInsight.credits?.url as string) || "",
        sentiment: (editingInsight.sentiment as string) || "neutral",
        category: (editingInsight.category as string) || "",
        marketType: (editingInsight.marketType as string) || "domestic",
   
      });
    } else {
      setFormData({
        title: "",
        description: "",
        investBeansInsight: "",
        creditSource: "",
        creditAuthor: "",
        creditUrl: "",
        sentiment: "neutral",
        category: "",
        marketType: "domestic",
       
      });
    }
    setError("");
  }, [editingInsight, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validate required fields
      if (!formData.title.trim()) {
        throw new Error("Title is required");
      }
      if (!formData.description.trim()) {
        throw new Error("Description is required");
      }
      if (!formData.investBeansInsight.trim()) {
        throw new Error("InvestBeans Insight is required");
      }
      if (!formData.creditSource.trim()) {
        throw new Error("Credit source is required");
      }
      if (!formData.category.trim()) {
        throw new Error("Category is required");
      }

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        investBeansInsight: formData.investBeansInsight.trim(),
        credits: {
          source: formData.creditSource.trim(),
          author: formData.creditAuthor.trim(),
          url: formData.creditUrl.trim(),
        },
        sentiment: formData.sentiment,
        category: formData.category.trim(),
        marketType: formData.marketType,
        
      };

    //   console.log("Submitting insight payload:", payload);

      if (editingInsight) {
        const response = await api.put(`/insights/admin/${editingInsight._id}`, payload);
       
      } else {
        const response = await api.post("/insights/admin/create", payload);
       
      }

      onSuccess();
      onClose();
    } catch (err: unknown) {
      let errorMessage = "Failed to save insight. Please try again.";
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (err && typeof err === 'object' && 'response' in err) {
        const errObj = err as Record<string, unknown>;
        const response = errObj.response as Record<string, unknown>;
        errorMessage = (response?.data as Record<string, unknown>)?.message as string || errorMessage;
      }
      
      console.error("Error saving insight:", errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl animate-scale-in my-8">
        {/* Header */}
        <div className="sticky top-0 z-10 p-6 rounded-t-2xl" style={{background: "linear-gradient(135deg, #F5DC8A 0%, #D4A843 50%, #B8860B 100%)"}}>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-amber-950">
              {editingInsight ? "Edit Insight" : "Create New Insight"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-black/10 transition-colors text-amber-950"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <Label htmlFor="title" className="text-base font-semibold text-foreground mb-2 block">
              Title *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Enter insight title"
              required
              maxLength={200}
              className="text-base h-12"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-base font-semibold text-foreground mb-2 block">
              Description *
            </Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Brief description of the insight (this will appear on the card preview)"
              required
              maxLength={1000}
              rows={6}
              className="w-full px-4 py-3 text-base border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-accent resize-none"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {formData.description.length}/1000 characters
            </p>
          </div>

          {/* InvestBeans Insight */}
          <div>
            <Label htmlFor="investBeansInsight" className="text-base font-semibold text-foreground mb-2 block">
              InvestBeans Insight *
            </Label>
            <textarea
              id="investBeansInsight"
              value={formData.investBeansInsight}
              onChange={(e) =>
                setFormData({ ...formData, investBeansInsight: e.target.value })
              }
              placeholder="Your expert analysis and insights"
              required
              maxLength={2000}
              rows={4}
              className="w-full px-4 py-3 text-base border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-accent resize-none"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {formData.investBeansInsight.length}/2000 characters
            </p>
          </div>

          {/* Credits Section */}
          <div className="space-y-4 p-6 bg-amber-50 rounded-xl border border-amber-200">
            <h3 className="text-lg font-semibold text-foreground">Credits & Source</h3>
            
            <div>
              <Label htmlFor="creditSource" className="text-base font-semibold text-foreground mb-2 block">
                Source *
              </Label>
              <Input
                id="creditSource"
                value={formData.creditSource}
                onChange={(e) =>
                  setFormData({ ...formData, creditSource: e.target.value })
                }
                placeholder="e.g., Bloomberg, Reuters, Economic Times"
                required
                className="text-base h-12"
              />
            </div>

            <div>
              <Label htmlFor="creditAuthor" className="text-base text-foreground mb-2 block">
                Author (Optional)
              </Label>
              <Input
                id="creditAuthor"
                value={formData.creditAuthor}
                onChange={(e) =>
                  setFormData({ ...formData, creditAuthor: e.target.value })
                }
                placeholder="Author name"
                className="text-base h-12"
              />
            </div>

            <div>
              <Label htmlFor="creditUrl" className="text-base text-foreground mb-2 block">
                Source URL (Optional)
              </Label>
              <Input
                id="creditUrl"
                type="url"
                value={formData.creditUrl}
                onChange={(e) =>
                  setFormData({ ...formData, creditUrl: e.target.value })
                }
                placeholder="https://example.com/article"
                className="text-base h-12"
              />
            </div>
          </div>

          {/* Category & Market Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="category" className="text-base font-semibold text-foreground mb-2 block">
                Category *
              </Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                placeholder="e.g., Market Analysis, Technology"
                required
                className="text-base h-12"
              />
            </div>

            <div>
              <Label htmlFor="marketType" className="text-base font-semibold text-foreground mb-2 block">
                Market Type *
              </Label>
              <select
                id="marketType"
                value={formData.marketType}
                onChange={(e) =>
                  setFormData({ ...formData, marketType: e.target.value })
                }
                required
                className="w-full px-4 py-3 text-base border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-accent h-12"
              >
                <option value="domestic">Domestic</option>
                <option value="global">Global</option>
              </select>
            </div>
          </div>

          {/* Sentiment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="sentiment" className="text-base font-semibold text-foreground mb-2 block">
                Sentiment *
              </Label>
              <select
                id="sentiment"
                value={formData.sentiment}
                onChange={(e) =>
                  setFormData({ ...formData, sentiment: e.target.value })
                }
                required
                className="w-full px-4 py-3 text-base border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-accent h-12"
              >
                <option value="positive">Positive</option>
                <option value="negative">Negative</option>
                <option value="neutral">Neutral</option>
              </select>
            </div>
          </div>

         

          {/* Buttons */}
          <div className="flex gap-4 pt-4 sticky bottom-0 bg-white pb-4 border-t border-gray-200 -mx-6 sm:-mx-8 px-6 sm:px-8">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex-1 h-12 text-base font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 h-12 text-base font-semibold text-amber-950"
              style={{background: "linear-gradient(135deg, #E8C45A 0%, #C4941E 100%)"}}
            >
              {loading
                ? "Saving..."
                : editingInsight
                ? "Update Insight"
                : "Create Insight"}
            </Button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
};

export default AdminInsightForm;