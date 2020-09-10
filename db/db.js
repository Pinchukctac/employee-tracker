const mysql = require("mysql");

const connection = mysql.createConnection({
	host: "localhost",

	// Your port
	port: 3306,

	// Your username
	user: "root",

	// Your password
	password: "Reset4now!",
	database: "employee_tracker",
});

connection.connect(function(err) {
	if (err) throw err;
});

module.exports = connection;