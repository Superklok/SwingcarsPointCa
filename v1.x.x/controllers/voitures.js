const Voiture        = require('../models/voiture'),
	  mbxGeocoding   = require('@mapbox/mapbox-sdk/services/geocoding'),
	  mapBoxToken    = process.env.MAPBOX_TOKEN,
	  geocoder       = mbxGeocoding({ accessToken: mapBoxToken }),
	  { cloudinary } = require('../cloudinary');

module.exports.index = async (req, res) => {
	if (!req.query.page) {
		const voitures = await Voiture.paginate({}, {});
		res.render('voitures/index', { voitures });
	} else {
		const { page } = req.query;
		const voitures = await Voiture.paginate({}, {
			page
		});
		res.status(200).json(voitures);
	}
}

module.exports.renderNewForm = (req, res) => {
	res.render('voitures/new');
}

module.exports.createVoiture = async (req, res, next) => {
	const geoData = await geocoder.forwardGeocode({
		query: req.body.voiture.localisation,
		limit: 1
	}).send()
	const voiture = new Voiture(req.body.voiture);
	voiture.geometry = geoData.body.features[0].geometry;
	voiture.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
	voiture.automobiliste = req.user._id;
	await voiture.save();
	req.flash('success', 'Inscription d\'une nouvelle voiture à réussie!');
	res.redirect(`/voitures/${ voiture._id }`);
}

module.exports.showVoiture = async (req, res) => {
	const voiture = await Voiture.findById(req.params.id).populate({
		path: 'critiques',
		populate: {
			path: 'automobiliste'
		}
	}).populate('automobiliste');
	if (!voiture) {
		req.flash('error', 'Désolé, la voiture que vous cherchez est introuvable.');
		return res.redirect('/voitures');
	}
	res.render('voitures/show', { voiture });
}

module.exports.renderEditForm = async (req, res) => {
	const { id } = req.params;
	const voiture = await Voiture.findById(id)
	if (!voiture) {
		req.flash('error', 'Désolé, la voiture que vous cherchez est introuvable.');
		return res.redirect('/voitures');
	}
	res.render('voitures/edit', { voiture });
}

module.exports.updateVoiture = async (req, res) => {
	const { id } = req.params;
	const voiture = await Voiture.findByIdAndUpdate(id, { ...req.body.voiture });
	const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
	voiture.images.push(...imgs);
	await voiture.save();
	if (req.body.destroyImg) {
		for (let filename of req.body.destroyImg) {
			await cloudinary.uploader.destroy(filename);
		}
		await voiture.updateOne({ $pull: { images: { filename: { $in: req.body.destroyImg } } } });
	}
	req.flash('success', 'Voiture mis à jour avec succès!');
	res.redirect(`/voitures/${ voiture._id }`);
}

module.exports.destroyVoiture = async (req, res) => {
	const { id } = req.params;
	await Voiture.findByIdAndDelete(id);
	req.flash('success', 'Voiture supprimée avec succès!');
	res.redirect('/voitures');
}