const Event = require('../models/Event');
const ErrorResponse = require('../utils/errorResponse');
const { buildWoredaRegex } = require('../utils/woreda');

// @desc    Get all events
// @route   GET /api/events
// @access  Private
exports.getEvents = async (req, res, next) => {
  try {
    let query;
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];
    removeFields.forEach(param => delete reqQuery[param]);

    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    query = Event.find(JSON.parse(queryStr)).populate('organizer', 'fullName email');

    // Select fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Event.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex).limit(limit);

    const events = await query;

    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: events.length,
      pagination,
      data: events
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Private
exports.getEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'fullName email')
      .populate('attendees', 'fullName email');

    if (!event) {
      return next(new ErrorResponse('Event not found', 404));
    }

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private (Woreda/Subcity Admin)
exports.createEvent = async (req, res, next) => {
  try {
    req.body.organizer = req.user.id;

    if (!req.body.woreda && req.user.woreda) {
      req.body.woreda = req.user.woreda;
    }

    if (req.files && req.files.length > 0) {
      req.body.images = req.files.map(file => file.path);
    }

    const event = await Event.create(req.body);

    res.status(201).json({
      success: true,
      data: event
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (Woreda/Subcity Admin)
exports.updateEvent = async (req, res, next) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return next(new ErrorResponse('Event not found', 404));
    }

    if (event.organizer.toString() !== req.user.id && req.user.role !== 'subcity_admin') {
      return next(new ErrorResponse('Not authorized to update this event', 403));
    }

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => file.path);
      req.body.images = [...event.images, ...newImages];
    }

    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (Woreda/Subcity Admin)
exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return next(new ErrorResponse('Event not found', 404));
    }

    if (event.organizer.toString() !== req.user.id && req.user.role !== 'subcity_admin') {
      return next(new ErrorResponse('Not authorized to delete this event', 403));
    }

    await event.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get events by woreda
// @route   GET /api/events/woreda/:woreda
// @access  Private
exports.getEventsByWoreda = async (req, res, next) => {
  try {
    const woredaRegex = buildWoredaRegex(req.params.woreda);
    const events = await Event.find(woredaRegex ? { woreda: { $regex: woredaRegex } } : { woreda: req.params.woreda })
      .populate('organizer', 'fullName email')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Register for an event
// @route   POST /api/events/:id/register
// @access  Private
exports.registerForEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return next(new ErrorResponse('Event not found', 404));
    }

    if (event.status === 'Cancelled' || event.status === 'Completed') {
      return next(new ErrorResponse('Event is not open for registration', 400));
    }

    const alreadyRegistered = event.attendees.some(
      attendee => attendee.toString() === req.user.id
    );

    if (alreadyRegistered) {
      return next(new ErrorResponse('You are already registered for this event', 400));
    }

    if (event.maxAttendees && event.attendees.length >= event.maxAttendees) {
      return next(new ErrorResponse('Event has reached maximum capacity', 400));
    }

    event.attendees.push(req.user.id);
    await event.save();

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (err) {
    next(err);
  }
};
