
import { Subscription } from "../models/Subscription.model.js";


export const getMySubscriptions = async (req, res) => {
  try {
    const now          = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 86_400_000);

    const subs = await Subscription.find({
      userId: req.user._id,
      // Active subscriptions + expired within last 30 days (show renew CTA)
      $or: [
        { status: "active",  endDate: { $gt: now }          },
        { status: "active",  endDate: { $gte: thirtyDaysAgo, $lte: now } },
        { status: "expired", updatedAt: { $gte: thirtyDaysAgo } },
      ],
    })
      .sort({ endDate: -1 })
      .lean();

    
    const planMap = new Map();
    for (const s of subs) {
      const existing = planMap.get(s.plan);
      if (!existing || new Date(s.endDate) > new Date(existing.endDate)) {
        planMap.set(s.plan, s);
      }
    }

    const subscriptions = Array.from(planMap.values()).map(s => {
      const endDate      = new Date(s.endDate);
      const daysRemaining = Math.max(0, Math.ceil((endDate - now) / 86_400_000));
      const isExpired    = endDate <= now;

      return {
        plan:         s.plan,
        status:       isExpired ? "expired" : "active",
        endDate:      endDate.toISOString(),
        daysRemaining,
        startDate:    s.startDate,
        purchaseDate: s.purchaseDate || s.startDate,
        renewalCount: s.renewalCount || 0,
        amount:       s.amount,
      };
    });

    return res.status(200).json({ success: true, subscriptions });
  } catch (err) {
    console.error("getMySubscriptions:", err.message);
    return res.status(500).json({ success: false, message: "Could not fetch subscriptions" });
  }
};




