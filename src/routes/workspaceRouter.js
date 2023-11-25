const express = require('express');
const workspaceController = require('../controllers/workspaceController.js');

const router = express.Router();

router
  .route('/')
  .get(workspaceController.getAllWorkspaces)
  .post(workspaceController.createWorkspace)

router
  .route('/:id')
  .get(workspaceController.getWorkspace)
  .patch(workspaceController.updateWorkspace)
  .delete(workspaceController.deleteWorkspace);

router
  .route('/:url')
  .get(workspaceController.getWorkspaceByUrl);

module.exports = router;