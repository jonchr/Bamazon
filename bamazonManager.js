//SETUP
// ===========================================================

var mysql = require("mysql"); //node MySQL module
var inquirer = require("inquirer"); //node inquirer module 
var consoleTable = require("console.table"); //node console.table module for console logging prettily

var lowAmount = 500; //the threshold for items to appear on the low inventory report

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

//Asks what the manager would like to do
inquirer.prompt({

	type: "list",
	message: "What would you like to do?",
	choices: ["View Products for Sale", "View Low Inventory", "Add Quantity to Inventory", "Add New Product"],
	name: "choice"

}).then(function(response){

	//Executes the sections of the switch statement based on their response
	switch(response.choice) {

		// ===========================================================
		
		case "View Products for Sale":

			//Console logs the entire products table
			connection.query("SELECT * FROM products", function(err, res) {
				if (err) throw err;
				console.table(res);
				connection.end();
			});

			break;

		// ===========================================================

		case "View Low Inventory":

			//Console logs items with low quantities in inventory
			connection.query("SELECT * FROM products WHERE stock_quantity < " + lowAmount, function(err, res) {
				if (err) throw err;
				console.table(res);
				connection.end();
			});

			break;

		// ===========================================================

		case "Add Quantity to Inventory": //Update the quantity of an item on the table

			//Queries and builds an array of all items and their quantities, and then console logs them
			connection.query("SELECT * FROM products", function(err, res) {
    			if(err) throw err;	

			    //Creates an array that stores the quantities per item in the database, saving us the need for a second SELECT query
			    var items = [];

			    for (var key in res) { 
			      items[parseInt(res[key].item_id)] = {item_id: res[key].item_id, product_name: res[key].product_name, item_quantity: res[key].stock_quantity};
			    }

			    console.table(items);
			
				//Prompts for which item to add inventory for, and how many
				inquirer.prompt([{

					type: "input",
					message: "Log stock for which item?",
					name: "itemNum"

				}, {

					type: "input",
					message: "Add how many?",
					name: "shipmentAmount"

				}])
				.then(function(response){
					//Creates the query using the user's responses
					var itemNum = parseInt(response.itemNum);
					var shipmentAmount = parseInt(response.shipmentAmount);
					var newQuantity = items[itemNum].item_quantity + shipmentAmount;
					var myQuery = "UPDATE products SET stock_quantity=" + newQuantity + " WHERE item_ID=" + itemNum;
					
					//Runs the query to update the table
					connection.query(myQuery, function(err) {
						if(err) throw err;
						console.log("Quantity updated.");
						connection.end();
					});

				});
			});

			break;

		// ===========================================================

		case "Add New Product": //Add a new product row to the table

			//Prompts for product name, department, price, and quantity
			inquirer.prompt([{
				type: "input",
				message: "Enter product name.",
				name: "product_name"
			}, {
				type: "input",
				message: "Enter department name of product.",
				name: "department_name"
			}, {
				type: "input",
				message: "Enter product price.",
				name: "price"
			}, {
				type: "input",
				message: "Enter starting stock quantity.",
				name: "stock_quantity"
			}])
			.then(function(response){
				//Builds the values part of the query
				var values = "(NULL, '" + response.product_name + "', '" + response.department_name 
							+ "', " + response.price + ", " + response.stock_quantity + ",0)";
				//Runs the query to add the new row
				connection.query("INSERT INTO products VALUES " + values, function(err) {
					if(err) throw err;
				});
				console.log("Item added to registry.");
				connection.end();
			});

			break;

		// ===========================================================

		default: //Is it worth even having a default when there's no way to access it?

	}
	
});
