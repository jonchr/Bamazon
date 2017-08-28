var mysql = require("mysql");
var inquirer = require("inquirer");

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

//Console logs all the products in the table
connection.query("SELECT * FROM products", function(err, res) {
    if(err) throw err;

    //Creates an array that stores the quantities per item in the database, saving us the need for a second SELECT query
    var items = [];

    for (var key in res) {
      console.log(res[key].item_id + ": " + res[key].product_name + ", $" + res[key].price);  
      items[parseInt(res[key].item_id)] = {item_price: res[key].price, item_quantity: res[key].stock_quantity};
      
    }

	inquirer.prompt([{
		type: "input",
		message: "Enter the ID of the item you would like to purchase",
		name: "item"
	}, {
		type: "input",
		message: "How many would you like to buy?",
		name: "quantity"
	}]).then(function(purchase){
		var item = items[parseInt(purchase.item)];
		if(purchase.quantity > item.item_quantity) {
			console.log("Out of stock lah");
		}
		else {
			var total = item.item_price * purchase.quantity;
			console.log("Thank you! That will be $" + total);
			var newQuantity = item.item_quantity - purchase.quantity;
			var myQuery = "UPDATE products SET stock_quantity=" + newQuantity + " WHERE item_ID=" + parseInt(purchase.item);
			connection.query(myQuery, function(err, res){
				console.log("Table updated");
			});
		}
		process.exit();
	});

});
