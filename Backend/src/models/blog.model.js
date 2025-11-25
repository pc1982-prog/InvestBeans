import mongoose, { Schema } from "mongoose";

// Schema for individual header-subheader pairs
const headerSchema = new Schema({
    header: {
        type: String,
        required: true,
        trim: true
    },
    subHeader: {
        type: String,
        required: true,
        trim: true
    }
}, { _id: false });

const blogSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
            maxlength: [200, 'Title cannot exceed 200 characters']
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            trim: true,
            maxlength: [500, 'Description cannot exceed 500 characters']
        },
        content: {
            type: String,
            required: [true, 'Content is required'],
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            trim: true,
            enum: {
                values: [
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
                ],
                message: '{VALUE} is not a valid category'
            }
        },
      
        headerSections: {
            type: [headerSchema],
            default: []
        },
        tags: {
            type: [String],
            default: []
        },
        blogImage: {
            type: String,
            required: [true, 'Blog image is required']
        },
        cloudinaryPublicId: {
            type: String
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        isPublished: {
            type: Boolean,
            default: true
        },
        views: {
            type: Number,
            default: 0
        },
        readTime: {
            type: String
        },
        likes: {
            type: Number,
            default: 0
        },
        likedBy: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }]
    },

    {
        timestamps: true
    }
);

// Generate slug from title before saving
blogSchema.pre('save', async function (next) {
    if (this.isModified('title')) {
        let baseSlug = this.title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/--+/g, '-')
            .trim();

        let slug = baseSlug;
        let counter = 1;

        while (await mongoose.models.Blog.findOne({ slug, _id: { $ne: this._id } })) {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }

        this.slug = slug;
    }

    // Calculate read time
    if (this.isModified('content')) {
        const wordCount = this.content.split(/\s+/).length;
        const minutes = Math.ceil(wordCount / 200);
        this.readTime = `${minutes} min read`;
    }

    next();
});

// Indexes
blogSchema.index({ title: 'text', description: 'text' });
blogSchema.index({ category: 1, createdAt: -1 });
blogSchema.index({ isPublished: 1, createdAt: -1 });
blogSchema.index({ tags: 1 });

export const Blog = mongoose.model("Blog", blogSchema);