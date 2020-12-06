const { ObjectID } = require('mongodb');

const mc = require('mongodb').MongoClient;
var db;

exports.init = function () {
    mc.connect("mongodb://localhost:27017/", function (err, client) {
        if (err) throw err;
        console.log("Connected to database.");

        db = client.db("movie");
    });
}

exports.resetDB = function () {
    mc.connect("mongodb://localhost:27017/", function (err, client) {
        if (err) throw err;
        console.log("Connected to database.");

        let toDrop = client.db("movie");

        toDrop.dropDatabase(function (err, result) {
            if (err) throw err;
            console.log("DB dropped.");

            let newdb = client.db("movie");
            let data = require('./data/movie-data.json');
            let users = require('./data/users.json');

            newdb.collection("movies").insertMany(data, function (err, result) {
                if (err) throw err;
            })

            newdb.collection("users").insertMany(users, function (err, result) {
                if (err) throw err;
            })
        })
    });
}

exports.checkLogin = function (user, pass) {
    return new Promise(function (resolve, reject) {
        db.collection("users").findOne({"username": user}, function (err, result) {
            if (err) throw err;
            
            if (result) {
                if (result.password == pass) resolve();
                else reject("Invalid Password");
            }
            else reject("Invalid Username");
        });
    })
}

exports.checkContributer = function (user) {
    return new Promise(function (resolve, reject) {
        db.collection("users").findOne({"username": user}, function (err, result) {
            if (err) reject(false);
            
            if (result) {
                if (result.accountType == "contributer") resolve(true);
                else reject(false);
            }
            else reject(false);
        });
    })
}

exports.checkUsername = function (user) {
    return new Promise(function (resolve, reject) {
        db.collection("users").findOne({"username": user}, function (err, result) {
            if (err) reject(false);
            
            if (result) resolve(true);
            else resolve(false);
        });
    })
}

exports.getMovies = function (filter) {
    return new Promise(function (resolve, reject) {
        db.collection("movies").find(filter).toArray()
        .then(function (data) {
            resolve(data);
        });
    })
}

exports.getUsers = function (filter) {
    return new Promise(function (resolve, reject) {
        db.collection("users").find(filter).toArray()
        .then(function (data) {
            resolve(data);
        });
    })
}

exports.getGenres = function () {
    return new Promise(function (resolve, reject) {
        let res = [];
        db.collection("movies").find().toArray()
        .then(function (data) {
            for (var i in data) {
                let g = data[i].Genre.split(", ");
                for (var j in g) if (!res.includes(g[j]) && g[j] != "N/A") res.push(g[j]);
            }

            resolve(res);
        });
    })
}

exports.saveMovie = function (creator, movie) {
    return new Promise(function (resolve, reject) {
        db.collection("movies").insertOne(movie, function(err, res) {
            if (err) reject(false);
            db.collection("users").updateOne({username: creator}, { $push: { moviesContributed: [res.ops[0]._id, res.ops[0].Title] } }, function(err, res) {
                if (err) reject(false);
                resolve(true);
            });
        });
    })
}

exports.removeMovie = function (creator, movieID, movieTitle) {
    return new Promise(function (resolve, reject) {
        db.collection("movies").deleteOne( { "_id" : ObjectID(movieID) }, function(err, res) {
            if (err) reject(false);
            db.collection("users").updateOne({username: creator}, { $pull: { moviesContributed: [ObjectID(movieID), movieTitle] } }, function(err, res) {
                if (err) reject(false);
                resolve(true);
            });
        });
    })
}

exports.createUser = function (user) {
    return new Promise(function (resolve, reject) {
        db.collection("users").insertOne(user, function(err, res) {
            if (err) reject(false);
            resolve(true);
        });
    })
}

exports.followUser = function (user1, user2) {
    return new Promise(function (resolve, reject) {
        db.collection("users").updateOne({username: user1}, { $push: { following: [user2] } }, function(err, res) {
            if (err) reject(false);
            db.collection("users").updateOne({username: user2}, { $push: { followers: [user1] } }, function(err, res) {
                if (err) reject(false);
                resolve(true);
            });
        });
    })
}

exports.unfollowUser = function (user1, user2) {
    return new Promise(function (resolve, reject) {
        db.collection("users").updateOne({username: user1}, { $pull: { following: [user2] } }, function(err, res) {
            if (err) reject(false);
            db.collection("users").updateOne({username: user2}, { $pull: { followers: [user1] } }, function(err, res) {
                if (err) reject(false);
                resolve(true);
            });
        });
    })
}