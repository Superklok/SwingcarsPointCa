const mongoose = require('mongoose');
const Critique = require('./critique');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const ImageSchema = new Schema({
	url: String,
	filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
	return this.url.replace('/upload', '/upload/w_200');
});

const opts = { toJSON: { virtuals: true } };

const VoitureSchema = new Schema({
	nom: String,
	images: [ImageSchema],
	geometry: {
		type: {
			type: String,
			enum: ['Point'],
			required: true
		},
		coordinates: {
			type: [Number],
			required: true
		}
	},
	prix: Number,
	sommaire: String,
	localisation: String,
	automobiliste: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	critiques: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Critique'
		}
	]
}, opts);

VoitureSchema.virtual('properties.clusterPopUp').get(function () {
	return `
	<strong><a href="/voitures/${ this._id }">${ this.nom }</a></strong>
	<p>${ this.sommaire.substring(0, 100) }...</p>`;
});

VoitureSchema.post('findOneAndDelete', async function (doc) {
	if (doc) {
		await Critique.deleteMany({
			_id: {
				$in: doc.critiques
			}
		})
	}
});

VoitureSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Voiture', VoitureSchema);