var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require('console.table');

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
            "View Products for Sale",
            "View Low Inventory",
            "Add to Inventory",
            "Add New Product"
        ]
    })
        .then(function (answer) {
            switch (answer.action) {
                case "View Products for Sale":
                    catalogSearch();
                    break;
            }
            switch (answer.action) {
                case "View Low Inventory":
                    lowInventory();
                    break;
            }
            switch (answer.action) {
                case "Add to Inventory":
                    addInventory();
                    break;
            }
            switch (answer.action) {
                case "Add New Product":
                    addProduct();
                    break;
            }
        })
}

function catalogSearch() {
    var query = "SELECT item_id,product_name,price,stock_quantity FROM products";
    connection.query(query, function (err, res) {
        /*for (var i = 0; i < res.length; i++) {
            console.log("Item Id: " + res[i].item_id + " || Name: " + res[i].product_name + " || Price: " + res[i].price + " || ")
        }*/
        console.table(res);
        bamazon();
    })
}

function lowInventory() {
    var query = "SELECT * FROM products WHERE stock_quantity between 0 and  5";
    connection.query(query, function (err, res) {
        /*for (var i = 0; i < res.length; i++) {
            console.log("Item Id: " + res[i].item_id + " || Name: " + res[i].product_name + " || Price: " + res[i].price + " || ")
        }*/
        console.table(res);
        bamazon();
    })
}

function addInventory() {
    inquirer
        .prompt([
            {
                name: "id_item",
                type: "input",
                message: "Type the id of the product you want to add inventory"
            },
            {
                name: "quantity",
                type: "input",
                message: "How many you want to add?"

            }
        ])
        .then(function (answer) {
            var query = "SELECT stock_quantity,product_name FROM products WHERE ?";
            connection.query(query, { item_id: answer.id_item }, function (err, res) {
                var newInventory = res[0].stock_quantity + parseInt(answer.quantity);
                console.log("El nuevo inventario es " + newInventory)
                var item = answer.id_item
                var product_name = res[0].product_name
                console.log("El item es " + item)
                add(item, newInventory, product_name)

            })

        })
};

function add(item, newInventory, product_name) {
    var query = connection.query("UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: newInventory
            },
            {
                item_id: item
            }
        ],
        function (err, res) {
            //console.log(res.affectedRows + "products updated!\n");
            //console.log(err);
            console.log("You now have " + newInventory + " " + product_name);
            bamazon();
        }
    );
};

function addProduct() {
    inquirer
        .prompt([
            {
                name: "product_name",
                type: "input",
                message: "What is the product name?"
            },
            {
                name: "department_name",
                type: "input",
                message: "In what department it belongs?"

            },
            {
                name: "price",
                type: "input",
                message: "What is the price?"

            },
            {
                name: "stock_quantity",
                type: "input",
                message: "How many will go in inventory?"

            }

        ])
        .then(function (answer) {
            var query = connection.query(
                "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ?",
                [[
                    [answer.product_name,answer.department_name,answer.price,answer.stock_quantity]
                  
                ]],
                function (err, res) {
                    if (err) throw err;
                    console.log("You have added " + answer.product_name + " to the department of " + answer.department_name
                    + " with a price of $" + answer.price + " with an inventory of " +answer.stock_quantity);
                    bamazon();
                }
            );

        })
};