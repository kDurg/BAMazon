var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    mainSelectionPage();
});

function mainSelectionPage() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        inquirer //Not working on my computer???
            .prompt({
                name: "selectionScreen",
                type: "rawlist",
                message: "Welcome to BAMazon, What Would You Like To Do Today?",
                choices: [
                    "View All Products",
                    "Purchase Items",
                    "Leave BAMazon"
                ]
            }).then(function (answer) {
                switch (answer.action) {
                    case "View All Products":
                        viewProducts();
                        break;
                    case "Purchase Items":
                        purchaseProducts();
                        break;
                    case "Leave BAMazon":
                        leaveBamazon();
                        break;
                }
            });
        // var userInput = process.argv[2];
        // console.log("\n\n\n\n\nWelcome to BAMazon, What Would You Like To Do Today?\n")
        // console.log("Please type: Inventory, Buy or Exit");
        // console.log("=============================================================================================\n\n");
        // if (userInput === "inventory") {
        //     viewProducts();
        // } else if (userInput === "buy") {
        //     purchaseProducts();
        // } else if (userInput === "exit") {
        //     leaveBamazon();
        // } else {console.log("please select from the following commands: Inventory, Buy or Exit");}
    });
}

function viewProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log("\n=============================================================================================\nCurrent Inventory\n____________________________________________________________________\n");
        for (var i = 0; i < res.length; i++) {
            console.log(`ID: ${res[i].id} | NAME: ${res[i].product_name} | DEPARTMENT: ${res[i].department_name} | PRICE: ${res[i].price} | REMAING: ${res[i].stock_quantity}`);
        }
        console.log("\n=============================================================================================\nCurrent Inventory\n____________________________________________________________________\n");
        inquirer.prompt({
            name: "buyProductYesNo",
            type: "rawlist",
            message: "Would you like to buy an item?",
            choices: ["YES", "... Nah... "]
        }).then(function (answer) {
            switch (answer.action) {
                case "YES":
                    purchaseProducts()
                    break;
                case "... Nah...":
                    mainSelectionPage()
                    break;
            }
        })

    });
}

function purchaseProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log("\n=============================================================================================\nCurrent Inventory\n____________________________________________________________________\n");
        for (var i = 0; i < res.length; i++) {
            console.log(`ID: ${res[i].id} | NAME: ${res[i].product_name} | DEPARTMENT: ${res[i].department_name} | PRICE: ${res[i].price} | REMAING: ${res[i].stock_quantity}`);
        }
        console.log("\n=======================================================\nCurrent Inventory\n____________________________________________________________________\n");
        console.log("\nWhat would you like to buy?\n\n")
        inquirer.prompt({
            name: "purchaseWhichItem",
            type: "input",
            message: "Select a product by its ID number",
        }).then(function (answer) {
            var quantity = parseInt(answer.input);
            var bamazonStock = parseInt(res[i].stock_quantity)
            if (bamazonStock >= quantity) {
                console.log(`\n\n\nYou bought ${quantity} x ${res[i].product_name}. Thank you! \n\nWhat would you like to do now?\n`);
                function updateProductQuantity () {
                    console.log(`...Updating BAMazon Quantities...`);
                    var updatedQuantity = bamazonStock - quantity;  
                    var query = connection.query ( "UPDATE products SET ? WHERE ?") [
                        {quantity: updatedQuantity },
                        {product : res[i].product_name}
                    ]
                }
                
                inquirer.prompt({
                    name: "buyMoreorGoHome",
                    type: "rawlist",
                    message: "Would you like to buy more products?",
                    choices: ["YES I NEED TO BUY MORE!!!!", "...Nah..."
                    ]
                }).then(function (choice) {
                    switch (choice.action) {
                        case "YES I NEED TO BUY MORE!!!!":
                            purchaseProducts()
                            break;
                        case "...Nah...":
                            mainSelectionPage()
                            break;
                    }
                });

            } else {
                console.log("Whoh, hold your horses, you seem like a horder. There isn't enough in inventory for your order!\n\n\n");
                inquirer.prompt({
                    name: "tryAgainorGoHome",
                    type: "rawlist",
                    message: "Would you like to try to buy less or buy something else?",
                    choices: ["Let me try again", "I want to leave"
                    ]
                }).then(function (choice) {
                    switch (choice.action) {
                        case "Let me try again":
                            purchaseProducts()
                            break;
                        case "I want to leave":
                            mainSelectionPage()
                            break;
                    }
                });
            }
        })
    });
}

function leaveBamazon () {
    console.log("\n\n\nThank you for shopping at BAMazon, goodbye!\n\n\n\n");
    connection.end();
}