//SETUP
// ===========================================================

var mysql = require("mysql"); //node MySQL module
var inquirer = require("inquirer"); //node inquirer module 

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

//Queries for all items in the table
connection.query("SELECT * FROM products", function(err, res) {
    if(err) throw err;

    //An array for storing the quantities of each item in the database, saving us the need for a second SELECT query
    var items = [];

    //Console logs each item in the table and adds its price and quantity to the array
    for (var key in res) {
      console.log(res[key].item_id + ": " + res[key].product_name + ", $" + res[key].price);  
      items[parseInt(res[key].item_id)] = {item_price: res[key].price, item_quantity: res[key].stock_quantity}; 
    }

    //Asks the user which item they want and how many they want to buy
	inquirer.prompt([{
		type: "input",
		message: "Enter the ID of the item you would like to purchase",
		name: "item"
	}, {
		type: "input",
		message: "How many would you like to buy?",
		name: "quantity"
	}])
	.then(function(purchase){
		var item = items[parseInt(purchase.item)];

		//If the quantity they want to buy is more than in the store, tells them they can't do that
		if(purchase.quantity > item.item_quantity) {
			console.log("Out of stock lah");
		}
		else {
			//Calculates the total cost to the customer
			var total = item.item_price * purchase.quantity;
			console.log("Thank you! That will be $" + total);

			//Updates the table with the new quantity for that item
			var newQuantity = item.item_quantity - purchase.quantity;
			var myQuery = "UPDATE products SET stock_quantity=" + newQuantity + " WHERE item_ID=" + parseInt(purchase.item);
			connection.query(myQuery, function(err){
				if (err) throw err;
			});
		}

		connection.end();
	});

});
