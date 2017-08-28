var mysql = require("mysql");
var inquirer = require("inquirer");
var consoleTable = require("console.table");

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "",
	database: "Bamazon"
});

connection.connect(function(err){
	if (err) throw err;
});

inquirer.prompt({

	type: "list",
	message: "What would you like to do?",
	choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
	name: "choice"

}).then(function(response){

	switch(response.choice) {

		case "View Products for Sale":

			connection.query("SELECT * FROM products", function(err, res) {
				if (err) throw err;
				console.table(res);
				connection.end();
			});

			break;

		case "View Low Inventory":

			connection.query("SELECT * FROM products WHERE stock_quantity < 500", function(err, res) {
				if (err) throw err;
				console.table(res);
				connection.end();
			});

			break;

		case "Add to Inventory":

			connection.query("SELECT * FROM products", function(err, res) {
    			if(err) throw err;	

			    //Creates an array that stores the quantities per item in the database, saving us the need for a second SELECT query
			    var items = [];

			    for (var key in res) { 
			      items[parseInt(res[key].item_id)] = {item_id: res[key].item_id, product_name: res[key].product_name, item_quantity: res[key].stock_quantity};
			    }

			    console.table(items);
			
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
					var itemNum = parseInt(response.itemNum);
					var shipmentAmount = parseInt(response.shipmentAmount);
					var newQuantity = items[itemNum].item_quantity + shipmentAmount;
					var myQuery = "UPDATE products SET stock_quantity=" + newQuantity + " WHERE item_ID=" + itemNum;
					
					connection.query(myQuery, function(err) {
						if(err) throw err;
						console.log("Quantity updated.");
						connection.end();
					});

				});
			});

			break;

		case "Add New Product":

			connection.query("DESCRIBE products", function(err, res) {

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
					var values = "(NULL, '" + response.product_name + "', '" + response.department_name 
								+ "', " + response.price + ", " + response.stock_quantity + ")"
					connection.query("INSERT INTO products VALUES " + values, function(err) {
						if(err) throw err;
					});
					console.log("Item added to registry.");
					connection.end();
				});
			});		

			break;

		default:

	}
	
});
