const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUsersByWoreda,
  getUsersByRole
} = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

router.route('/')
  .get(authorize('woreda_admin', 'subcity_admin'), getUsers)
  .post(authorize('woreda_admin', 'subcity_admin'), createUser);

router.route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(authorize('woreda_admin', 'subcity_admin'), deleteUser);

router.get('/woreda/:woreda', authorize('woreda_admin', 'subcity_admin'), getUsersByWoreda);
router.get('/role/:role', authorize('woreda_admin', 'subcity_admin'), getUsersByRole);

module.exports = router;