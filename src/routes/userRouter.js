const express = require('express');

const router = express.Router();

router.get('/:id', userController.getUser);