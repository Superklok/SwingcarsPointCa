const Voiture = require('../models/voiture');
const Critique = require('../models/critique');

module.exports.createCritique = async (req, res) => {
	const voiture = await Voiture.findById(req.params.id);
	const critique = new Critique(req.body.critique);
	critique.automobiliste = req.user._id;
	voiture.critiques.push(critique);
	await critique.save();
	await voiture.save();
	req.flash('success', 'Merci d\'avoir laissé votre avis!');
	res.redirect(`/voitures/${ voiture._id }`);
}

module.exports.destroyCritique = async (req, res) => {
	const { id, critiqueId } = req.params;
	await Voiture.findByIdAndUpdate(id, { $pull: { critiques: critiqueId } });
	await Critique.findByIdAndDelete(critiqueId);
	req.flash('success', 'Votre avis a été supprimé avec succès!');
	res.redirect(`/voitures/${ id }`);
}