var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    bamazon();
});


function bamazon() {
    inquirer.prompt({
        name: "action",
        type: "rawlist",
        message: "What do you want to do?",
        choices: [
            "See Catalog",
            "Place Order"
        ]
    })
        .then(function (answer) {
            switch (answer.action) {
                case "See Catalog":
                    catalogSearch();
                    break;
            }
            switch (answer.action) {
                case "Place Order":
                    placeOrder();
                    break;
            }
        })
}

function catalogSearch() {
    var query = "SELECT * FROM products";
    connection.query(query, function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log("Item Id: " + res[i].item_id + " || Name: " + res[i].product_name + " || Price: " + res[i].price + " || ")
        }
        bamazon();
    })
}

function placeOrder() {
    inquirer
        .prompt([
            {
                name: "id_item",
                type: "input",
                message: "Type the id of the product you wish to buy"
            },
            {
                name: "quantity",
                type: "input",
                message: "How many do you want to buy?"

            }
        ])
        .then(function (answer) {
            var query = "SELECT stock_quantity, price, product_sales FROM products WHERE ?";
            connection.query(query, { item_id: answer.id_item }, function (err, res) {
                //console.log(res);
                if (answer.quantity > res[0].stock_quantity) {
                    console.log("I don't have enough inventory to fullfil your order");
                    bamazon();
                }
                else {
                    var new_inventory = res[0].stock_quantity - answer.quantity;
                    var price=res[0].price;
                    //console.log("your price is " + price);
                    var total=price*answer.quantity;
                    //console.log("Your total is " + total);
                    var productSales=res[0].product_sales+total;
                    //console.log("The new inventory is " + new_inventory);
                    var item = answer.id_item;
                    //console.log("The item to update is " + item);
                    completeOrder(new_inventory,item,total,productSales )


                }


            })
        })
};

function completeOrder(new_inventory, item,total,productSales) {
    var query = connection.query(
        "UPDATE products SET ?,? WHERE ?",
        [
            {
                stock_quantity: new_inventory
            },
            {
                product_sales:productSales
            },
            {
                item_id: item
            }
        ],
        function (err, res) {
            //console.log(res.affectedRows + " products updated!\n");
            console.log("Your order has shipped, your total is: $" + total.toFixed(2));
            bamazon();
        }
    );

}
