const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
	res.render('users/register');
}

module.exports.register = async (req, res, next) => {
	try {
		const { courriel, username, password } = req.body;
		const user = await new User({ courriel, username });
		if(req.body.codeMembre === process.env.CODE_MEMBRE){
		user.isMembre = true;
			} else {
				req.flash('error', 'Veuillez envoyer un courriel à trev@superklok.com pour demander un code de membre afin de terminer votre inscription.');	
				return res.redirect('/register');
			}
		const registeredUser = await User.register(user, password);
		req.login(registeredUser, err => {
			if (err) return next(err);
			req.flash('success', 'Bienvenue sur Swingcars!');
			res.redirect('/voitures');
		});
	} catch (e) {
		req.flash('error', e.message);
		res.redirect('register');
	}
}

module.exports.renderLogin = (req, res) => {
	res.render('users/login');
}

module.exports.login = (req, res) => {
	req.flash('success', 'Ravi de vous revoir!');
	const redirectURL = req.session.returnTo || '/voitures';
	delete req.session.returnTo;
	res.redirect(redirectURL);
}

module.exports.logout = (req, res) => {
	req.logout();
	req.flash('success', 'Merci d\'avoir choisi Swingcars!');
	res.redirect('/voitures');
}