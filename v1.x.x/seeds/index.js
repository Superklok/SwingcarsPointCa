if (process.env.NODE_ENV !== "production") {
	require('dotenv').config();
}

const mongoose             = require('mongoose'),
	  { marques, types }   = require('./voitureNoms'),
	  { sommaires }        = require('./voitureSommaires'),
	  voitureLocalisations = require('./voitureLocalisations'),
	  voitureImg1          = require('./voitureImg1'),
	  voitureImg2          = require('./voitureImg2'),
	  Voiture              = require('../models/voiture');

// Base de données de production
// const urlBd = process.env.URL_BD;

// Base de données de développement
const urlBd = 'mongodb://localhost:27017/swingcarspointca';

mongoose.connect(urlBd, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "erreur de connexion:"));
db.once("open", () => {
	console.log("Base de données SwingcarsPointCa connectée");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
	await Voiture.deleteMany({});
	for (let i = 0; i < 400; i++) {
		const random14 = Math.floor(Math.random() * 14);
		const random30Img1 = Math.floor(Math.random() * 30);
		const random30Img2 = Math.floor(Math.random() * 30);
		const prix = Math.floor(Math.random() * 10) + 10;
		const voiture = new Voiture({

			// **automobiliste: 'ObjectId' (Dans le Shell MongoDB, lancez db.users.find() dès qu'un utilisateur a été créé.)**

			// Utilisateur de la base de données de production
			// automobiliste: '5ff6555fa257e617f82b3e12',

			// Utilisateur de la base de données de développement
			automobiliste: '5ff61a13ff51953d903366b2',
			
			nom: `${ sample(marques)} ${sample(types) }`,
			localisation: `${ voitureLocalisations[random14].ville }, ${ voitureLocalisations[random14].province }`,
			sommaire: `${ sample(sommaires) }`,
			prix,
			geometry: {
				type: 'Point',
				coordinates: [
					voitureLocalisations[random14].longitude,
					voitureLocalisations[random14].latitude
				]
			},
			images: [
				{
					url: `${ voitureImg1[random30Img1].url }`,
					filename: `${ voitureImg1[random30Img1].filename }`
				},
				{
					url: `${ voitureImg2[random30Img2].url }`,
					filename: `${ voitureImg2[random30Img2].filename }`
				}
			]
		})
		await voiture.save();
	}
}

seedDB().then(() => {
	mongoose.connection.close();
})