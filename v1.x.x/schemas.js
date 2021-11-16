const BaseJoi      = require('joi'),
	  sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
	type: 'string',
	base: joi.string(),
	messages: {
		'string.escapeHTML': '{{#label}} ne doit pas inclure HTML!'
	},
	rules: {
		escapeHTML: {
			validate(value, helpers) {
				const clean = sanitizeHtml(value, {
					allowedTags: [],
					allowedAttributes: {},
				});
				if (clean !== value) return helpers.error('string.escapeHTML', { value })
				return clean;
			}
		}
	}
});

const Joi = BaseJoi.extend(extension)

module.exports.voitureSchema = Joi.object({
	voiture: Joi.object({
		nom: Joi.string().required().escapeHTML(),
		prix: Joi.number().required().min(0),
		localisation: Joi.string().required().escapeHTML(),
		sommaire: Joi.string().required().escapeHTML()
	}).required(),
	destroyImg: Joi.array()
});

module.exports.critiqueSchema = Joi.object({
	critique: Joi.object({
		note: Joi.number().required().min(1).max(5),
		body: Joi.string().required().escapeHTML()
	}).required()
});