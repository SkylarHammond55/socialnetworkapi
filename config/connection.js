const { connect, connection } = require('mongoose');

connect('mongodb+srv://root:6be2YLXiZrulQUSh@cluster0.ha6mlh6.mongodb.net/');

module.exports = connection;