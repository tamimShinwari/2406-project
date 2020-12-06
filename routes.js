const router = require("express").Router();
const DB = require('./DB');
const pug = require('pug');
const { ObjectID } = require("mongodb");

DB.init();

let usedTokens = [[0,0]];
function removeA(arr) {
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax = arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
}

router.get('/movies', async (req, res) => {
	let filter = {};

	for (var i in req.query) {
		switch (i) {
			case "genre":
				filter["Genre"] = {$regex : `.*${req.query[i]}.*`, $options: 'i'};
				break;

			case "title":
				filter["Title"] = {$regex : `.*${req.query[i]}.*`, $options: 'i'};
				break;

			case "year":
				filter["Year"] = req.query[i];
				break;

			case "actor":
				filter["Actors"] = {$regex : `.*${req.query[i]}.*`, $options: 'i'};
				break;

			case "director":
				filter["Director"] = {$regex : `.*${req.query[i]}.*`, $options: 'i'};
				break;
		
			default:
				break;
		}
	}

	res.send(await DB.getMovies(filter));
})

router.get('/users/:user?', async (req, res) => {
	let filter = {};

	for (var i in req.query) {
		switch (i) {
			case "name":
			case "username":
				filter["username"] = {$regex : `.*${req.query[i]}.*`, $options: 'i'};
				break;
		
			default:
				break;
		}
	}

	if (req.params.user) filter = { "userID": parseInt(req.params.user) };

	res.send(await DB.getUsers(filter));
})

router.post('/getMovie', async (req, res) => {
	if (!req.headers.movieid) return res.send({});
	let retMovie = await DB.getMovies({ "_id": ObjectID(req.headers.movieid) });
	res.send(retMovie[0]);
})

router.post('/createUser', async (req, res) => {
	if (!req.headers.username || !req.headers.password) return res.send([false, ""]);

	let userExists = await DB.checkUsername(req.headers.username);

	if (!userExists) {
		DB.createUser({
			"username": req.headers.username,
			"password": req.headers.password,
			"accountType": "normal",
			"moviesContributed": [],
			"followers": [],
			"following": []
		}).then( status => {
			if (status) {
				var token;
				while (true) {
					token = Math.floor(1e16 + Math.random() * 9e16);
					let breakloop = false;
					for (var i in usedTokens) {
						if (usedTokens[i][0] != token) {
							usedTokens.push([token, req.headers.username]);
							breakloop = true;
							break;
						}
					}
			
					if (breakloop) break;
				}
				return res.send([true, token]);
			}
			else res.send([false, ""]);
		});
	}
	else res.send([false, ""]);
})

router.post('/makeMovie', async (req, res) => {
	if (!req.headers.username || !req.headers.title || !req.headers.year || !req.headers.runtime || !req.headers.director || !req.headers.genre || !req.headers.actors || !req.headers.rated) return res.send(false);

	let isAllowed = await DB.checkContributer(req.headers.username);

	if (isAllowed) {
		DB.saveMovie(req.headers.username, {
			Title: req.headers.title,
			Year: req.headers.year,
			Runtime: req.headers.runtime,
			Director: req.headers.director,
			Genre: req.headers.genre,
			Actors: req.headers.actors,
			Rated: req.headers.rated,
			Poster: req.headers.poster,
			Contributer: req.headers.username
		}).then( status => {
			res.send(status)
		});

	}
	else res.send(false);
});

router.post('/deleteMovie', async (req, res) => {
	if (!req.headers.username || !req.headers.movieid || !req.headers.title) return res.send(false);

	let isAllowed = await DB.checkContributer(req.headers.username);

	if (isAllowed) {
		DB.removeMovie(req.headers.username, req.headers.movieid, req.headers.title)
		.then( status => {
			res.send(status)
		});
	}
	else res.send(false);
})

router.post('/startSession', (req, res) => {
	if (!req.headers.username || !req.headers.password) return res.send([false, ""]);

	DB.checkLogin(req.headers.username, req.headers.password)
	.then(function() {
		var token;
		while (true) {
			token = Math.floor(1e16 + Math.random() * 9e16);
			let breakloop = false;
			for (var i in usedTokens) {
				if (usedTokens[i][0] != token) {
					usedTokens.push([token, req.headers.username]);
					breakloop = true;
					break;
				}
			}

			if (breakloop) break;
		}

		res.send([true, token]);
	})
	.catch(function(e) {
		res.send([false, e]);
	})
})

router.post('/getSession', async (req, res) => {
	let sendJSON = [{}];

	if (!req.headers.token) return res.send(sendJSON);

	for (var i in usedTokens) {
		if (usedTokens[i][0] == req.headers.token) {
			sendJSON = await DB.getUsers({username: usedTokens[i][1]});
		}
	}

	res.send(sendJSON[0]);
})

router.post('/deleteSession', (req, res) => {
	if (!req.headers.token) return res.send(false);

	for (var i in usedTokens) {
		if (usedTokens[i][0] == req.headers.token) {
			usedTokens.splice(i, 1);
			return res.send(true);
		}
	}

	res.send(false);
})

router.post('/followUser', async (req, res) => {
	if (!req.headers.user1 || !req.headers.user2) return res.send(false);
	
	res.send(await DB.followUser(req.headers.user1, req.headers.user2));
})

router.post('/unfollowUser', async (req, res) => {
	if (!req.headers.user1 || !req.headers.user2) return res.send(false);

	res.send(await DB.unfollowUser(req.headers.user1, req.headers.user2));
})

router.get("/", (req, res) => { res.send(pug.renderFile(`${__dirname}/pages/login/index.pug`)) });

router.get("/login-style", (req, res) => { res.sendFile(`${__dirname}/pages/login/style.css`) })
router.get("/login-client", (req, res) => { res.sendFile(`${__dirname}/pages/login/client.js`) })

router.get("/home", async (req, res) => { res.send( pug.renderFile(`${__dirname}/pages/main/index.pug`, { genres: await DB.getGenres() }) ) });
router.get("/home-style", (req, res) => { res.sendFile(`${__dirname}/pages/main/style.css`) })
router.get("/home-client", (req, res) => { res.sendFile(`${__dirname}/pages/main/client.js`) })

router.get("/browse", (req, res) => { res.sendFile(`${__dirname}/pages/movies/index.html`) })
router.get("/browse-style", (req, res) => { res.sendFile(`${__dirname}/pages/movies/style.css`) })
router.get("/browse-client", (req, res) => { res.sendFile(`${__dirname}/pages/movies/client.js`) })

router.get("/profile", (req, res) => { res.sendFile(`${__dirname}/pages/user/profile.html`) })
router.get("/contribute", (req, res) => { res.sendFile(`${__dirname}/pages/user/contribute.html`) })

router.get("/user-style", (req, res) => { res.sendFile(`${__dirname}/pages/user/style.css`) })
router.get("/user-client", (req, res) => { res.sendFile(`${__dirname}/pages/user/client.js`) })
router.get("/user-client2", (req, res) => { res.sendFile(`${__dirname}/pages/user/user_client.js`) })
router.get("/user-client3", (req, res) => { res.sendFile(`${__dirname}/pages/user/contribute_client.js`) })
router.get("/user*", (req, res) => { res.sendFile(`${__dirname}/pages/user/user.html`) })

module.exports = router;