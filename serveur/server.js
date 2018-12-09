const express = require("express");
const { ObjectID } = require("mongodb");
const app = express();

// pour les formulaires multiparts
const multer = require("multer");
const multerData = multer();

const mongoDBModule = require("./app_modules/crud-mongo");

app.use(express.static("public"));

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept"
	);
	res.header(
		"Access-Control-Allow-Methods",
		"POST, GET, OPTIONS, PUT, DELETE"
	);

	next();
});

app.get("/", function(req, res) {
	res.sendFile(__dirname + "/public/index.html");
});

app.get("/api/restaurants", function(req, res) {
	let page = req.query.page || 0;
	let pagesize = req.query.pagesize || 10;
	let nom = req.query.nom || "";
	let cuisine = req.query.cuisine || "";

	mongoDBModule.findRestaurants(
		page,
		pagesize,
		nom,
		cuisine,
		(resultatDeLaRequete, count) => {
			let reponse = {
				msg: `get, page = ${page}, pagesize = ${pagesize}, nom = ${nom}, cuisine = ${cuisine}`,
				count: count,
				data: resultatDeLaRequete
			};
			res.send(JSON.stringify(reponse));
		}
	);
});

app.get("/api/restaurants/:id", function(req, res) {
	var id = req.params.id;

	mongoDBModule.findRestaurantById(id, resultats => {
		let reponse = { msg: "get, id = " + id, data: resultats };

		res.send(JSON.stringify(reponse));
	});
});

app.put("/api/restaurants/:id", multerData.fields([]), function(req, res) {
	let id = req.params.id;
	let nom = req.body.nom;
	let cuisine = req.body.cuisine;

	mongoDBModule.updateRestaurant(id, { nom, cuisine }, resultats => {
		let reponse = { msg: "put, id = " + id, data: resultats };

		res.send(JSON.stringify(reponse));
	});
});

app.post("/api/restaurants", multerData.fields([]), function(req, res) {
	console.log(req.body);
	let nom = req.body.nom;
	let cuisine = req.body.cuisine;

	mongoDBModule.insertRestaurant({ nom, cuisine }, callback => {
		let reponse = { msg: "post, name = " + nom, data: { nom, cuisine } };

		res.send(JSON.stringify(reponse));
	});
});

app.delete("/api/restaurants/:id", function(req, res) {
	let id = req.params.id;

	mongoDBModule.deleteRestaurant(id, nbRestaurantsSupprimes => {
		let reponse = {
			msg: "delete, id = " + id,
			data: nbRestaurantsSupprimes
		};

		res.send(JSON.stringify(reponse));
	});
});

var server = app.listen(8085, () => {
	console.log("Listening on port 8085");
});
