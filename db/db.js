const mysql = require("mysql");

const connection = mysql.createConnection({
	host: "localhost",

	// Your port
	port: 8080,

	// Your username
	user: "admin",

	// Your password
	password: "admin",
	database: "employee_tracker",
});

connection.connect(function(err) {
	if (err) throw err;
});

module.exports = connection;