/************************
   Tests for basic-user
 ***********************/
var User = require("../index.js");
var assert = require("assert");
var async = require("async");
var fs = require("fs");


describe("User", function() {
   /* Test the setDirectory function */
   describe("#setDirectory()", function() {
      it("should set the user directory", function(done) {
         User.setDirectory("./test/users");

         // There's not really any way of testing this
         // We just load a user, so if getUser breaks both
         // this test and the getUser test will fail. Any ideas?
         User.getUser("alex", function(err) {
            assert.equal(err, null);
            done();
         });
      });
   });

   /* Test the User constructor */
   describe("#constructor", function () {
      it("should be an instanceof User", function() {
         var user = new User("jayshua");
         assert.equal(true, user instanceof User);
      });

      it("creation with options object", function() {
         var userWithProps    = new User({username: "Jayshua", password: "somepass", props: {foo: "bar"}});

         assert.equal(true, userWithProps instanceof User);
         assert.equal("bar", userWithProps.get("foo"));
      });

      it("creation without props object", function() {
         var userWithoutProps = new User({username: "Jayshua", password: "somepass"});
         assert.equal(false, typeof userWithoutProps.props === "undefined");
      });
   });

   /* Test the getUser method */
   describe("#getUser()", function() {
      it("should load a user", function(done) {
         User.getUser("alex", function(err, user) {
            assert.equal(err, null);
            assert.equal(user.username, "alex");
            assert.equal(user.password, "$2a$10$1ttLkRdmNNU/A2R.ldxbQOQw0DMIqWPUmM.mJWm0ZzMZbdigzR9UG");
            assert.equal(user.props.foo, "bar");
            done();
         });
      });
   });

   /* Test the exists method */
   describe("#exists()", function() {
      it("should return true for an existing user", function(done) {
         User.exists("alex", function(err, result) {
            assert.equal(err, null);
            assert.equal(result, true);
            done();
         });
      });

      it("should return false for a nonexistent user", function(done) {
         User.exists("nonexistentUser", function(err, result) {
            assert.equal(err, null);
            assert.equal(result, false);
            done();
         });
      })
   });

   /* Test the set method */
   describe("#set()", function() {
      it("should set a user property", function() {
         var user = new User("DarthVader");
         user.set("mask", "black");
         assert.equal(user.props.mask, "black");
      });
   });

   /* Test the get method */
   describe("#get()", function() {
      it("should get a user property", function() {
         var user = new User({props: {"deathStar": "big"}});
         assert.equal(user.get("deathStar"), "big");
      });
   });

   /* Test the setPassword method */
   describe("#setPassword()", function() {
      it("should set the users password", function(done) {
         var user = new User("honorHarrington");

         user.setPassword("tankersley", function(err, callback) {
            assert.notEqual(typeof user.password, "undefined");
            done();
         });
      });
   });

   /* Test the verify password method */
   describe("#verifyPassword()", function() {
      it("should return true if password is correct", function(done) {
         User.getUser("alex", function(err, user) {
            user.verifyPassword("theGreat", function(err, passwordIsCorrect) {
               assert.equal(passwordIsCorrect, true);
               done();
            });
         });
      });

      it("should return false if password is incorrect", function(done) {
         User.getUser("alex", function(err, user) {
            user.verifyPassword("dontGoToThatParty", function(err, passwordIsCorrect) {
               assert.equal(passwordIsCorrect, false);
               done();
            });
         });
      });
   });

   /* Test the toJSON method */
   describe("#toJSON()", function() {
      it("should return a correct json representation", function() {
         var user = new User("andrew");
         user.password = "ender";
         user.props.sister = "valentine";

         var json = user.toJSON();
         var correctJson = '{"username":"andrew","password":"ender","props":{"sister":"valentine"}}'
 
         assert.equal(json, correctJson);
      });
   });

   /* Test the save method */
   describe("#save", function() {
      it("should save the user to disc", function(done) {
         var user = new User("selden");
         user.password = "trantorSecondFoundation";
         user.set("friend", "Daneel Olivaw");
         
         user.save(function(err) {
            assert.equal(err, null);

            var data = fs.readFileSync("./test/users/selden.json", "utf8");
            var correctFile = '{"username":"selden","password":"trantorSecondFoundation","props":{"friend":"Daneel Olivaw"}}';

            assert.equal(data, correctFile);
            done();
         });
      });

      // Cleanup saved file
      after(function(done) {
         fs.unlink("./test/users/selden.json", done);
      });
   });
});