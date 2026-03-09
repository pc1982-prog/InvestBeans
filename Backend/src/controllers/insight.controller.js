import { Insight } from "../models/insight.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Helper function to calculate read time based on content length
const calculateReadTime = (description, investBeansInsight) => {
  const avgWordsPerMinute = 200;
  const totalText = `${description} ${investBeansInsight}`;
  const wordCount = totalText.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / avgWordsPerMinute);
  return `${minutes} min read`;
};

// @desc    Create new insight (Admin only)
// @route   POST /api/v1/insights/admin/create
// @access  Private (Admin)
export const createInsight = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    investBeansInsight,
    credits,
    sentiment,
    category,
    marketType,
  } = req.body;

  // Validate required fields
  if (
    !title ||
    !description ||
    !investBeansInsight ||
    !credits?.source ||
    !category ||
    !marketType
  ) {
    throw new ApiError(400, "All required fields must be provided");
  }

  // ✅ Validate marketType includes commodities
  const validMarketTypes = ["domestic", "global", "commodities"];
  if (!validMarketTypes.includes(marketType)) {
    throw new ApiError(400, `marketType must be one of: ${validMarketTypes.join(", ")}`);
  }

  // Auto-calculate read time
  const readTime = calculateReadTime(description, investBeansInsight);

  // Create insight - publishedDate auto-set by model default
  const insight = await Insight.create({
    title,
    description,
    investBeansInsight,
    credits: {
      source: credits.source,
      author: credits.author || "",
      url: credits.url || "",
    },
    sentiment: sentiment || "neutral",
    category,
    marketType,
    readTime,
    author: req.user._id,
    publishedAt: new Date(),
  });

  return res
    .status(201)
    .json(new ApiResponse(201, insight, "Insight created successfully"));
});

// @desc    Get all published insights (Public)
// @route   GET /api/v1/insights?marketType=domestic&limit=12&page=1
// @access  Public
export const getAllInsights = asyncHandler(async (req, res) => {
  const {
    marketType,
    category,
    sentiment,
    limit = 100,
    page = 1,
    sort = "-publishedAt",
  } = req.query;

  // Build query
  const query = { isPublished: true };

  if (marketType) {
    query.marketType = marketType;
  }
  if (category) {
    query.category = category;
  }
  if (sentiment) {
    query.sentiment = sentiment;
  }

  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Execute query
  const insights = await Insight.find(query)
    .sort(sort)
    .limit(parseInt(limit))
    .skip(skip)
    .lean();

  // Add isLiked field if user is authenticated
  const userId = req.user?._id;
  const processedInsights = insights.map((insight) => {
    const insightObj = { ...insight };

    if (userId && insightObj.likedBy && Array.isArray(insightObj.likedBy)) {
      insightObj.isLiked = insightObj.likedBy.some(
        likedUserId => likedUserId.toString() === userId.toString()
      );
    } else {
      insightObj.isLiked = false;
    }

    // Remove likedBy array from response for security
    delete insightObj.likedBy;
    // Remove investBeansInsight from list view
    delete insightObj.investBeansInsight;

    return insightObj;
  });

  const total = await Insight.countDocuments(query);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        insights: processedInsights,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      },
      "Insights fetched successfully"
    )
  );
});

// @desc    Get single insight by ID (Public)
// @route   GET /api/v1/insights/:id
// @access  Public
export const getInsightById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const insight = await Insight.findById(id).populate(
    "author",
    "name email image"
  );

  if (!insight) {
    throw new ApiError(404, "Insight not found");
  }

  // Increment views
  await insight.incrementViews();

  // Check if user liked this insight
  const userId = req.user?._id;
  const response = insight.toObject();
  if (userId && insight.likedBy && Array.isArray(insight.likedBy)) {
    response.isLiked = insight.likedBy.some(
      id => id.toString() === userId.toString()
    );
  } else {
    response.isLiked = false;
  }
  delete response.likedBy;

  return res
    .status(200)
    .json(new ApiResponse(200, response, "Insight fetched successfully"));
});

// @desc    Toggle like on insight
// @route   POST /api/v1/insights/:id/like
// @access  Private
export const toggleLike = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const insight = await Insight.findById(id);

  if (!insight) {
    throw new ApiError(404, "Insight not found");
  }

  await insight.toggleLike(userId);

  const updatedInsight = await Insight.findById(id);

  if (!updatedInsight) {
    throw new ApiError(404, "Insight not found after update");
  }

  const isLiked = updatedInsight.likedBy && Array.isArray(updatedInsight.likedBy)
    ? updatedInsight.likedBy.some(
        likedUserId => likedUserId.toString() === userId.toString()
      )
    : false;

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { likes: updatedInsight.likes, isLiked },
        isLiked ? "Insight liked" : "Insight unliked"
      )
    );
});

