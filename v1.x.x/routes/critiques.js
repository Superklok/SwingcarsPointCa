const express = require('express');
const router = express.Router({mergeParams: true});
const {validateCritique, isLoggedIn, isCommentateur} = require('../middleware');
const catchAsync = require('../HELPeR/catchAsync');
const critiques = require('../controllers/critiques');

router.post('/', 
	isLoggedIn, 
	validateCritique, 
	catchAsync(critiques.createCritique));

router.delete('/:critiqueId', 
	isLoggedIn, 
	isCommentateur, 
	catchAsync(critiques.destroyCritique));

module.exports = router;