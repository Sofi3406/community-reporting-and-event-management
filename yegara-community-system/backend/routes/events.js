const express = require('express');
const router = express.Router();
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventsByWoreda,
  registerForEvent
} = require('../controllers/eventController');
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../utils/upload');

router.use(authenticate);

router.route('/')
  .get(getEvents)
  .post(authorize('woreda_admin', 'subcity_admin'), upload.array('images', 5), createEvent);

router.route('/:id')
  .get(getEvent)
  .put(authorize('woreda_admin', 'subcity_admin'), upload.array('images', 5), updateEvent)
  .delete(authorize('woreda_admin', 'subcity_admin'), deleteEvent);

router.get('/woreda/:woreda', getEventsByWoreda);
router.post('/:id/register', registerForEvent);

module.exports = router;