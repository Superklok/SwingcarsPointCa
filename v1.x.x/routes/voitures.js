const express                                          = require('express'),
	  router                                           = express.Router(),
	  voitures                                         = require('../controllers/voitures'),
	  catchAsync                                       = require('../HELPeR/catchAsync'),
	  { isLoggedIn, isAutomobiliste, validateVoiture } = require('../middleware'),
	  multer                                           = require('multer'),
	  { storage }                                      = require('../cloudinary'),
	  upload                                           = multer({ storage });

router.route('/')
	.get(catchAsync(voitures.index))
	.post(isLoggedIn, 
		upload.array('image'), 
		validateVoiture, 
		catchAsync(voitures.createVoiture))

router.get('/new', 
	isLoggedIn, 
	voitures.renderNewForm);

router.route('/:id')
	.get(catchAsync(voitures.showVoiture))
	.put(isLoggedIn, 
		isAutomobiliste, 
		upload.array('image'), 
		validateVoiture, 
		catchAsync(voitures.updateVoiture))
	.delete(isLoggedIn, 
		isAutomobiliste, 
		catchAsync(voitures.destroyVoiture))

router.get('/:id/edit', 
	isLoggedIn, 
	isAutomobiliste, 
	catchAsync(voitures.renderEditForm));

module.exports = router;