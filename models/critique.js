const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const critiqueSchema = new Schema({
	body: String,
	note: Number,
	automobiliste: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	}
});

module.exports = mongoose.model("Critique", critiqueSchema);