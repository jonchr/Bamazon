//SETUP
// ===========================================================

var mysql = require("mysql"); //node MySQL module
var inquirer = require("inquirer"); //node inquirer module
var consoleTable = require("console.table"); //node console.table module for console logging prettily

//Sets up connection to MySQL table
var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "",
	database: "Bamazon"
});

//Initiates Connection
connection.connect(function(err){
	if (err) throw err;
});

// HUMAN INTERACTION CODE
// ===========================================================

//Asks what the supervisor would like to do

inquirer.prompt({

	type: "list",
	message: "What would you like to do?",
	choices: ["View Product Sales by Department", "Create New Department"],
	name: "choice"

}).then(function(response) {

	//Executes the sections of the switch statement based on their response
	switch (response.choice) {

		// ===========================================================
		//Allows a supervisor a view of all the departments and their financial performance
		case "View Product Sales by Department":

			//Constructs query that with calculations and joins for the manager view
			var myQuery = "SELECT D.*, IFNULL(ROUND(SUM(P.product_sales),2),0) AS total_sales, " 
						+ "IFNULL(ROUND(SUM(P.product_sales) - D.overhead_costs,2),0) AS total_profit "
						+ "FROM departments D LEFT JOIN products P ON D.department_name=P.department_name "
						+ "GROUP BY D.department_ID";
			//Queries and then logs the table
			connection.query(myQuery, function(err, res) {
				if (err) throw err;
				console.table(res);
				connection.end();
			});

			break;

		// ===========================================================

		//Allows a supervisor to add a new department
		case "Create New Department": /

			// Prompts for department name and overhead costs
			inquirer.prompt([{
				type: "input",
				message: "Enter department name.",
				name: "dept_name"
			}, {
				type: "input",
				message: "Enter expected department overhead costs.",
				name: "dept_overhead"
			}])
			.then(function(response){
				//Builds the values part of the query
				var values = "(NULL, '" + response.dept_name + "', " + response.dept_overhead  + ")";
				
				//Runs the query to add the new row
				connection.query("INSERT INTO departments VALUES " + values, function(err) {
					if(err) throw err;
				});

				console.log("Department added to register.");
				connection.end();
			});

			connection.end();

			break;

		// ===========================================================

		default: //Is it worth even having a default when there's no way to access it?
	}
});