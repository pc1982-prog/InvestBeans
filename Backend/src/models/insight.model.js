import mongoose from "mongoose";

const insightSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    investBeansInsight: {
      type: String,
      required: [true, "InvestBeans Insight is required"],
      trim: true,
      maxlength: [2000, "InvestBeans Insight cannot exceed 2000 characters"],
    },
    credits: {
      source: {
        type: String,
        required: [true, "Credit source is required"],
        trim: true,
      },
      author: {
        type: String,
        trim: true,
      },
      url: {
        type: String,
        trim: true,
        validate: {
          validator: function (v) {
            if (!v) return true;
            return /^https?:\/\/.+/.test(v);
          },
          message: "Please provide a valid URL",
        },
      },
      publishedDate: {
        type: Date,
        default: Date.now, // Auto-set to current date
      },
    },
    sentiment: {
      type: String,
      enum: ["positive", "negative", "neutral"],
      default: "neutral",
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    marketType: {
      type: String,
      enum: ["domestic", "global"],
      required: [true, "Market type is required"],
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    likedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
    readTime: {
      type: String,
      default: "5 min read",
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
insightSchema.index({ marketType: 1, isPublished: 1, publishedAt: -1 });
insightSchema.index({ category: 1 });
insightSchema.index({ sentiment: 1 });

// Method to increment views
insightSchema.methods.incrementViews = function () {
  this.views += 1;
  return this.save();
};

// Method to toggle like
insightSchema.methods.toggleLike = function (userId) {
  const userIdStr = userId.toString();
  const isLiked = this.likedBy.some(id => id.toString() === userIdStr);
  
  if (isLiked) {
    this.likedBy = this.likedBy.filter(id => id.toString() !== userIdStr);
    this.likes = Math.max(0, this.likes - 1);
  } else {
    this.likedBy.push(userId);
    this.likes += 1;
  }
  
  return this.save();
};

export const Insight = mongoose.model("Insight", insightSchema);