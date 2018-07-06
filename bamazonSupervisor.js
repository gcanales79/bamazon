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
            "View Product Sales by Department",
            "Create New Department"
        ]
    })
        .then(function (answer) {
            switch (answer.action) {
                case "View Product Sales by Department":
                    productSales();
                    break;
            }
            switch (answer.action) {
                case "Create New Department":
                    createDepartment();
                    break;
            }
        })
};

function productSales() {
    var query = "SELECT departments.department_id, departments.department_name,departments.over_head_costs, sum(products.product_sales) as total_product_sales, sum(products.product_sales)-departments.over_head_costs as profit ";
    query+="FROM departments LEFT JOIN products ON (departments.department_name=products.department_name) ";
    query+="GROUP BY department_name ORDER BY department_id";
    connection.query(query, function (err, res) {
        console.table(res);
        //console.log(res);
        //console.log(err);
        bamazon();
    })
};

function createDepartment(){
    inquirer
        .prompt([
            {
                name: "department_name",
                type: "input",
                message: "What is the department name?"
            },
            {
                name: "over_head_costs",
                type: "input",
                message: "What are the over head costs?"

            }
            
        ])
        .then(function (answer) {
            var query = connection.query(
                "INSERT INTO departments (department_name, over_head_costs) VALUES ?",
                [[
                    [answer.department_name,answer.over_head_costs]
                  
                ]],
                function (err, res) {
                    if (err) throw err;
                    console.log("You have added " + answer.department_name + " with an over head cost of $" + answer.over_head_costs);
                    bamazon();
                }
            );

        })
};


