const express                                        = require('express'),
	  router                                         = express.Router({mergeParams: true}),
	  {validateCritique, isLoggedIn, isCommentateur} = require('../middleware'),
	  catchAsync                                     = require('../HELPeR/catchAsync'),
	  critiques                                      = require('../controllers/critiques');

router.post('/', 
	isLoggedIn, 
	validateCritique, 
	catchAsync(critiques.createCritique));

router.delete('/:critiqueId', 
	isLoggedIn, 
	isCommentateur, 
	catchAsync(critiques.destroyCritique));

module.exports = router;