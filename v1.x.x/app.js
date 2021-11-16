if (process.env.NODE_ENV !== "production") {
	require('dotenv').config();
}

const express        = require('express'),
	  path           = require('path'),
	  mongoose       = require('mongoose'),
	  ejsMate        = require('ejs-mate'),
	  session        = require('express-session'),
	  flash          = require('connect-flash'),
	  ExpressError   = require('./HELPeR/ExpressError'),
	  methodOverride = require('method-override'),
	  passport       = require('passport'),
	  LocalStrategy  = require('passport-local'),
	  User           = require('./models/user'),
	  helmet         = require('helmet'),
	  mongoSanitize  = require('express-mongo-sanitize'),
	  userRoutes     = require('./routes/users'),
	  voitureRoutes  = require('./routes/voitures'),
	  critiqueRoutes = require('./routes/critiques'),
	  MongoDBStore   = require('connect-mongo')(session);

// Base de données de production
const urlBd = process.env.URL_BD;

// Base de données de développement
// const urlBd = 'mongodb://localhost:27017/swingcarspointca';

mongoose.connect(urlBd, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
	useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "erreur de connexion:"));
db.once("open", () => {
	console.log("Base de données SwingcarsPointCa connectée");
});

const app = express();

app.engine('ejs', ejsMate);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());

const store = new MongoDBStore({
	url: urlBd,
	secret: process.env.SESSION_SECRET,
	touchAfter: 24 * 60 * 60
});

store.on('error', function (e) {
	console.log('Erreur de stockage de session', e);
});

const sessionConfig = {
	store,
	name: 'swingcars',
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		// secure: true,
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
		maxAge: 1000 * 60 * 60 * 24 * 7
	}
}

app.use(session(sessionConfig));
app.use(flash());
app.use(helmet());

const scriptSrcUrls = [
	"https://cdn.jsdelivr.net/",
	"https://api.tiles.mapbox.com/",
	"https://api.mapbox.com/",
	"https://code.jquery.com/",
];
const styleSrcUrls = [
	"https://cdn.jsdelivr.net/",
	"https://api.mapbox.com/",
	"https://api.tiles.mapbox.com/",
	"https://fonts.googleapis.com/",
];
const connectSrcUrls = [
	"https://api.mapbox.com/",
	"https://a.tiles.mapbox.com/",
	"https://b.tiles.mapbox.com/",
	"https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
	helmet.contentSecurityPolicy({
		directives: {
			defaultSrc: [],
			connectSrc: ["'self'", ...connectSrcUrls],
			scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
			styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
			workerSrc: ["'self'", "blob:"],
			objectSrc: [],
			imgSrc: [
				"'self'",
				"blob:",
				"data:",
				"https://res.cloudinary.com/superkloklabs/",
			],
			fontSrc: ["'self'", "fonts.gstatic.com", ...fontSrcUrls],
		},
	})
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
	if(!['/login', '/register', '/'].includes(req.originalUrl)) {
		req.session.returnTo = req.originalUrl;
	}
	res.locals.currentUser = req.user;
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
	next();
});

app.use('/', userRoutes);
app.use('/voitures', voitureRoutes);
app.use('/voitures/:id/critiques', critiqueRoutes);

app.get('/', (req, res) => {
	res.render('home');
});

app.all('*', (req, res, next) => {
	next(new ExpressError('Page introuvable', 404));
});

app.use((err, req, res, next) => {
	const {statusCode = 500} = err;
	if (!err.message) err.message = 'Oh non! Quelque chose a mal tourné!'
		res.status(statusCode).render('error', {err});
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Au service sur le port ${ port }`);
});