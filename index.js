/***************************************************************
  User
  ====
  A very basic user api that saves user data to the file system
***************************************************************/
var fs = require("fs");
var path = require("path");
var bcrypt = require("bcrypt-nodejs");


/************************/
/* Globals 
/************************/
var DIR = "./users"; // The user files directory (this may change with User.setDirectory)


/************************/
/* Functions
/************************/
/* Resolve a username to a filepath */
var getPath = function(username) {
    return path.resolve(DIR, username + ".json");
};


/************************/
/* User Object
/************************/
/* Create a new user object */
var User = function(propsOrUsername) {
    if (typeof propsOrUsername === "string") {
        this.username = propsOrUsername;
        this.props = {};
    } else {
        for (var key in propsOrUsername) {
            if (Object.prototype.hasOwnProperty.call(propsOrUsername, key)) {
                this[key] = propsOrUsername[key];
            }
        }

        this.props = this.props || {};
    }
};


/************************/
/* User Object Functions
/************************/
/* Get a user by username */
User.getUser = function(username, callback) {
    fs.readFile(getPath(username), (err, result) => {
        if (err && err.code === "ENOENT") {
            var error = new Error("No user");
            error.code = "USERNOTFOUND";
            callback(error);
            return;
        } else if (err) {
            callback(err);
            return;
        }

        callback(null, new User(JSON.parse(result)));
    });
};

/* Check if user exists (Predicate) */
User.exists = function(username, callback) {
    fs.stat(getPath(username), (err, stats) => {
        if (err || !stats.isFile()) {
            callback(null, false);
        } else {
            callback(null, true);
        }
    });
};

/* Set the users directory */
User.setDirectory = function(directory) {
    DIR = directory;
};


/************************/
/* User Object Methods
/************************/
/* Set a user property */
User.prototype.set = function(prop, value) {
    this.props[prop] = value;
};

/* Get a user property */
User.prototype.get = function(prop) {
    return this.props[prop];
};

/* Set the user's password */
User.prototype.setPassword = function(password, callback) {
    callback = callback || () => {};

    bcrypt.genSalt(100, (err, salt) => {
        if (err) {
            callback(err);
            return;
        }

        bcrypt.hash(password, salt, null, (err, hash) => {
            if (err) {
                callback(err);
                return;
            }

            this.password = hash;
            callback(null, this);
        });
    });
};

/* Verify the user's password */
User.prototype.verifyPassword = function(password, callback) {
    bcrypt.compare(password, this.password, callback);
};

/* Convert the user object to JSON */
User.prototype.toJSON = function() {
    return JSON.stringify({
        username: this.username,
        password: this.password,
        props:    this.props
    });
};

/* Save the user to the file system */
User.prototype.save = function(callback) {
    fs.writeFile(getPath(this.username), this.toJSON(), callback);
};


module.exports = User;