// @desc    Update insight (Admin only)
// @route   PUT /api/v1/insights/admin/:id
// @access  Private (Admin)
export const updateInsight = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    investBeansInsight,
    credits,
    sentiment,
    category,
    marketType,
  } = req.body;

  const insight = await Insight.findById(id);

  if (!insight) {
    throw new ApiError(404, "Insight not found");
  }

  // ✅ Validate marketType if provided
  if (marketType) {
    const validMarketTypes = ["domestic", "global", "commodities"];
    if (!validMarketTypes.includes(marketType)) {
      throw new ApiError(400, `marketType must be one of: ${validMarketTypes.join(", ")}`);
    }
  }

  if (title) insight.title = title;
  if (description) insight.description = description;
  if (investBeansInsight) insight.investBeansInsight = investBeansInsight;

  if (description || investBeansInsight) {
    insight.readTime = calculateReadTime(
      description || insight.description,
      investBeansInsight || insight.investBeansInsight
    );
  }

  if (credits) {
    insight.credits = {
      source: credits.source || insight.credits.source,
      author: credits.author || insight.credits.author,
      url: credits.url || insight.credits.url,
      publishedDate: insight.credits.publishedDate,
    };
  }
  if (sentiment) insight.sentiment = sentiment;
  if (category) insight.category = category;
  if (marketType) insight.marketType = marketType;

  await insight.save();

  return res
    .status(200)
    .json(new ApiResponse(200, insight, "Insight updated successfully"));
});

// @desc    Delete insight (Admin only)
// @route   DELETE /api/v1/insights/admin/:id
// @access  Private (Admin)
export const deleteInsight = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const insight = await Insight.findById(id);

  if (!insight) {
    throw new ApiError(404, "Insight not found");
  }

  await insight.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Insight deleted successfully"));
});

// @desc    Get all insights for admin (Admin only)
// @route   GET /api/v1/insights/admin/all
// @access  Private (Admin)
export const getAdminInsights = asyncHandler(async (req, res) => {
  const {
    marketType,
    category,
    sentiment,
    limit = 20,
    page = 1,
    sort = "-createdAt",
  } = req.query;

  const query = {};

  if (marketType) query.marketType = marketType;
  if (category) query.category = category;
  if (sentiment) query.sentiment = sentiment;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const insights = await Insight.find(query)
    .sort(sort)
    .limit(parseInt(limit))
    .skip(skip)
    .populate("author", "name email")
    .lean();

  const total = await Insight.countDocuments(query);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        insights,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      },
      "Admin insights fetched successfully"
    )
  );
});

// @desc    Get insights statistics (Admin only)
// @route   GET /api/v1/insights/admin/stats
// @access  Private (Admin)
export const getInsightStats = asyncHandler(async (req, res) => {
  const totalInsights = await Insight.countDocuments();
  const publishedInsights = await Insight.countDocuments({ isPublished: true });
  const draftInsights = await Insight.countDocuments({ isPublished: false });

  const domesticInsights = await Insight.countDocuments({ marketType: "domestic", isPublished: true });
  const globalInsights = await Insight.countDocuments({ marketType: "global", isPublished: true });
  // ✅ Added commodities count
  const commoditiesInsights = await Insight.countDocuments({ marketType: "commodities", isPublished: true });

  const viewsResult = await Insight.aggregate([
    { $group: { _id: null, totalViews: { $sum: "$views" } } },
  ]);
  const totalViews = viewsResult[0]?.totalViews || 0;

  const likesResult = await Insight.aggregate([
    { $group: { _id: null, totalLikes: { $sum: "$likes" } } },
  ]);
  const totalLikes = likesResult[0]?.totalLikes || 0;

  const topInsights = await Insight.find({ isPublished: true })
    .sort("-views")
    .limit(5)
    .select("title views likes category marketType")
    .lean();

  const categoryStats = await Insight.aggregate([
    { $match: { isPublished: true } },
    { $group: { _id: "$category", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  const stats = {
    total: totalInsights,
    published: publishedInsights,
    drafts: draftInsights,
    domestic: domesticInsights,
    global: globalInsights,
    commodities: commoditiesInsights, // ✅ new
    totalViews,
    totalLikes,
    topInsights,
    categoryStats,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, stats, "Statistics fetched successfully"));
});

// @desc    Toggle publish status (Admin only)
// @route   PATCH /api/v1/insights/admin/:id/toggle-publish
// @access  Private (Admin)
export const togglePublishStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const insight = await Insight.findById(id);

  if (!insight) {
    throw new ApiError(404, "Insight not found");
  }

  insight.isPublished = !insight.isPublished;
  await insight.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, insight, "Publish status updated successfully")
    );
});