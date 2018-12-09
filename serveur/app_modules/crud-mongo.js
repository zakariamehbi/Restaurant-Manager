var MongoClient = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectId;

// Connection URL
const url = "mongodb://localhost:27017";

// Database Name
const dbName = "test";

exports.countRestaurants = function(callback) {
	MongoClient.connect(
		url,
		(err, client) => {
			var db = client.db(dbName);
			db.collection("restaurants")
				.count()
				.then(count => {
					callback(res);
				});
		}
	);
};

exports.findRestaurants = function(page, pagesize, nom, cuisine, callback) {
	MongoClient.connect(
		url,
		(err, client) => {
			if (!err) {
				let query = {};
				if (nom != "") {
					query = {
						name: {
							$regex: ".*" + nom + ".*",
							$options: "i"
						}
					};
				}

				var db = client.db(dbName);

				db.collection("restaurants")
					.find(query)
					.limit(parseInt(pagesize))
					.skip(parseInt(page * pagesize))
					.toArray()
					.then(resultats => {
						db.collection("restaurants")
							.find(query)
							.count()
							.then(count => {
								callback(resultats, count);
							});
					});
			} else {
				callback(-1);
			}
		}
	);
};

exports.findRestaurantById = function(id, callback) {
	MongoClient.connect(
		url,
		(err, client) => {
			if (!err) {
				var db = client.db(dbName);

				db.collection("restaurants")
					.find({ _id: ObjectId(id) })
					.toArray()
					.then(resultats => {
						callback(resultats);
					});
			} else {
				callback(-1);
			}
		}
	);
};

exports.deleteRestaurant = function(id, callback) {
	MongoClient.connect(
		url,
		(err, client) => {
			if (!err) {
				client
					.db(dbName)
					.collection("restaurants")
					.deleteOne({ _id: ObjectId(id) })
					.then(resultats => {
						callback(resultats.deletedCount);
					})
					.catch(err => {
						callback(-1);
					});
			}
		}
	);
};

exports.insertRestaurant = function(data, callback) {
	MongoClient.connect(
		url,
		(err, client) => {
			if (!err) {
				client
					.db(dbName)
					.collection("restaurants")
					.insert({ name: data.nom, cuisine: data.cuisine })
					.then(resultats => {
						callback(data);
					})
					.catch(err => {
						callback(-1);
					});
			}
		}
	);
};

exports.updateRestaurant = function(id, data, callback) {
	MongoClient.connect(
		url,
		(err, client) => {
			if (!err) {
				client
					.db(dbName)
					.collection("restaurants")
					.update(
						{ _id: ObjectId(id) },
						{ $set: { name: data.nom, cuisine: data.cuisine } }
					)
					.then(resultats => {
						callback(resultats);
					})
					.catch(err => {
						callback(-1);
					});
			}
		}
	);
};
