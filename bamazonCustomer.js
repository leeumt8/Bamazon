var Table = require("cli-table");
var mysql = require("mysql");
var inquirer = require("inquirer");

var products;

var connection = mysql.createConnection({
    host:"localhost",
    port:3306,
    user:"root",
    password:"William345!",
    database:"bamazon"
});

connection.connect(function(err){
    if(err) throw err;
    console.log("Connected as ID: " + connection.threadId);
    bamazonStart();
});

function bamazonStart() {
    //initial product query before customer decides what they're doing
    connection.query("SELECT item_id, product_name, price, stock_quantity FROM products", function (err, res) {
        if (err) throw err;
        products = res;
        //console.log(products);
        tableDisplay();
    })
    
    //function to create cli-table and display it
    function tableDisplay () {
        var table = new Table({
            head: ["Item ID", "Item Name", "Item Price", "Item Quantity"],
            colWidths: [10, 50, 15, 20]
        });
        for (i in products) {
            table.push(
                [products[i].item_id, products[i].product_name, products[i].price, products[i].stock_quantity]
            );
        }
        console.log(table.toString());
        customerChoice();
    }

    //function to initially prompt customer 
    function customerChoice () {
        inquirer.prompt([{
            name:"itemID",
            type:"input",
            message:"Please enter the ID associated with the item you would like to purchase."
        },
        {
            name:"itemQuantity",
            type:"input",
            message:"Please enter the quantity you would like to purchase."
        }]).then(function(itemInfo){
            var itemArrayID = itemInfo.itemID - 1;
            var itemID = itemInfo.itemID;
            var itemQuantity = itemInfo.itemQuantity;
            quantityCheck(itemArrayID, itemQuantity, itemID);
        })
    }

    //function to verify quantity of chosen item
    function quantityCheck(itemArrayID, itemQuantity) {
        // console.log(products);
        //console.log(itemArrayID);
        // console.log(products[itemArrayID]);
        if (itemArrayID in products && itemQuantity <= products[itemArrayID].stock_quantity) {
            var saleAmount = parseInt(products[itemArrayID].price * itemQuantity).toFixed(2);
            var qCheckItemID = itemArrayID + 1;
            var newItemQuantity = parseFloat(products[itemArrayID].stock_quantity - itemQuantity);

            console.log("That'll be " + saleAmount + '.');
            updateWarehouse(qCheckItemID, newItemQuantity, saleAmount);

        } else {
            console.log(`Sorry, we don't have that many left.`);
        }

    }

    function updateWarehouse(qCheckItemID, newItemQuantity, saleAmount, itemQuantity) {
        connection.query(`UPDATE products SET stock_quantity = ${newItemQuantity} WHERE item_id = ${qCheckItemID}`, function (err, result) {
            if (err) throw err;
            console.log(result.affectedRows + " items updated.");
        })

        connection.query(`SELECT * FROM products WHERE item_id = ${qCheckItemID}`, function (err, updatedItem) {
            if (err) throw err;
            console.log(`The quantity of ${updatedItem[0].product_name} is ${updatedItem[0].stock_quantity}.`);
            connection.end();
        })
    }
}
