const express = require('express');
const router = express.Router();
const { validateUpdate } = require('../middlewares/validators/userValidator');
const controller = require('../controllers/userController');
const { authUser } = require('../middlewares/auth');

router.use(authUser);

router.get('/', controller.getUsers);
router.get('/:id', controller.getUser);
router.put('/:id', validateUpdate, controller.updateUser);
router.delete('/:id', controller.deleteUser);

module.exports = router;
