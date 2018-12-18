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
        inquirer
            .prompt({
                name: "selectionScreen",
                type: "list",
                message: "Welcome to BAMazon, What Would You Like To Do Today?",
                choices: [
                    "View All Products",
                    "Purchase Items",
                    "Leave BAMazon"
                ]
            }).then(function (answer) {
                console.log(answer);
                switch (answer.selectionScreen) {
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
    });
}

function viewProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log("\n=============================================================================================\nCurrent Inventory\n____________________________________________________________________\n");
        for (var i = 0; i < res.length; i++) {
            console.log(`ID: ${res[i].id} | NAME: ${res[i].product_name} | DEPARTMENT: ${res[i].department_name} | PRICE: ${res[i].price} | REMAING: ${res[i].stock_quantity}`);
        }
        console.log("\n=============================================================================================\nView Inventory \n____________________________________________________________________\n");
        inquirer.prompt({
            name: "buyProductYesNo",
            type: "list",
            message: "Would you like to buy an item?",
            choices: ["YES", "... Nah..."]
        }).then(function (answer) {
            console.log(answer);
            switch (answer.buyProductYesNo) {
                case "YES":
                    purchaseProducts();
                    break;
                case "... Nah...":
                    mainSelectionPage();
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
        console.log("\n=============================================================================================\nPURCHASE SCREEN\n____________________________________________________________________\n");
        console.log("\nWhat would you like to buy?\n\n")
        inquirer.prompt([{
            name: "purchaseWhichItem",
            type: "input",
            message: "Select a product by its ID number",
        }, {
            name: "howManyUnits",
            type: "input",
            message: "How many would you like to purchase?"
        }]).then(function (answer) {
            var itemNumber = parseInt(answer.purchaseWhichItem);
            connection.query("SELECT * FROM products WHERE id = ?", [itemNumber], function (err, res) {
                if (err) throw err;
                if (res[0].stock_quantity >= answer.howManyUnits) { //need to pull object by id, compare number?
                    console.log(`\n\n\nYou bought ${answer.howManyUnits} x ${res[0].product_name}. Thank you! \n\nWhat would you like to do now?\n`);
                    updateProductQuantity();
                } else {
                    console.log("Whoh, hold your horses, you seem like a horder. There isn't enough in inventory for your order!\n\n\n");
                    inquirer.prompt({
                        name: "tryAgainorGoHome",
                        type: "list",
                        message: "Would you like to try to buy less or buy something else?",
                        choices: ["Let me try again", "I want to leave"
                        ]
                    }).then(function (choice) {
                        switch (choice.tryAgainorGoHome) {
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
        })
    });
}

function leaveBamazon() {
    console.log("\n\n\nThank you for shopping at BAMazon, goodbye!\n\n\n\n");
    connection.end();
}

function updatingScreen() {
    console.log(`...Updating BAMazon Quantities...`);
    console.log(`.`);
    console.log(`...`);
    console.log(`....`);
    console.log(`.....`);
    console.log(`......`);
    console.log(`.......`);
    console.log(`......`);
    console.log(`.....`);
    console.log(`....`);
    console.log(`...`);
    console.log(`..`);
    console.log(`.`);
    console.log(`.`);
    console.log(`...`);
    console.log(`....`);
    console.log(`.....`);
    console.log(`......`);
    console.log(`.......`);
    console.log(`......`);
    console.log(`.....`);
    console.log(`....`);
    console.log(`...`);
    console.log(`..`);
    console.log(`.\n\n`);
}

function updateProductQuantity() {
    updatingScreen();
    morePurchase();

    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        for (var i = 0; i < res.length; i++) {
            var updateProductQuantity = res[0].stock_quantity - answer.howManyUnits;
            console.log(`local quantity: ${updateProductQuantity}`);
        //update is not updating database???
            connection.query("UPDATE products SET ? WHERE ?"[{stock_quantity: 400}, {id: itemNumber}]), 
                function(err,res) {
                    if (err) throw err;
                    console.log(`updated quantity: ${res[0].stock_quantity} | for id: ${res[0].id} | for product: ${res[0].product_name}\n\n\n\n\n\n\n`);   
                };
            }
        }, 
    )
}   
    // quantities remain the same???
    // kicks me out before the next prompt can return us to buy more or back to the homescreen


function morePurchase(){
    inquirer.prompt({
        name: "buyMoreorGoHome",
        type: "list",
        message: "Would you like to buy more products?\n\n\n",
        choices: ["YES I NEED TO BUY MORE!!!!", "...Nah..."]
    }).then(function (choice) {
        switch (choice.buyMoreorGoHome) {
            case "YES I NEED TO BUY MORE!!!!":
                purchaseProducts()
                break;
            case "...Nah...":
                mainSelectionPage()
                break;
        }
    });
}