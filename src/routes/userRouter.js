const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/', userController.createUser);
router
  .route('/:id')
  .get(userController.getUser);

// Leave Workspace
router.post('/:id/workspaces/:workspaceId', userController.leaveWorkspace);
module.exports = router;