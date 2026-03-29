const Report = require('../models/Report');
const Event = require('../models/Event');
const Resource = require('../models/Resource');

const getStartOfWeek = () => {
  const now = new Date();
  const day = now.getDay();
  const diffToMonday = (day + 6) % 7;
  const start = new Date(now);
  start.setDate(now.getDate() - diffToMonday);
  start.setHours(0, 0, 0, 0);
  return start;
};

// @desc    Get public landing page stats
// @route   GET /api/public/landing-stats
// @access  Public
exports.getLandingStats = async (req, res, next) => {
  try {
    const weekStart = getStartOfWeek();
    const now = new Date();

    const [openReports, resolvedThisWeek, upcomingEvents, activeResources] = await Promise.all([
      Report.countDocuments({ status: { $in: ['Pending', 'In Progress'] } }),
      Report.countDocuments({
        status: 'Resolved',
        $or: [
          { resolvedAt: { $gte: weekStart } },
          {
            resolvedAt: { $exists: false },
            createdAt: { $gte: weekStart }
          }
        ]
      }),
      Event.countDocuments({
        status: 'Upcoming',
        date: { $gte: now }
      }),
      Resource.countDocuments({ isPublic: true })
    ]);

    res.status(200).json({
      success: true,
      data: {
        openReports,
        resolvedThisWeek,
        upcomingEvents,
        activeResources,
        updatedAt: new Date().toISOString()
      }
    });
  } catch (err) {
    next(err);
  }
};