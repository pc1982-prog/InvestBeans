import { Resend } from "resend";
import { Subscriber } from "../models/Subscriber.model.js";
import { getWelcomeEmailHTML } from "../utils/subscribeEmail.template.js";


const resend = new Resend(process.env.RESEND_API_KEY);


const EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;


const DISPOSABLE_DOMAINS = new Set([
    "mailinator.com", "guerrillamail.com", "10minutemail.com",
    "trashmail.com", "yopmail.com", "tempmail.com", "throwaway.email",
    "sharklasers.com", "guerrillamailblock.com",
]);

export const subscribeNewsletter = async (req, res) => {
    try {
        const { email } = req.body;

        // ── 1. Presence check ─────────────────────────────────────────────────
        if (!email || typeof email !== "string") {
            return res.status(400).json({
                success: false,
                message: "Email address is required.",
            });
        }

        const trimmedEmail = email.trim().toLowerCase();

        // ── 2. Format validation ──────────────────────────────────────────────
        if (!EMAIL_REGEX.test(trimmedEmail)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address.",
            });
        }

        // ── 3. Disposable email check ─────────────────────────────────────────
        const domain = trimmedEmail.split("@")[1];
        if (DISPOSABLE_DOMAINS.has(domain)) {
            return res.status(400).json({
                success: false,
                message: "Disposable email addresses are not allowed.",
            });
        }

        // ── 4. Duplicate check ────────────────────────────────────────────────
        const existing = await Subscriber.findOne({ email: trimmedEmail });
        if (existing) {
            // If already subscribed but inactive, re-activate
            if (!existing.isActive) {
                existing.isActive = true;
                await existing.save();
                return res.status(200).json({
                    success: true,
                    message: "Welcome back! Your subscription has been reactivated.",
                    alreadySubscribed: false,
                });
            }
            return res.status(409).json({
                success: false,
                message: "This email is already subscribed. Check your inbox for our latest insights! 📧",
                alreadySubscribed: true,
            });
        }

        // ── 5. Save to database ───────────────────────────────────────────────
        const subscriber = await Subscriber.create({
            email: trimmedEmail,
            userId: req.user?._id || null,   // Link user if authenticated
            source: req.body.source || "homepage",
        });

        // ── 6. Send welcome email via Resend ──────────────────────────────────
        let emailSent = false;
        let emailError = null;

        try {
            const { data, error } = await resend.emails.send({
                from: "InvestBeans <onboarding@resend.dev>",
                to: [""],
                subject: "🫘 Welcome to InvestBeans — You're In!",
                html: getWelcomeEmailHTML(trimmedEmail),
                text: `Welcome to InvestBeans! Thank you for subscribing. You'll receive daily market insights, stock analysis, IPO alerts, and expert tips. Visit us at https://investbeans.com`,
            });

            if (error) {
                console.error("Resend email error:", error);
                emailError = error.message;
            } else {
                emailSent = true;
                console.log(`✅ Welcome email sent to ${trimmedEmail} | Resend ID: ${data?.id}`);
            }
        } catch (emailEx) {
            // Email failure should NOT block subscription success
            console.error("Resend exception:", emailEx.message);
            emailError = emailEx.message;
        }

        // ── 7. Respond to client ──────────────────────────────────────────────
        return res.status(201).json({
            success: true,
            message: emailSent
                ? "🎉 Successfully subscribed! Check your inbox for a welcome email."
                : "✅ Successfully subscribed! (Welcome email will be sent shortly.)",
            data: {
                subscriberId: subscriber._id,
                email: subscriber.email,
                subscribedAt: subscriber.createdAt,
                emailSent,
                // Only expose emailError in development
                ...(process.env.NODE_ENV !== "production" && emailError
                    ? { emailError }
                    : {}),
            },
        });
    } catch (error) {
        console.error("Subscribe controller error:", error);


        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "This email is already subscribed.",
                alreadySubscribed: true,
            });
        }

        return res.status(500).json({
            success: false,
            message: "Something went wrong. Please try again later.",
        });
    }
};


export const checkSubscription = async (req, res) => {
    try {
        const { email } = req.query;

        if (!email || !EMAIL_REGEX.test(email.trim().toLowerCase())) {
            return res.status(400).json({ success: false, message: "Valid email required." });
        }

        const exists = await Subscriber.findOne({
            email: email.trim().toLowerCase(),
            isActive: true,
        }).lean();

        return res.status(200).json({
            success: true,
            isSubscribed: !!exists,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error." });
    }
};


export const unsubscribe = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email || !EMAIL_REGEX.test(email.trim().toLowerCase())) {
            return res.status(400).json({ success: false, message: "Valid email required." });
        }

        const subscriber = await Subscriber.findOneAndUpdate(
            { email: email.trim().toLowerCase() },
            { isActive: false },
            { new: true }
        );

        if (!subscriber) {
            return res.status(404).json({ success: false, message: "Email not found in our list." });
        }

        return res.status(200).json({
            success: true,
            message: "You have been unsubscribed successfully.",
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error." });
    }
};