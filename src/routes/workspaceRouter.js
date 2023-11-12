const express = require('express');
const workspaceController = require('../controllers/workspaceController.js');

const router = express.Router();

router.post('/', workspaceController.createWorkspace);
router
  .route('/:workspaceUrl')
  .get(workspaceController.getWorkspace);

module.exports = router;