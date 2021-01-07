const {voitureSchema, critiqueSchema} = require('./schemas.js');
const ExpressError = require('./HELPeR/ExpressError');
const Voiture = require('./models/voiture');
const Critique = require('./models/critique');

module.exports.isLoggedIn = (req, res, next) => {
	if (!req.isAuthenticated()) {
		req.flash('error', 'Seulement les membres inscrits peuvent faire cela.');
		return res.redirect('/login');
	}
	next();
}

module.exports.validateVoiture = (req, res, next) => {
	const {error} = voitureSchema.validate(req.body);
	if (error) {
		const msg = error.details.map(el => el.message).join(',')
		throw new ExpressError(msg, 400)
	} else {
		next();
	}
}

module.exports.isAutomobiliste = async (req, res, next) => {
	const {id} = req.params;
	const voiture = await Voiture.findById(id);
	if (!voiture.automobiliste.equals(req.user._id)) {
		req.flash('error', 'Veuillez connecter en tant que le membre qui soit le propriétaire de cette voiture pour faire cela.');
		return res.redirect(`/voitures/${id}`);
	}
	next();
}

module.exports.isCommentateur = async (req, res, next) => {
	const {id, critiqueId} = req.params;
	const critique = await Critique.findById(critiqueId);
	if (!critique.automobiliste.equals(req.user._id)) {
		req.flash('error', 'Veuillez connecter en tant que le membre qui a laissé cet avis pour faire cela.');
		return res.redirect(`/voitures/${id}`);
	}
	next();
}

module.exports.validateCritique = (req, res, next) => {
	const {error} = critiqueSchema.validate(req.body);
	if(error){
		const msg = error.details.map(el => el.message).join(',')
		throw new ExpressError(msg, 400)
	} else {
		next();
	}
}