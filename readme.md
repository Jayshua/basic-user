# basic-user
A really super simple file-based user library with usernames/hased passwords/key-value pairs.

## Usage
```js
var User = require("basic-user");
var user = new User("Janeway");
user.setPassword("voyager", function(err, user) {
    user.save(function(err) {
        // ... Yeah!
    });
});
```

## Functions
### User Constructor
Creates a new user

`new User([username or props])`
- `username` - The new user's username
- `props`    - An object with the keys `username`, `password`, and `props` on it.


### getUser
Gets a user from the file system

`User.getUser(username, callback)`
- `username` - The username to lookup
- `callback` - A callback with the signature `function(err, user)`


### exists
Checks if a user exists on the file system

`User.exists(username)`
- `username` - The username to lookup


### setDirectory
Set the directory to look for user files in
(The directory defaults to ./users)

`User.setDirectory(dir)`
- `dir` - The directory to look for users in


## Methods
### setPassword
Sets the user's password

`myUser.setPassword(password, callback)`
- `password` - The password to set
- `callback` - A callback with the signature `function(err, user)`


### verifyPassword
Check the supplied password against the user's hash

`myUser.verifyPassword(password, callback)`
- `password` - The password to check against
- `callback` - A callback with the signature `function(err, isCorrect)` where `isCorrect` is a boolean.


### save
Save the user to the file system

`myUser.save(callback)`
- `callback` - A callback with the signature `function(err)`


### get
Gets the value of a user's property

`myUser.get(prop)`
- `prop` - The property to get


### set
Sets the value of a user's property

`myUser.set(prop, value)`
- `prop` - The property to set
- `value` - The value to set the property to
