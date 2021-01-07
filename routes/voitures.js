const express = require('express');
const router = express.Router();
const voitures = require('../controllers/voitures');
const catchAsync = require('../HELPeR/catchAsync');
const { isLoggedIn, isAutomobiliste, validateVoiture } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

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