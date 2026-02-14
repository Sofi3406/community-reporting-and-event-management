const express = require('express');
const router = express.Router();
const {
  getAnnouncements,
  createAnnouncement,
  deleteAnnouncement
} = require('../controllers/announcementController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

router.route('/')
  .get(getAnnouncements)
  .post(authorize('officer', 'woreda_admin', 'subcity_admin'), createAnnouncement);

router.route('/:id')
  .delete(authorize('officer', 'woreda_admin', 'subcity_admin'), deleteAnnouncement);

module.exports = router;
