-- BAMAZON database --

DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
	id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
	department_name VARCHAR(255), 
    price DECIMAL (10,2),
    stock_quantity INT
);

INSERT INTO products (product_name, department_name, price, stock_quantity) 
	VALUES ("Bamazon Flame Stick", "Electronics", 29.99, 100),
    ("Nixon Watch", "Accessories", 199.95, 10),
    ("Sonos Soundbar", "Electronics", 153.47, 2),
    ("Beats Headphones", "Electronics", 99.99, 30),
    ("Moby Dick", "Books", 4.99, 100),
    ("StarCraft II", "Games", 29.99, 15),
    ("Garden Gnomes, pack of 81", "Home and Garden", 18.92, 0),
    ("Frozen Hamburger Meat Toy", "Toys", 15.95, 22),
    ("Kitten Chow", "Pets", 21.95, 11),
    ("18th Century Crossbow", "Sports", 195.95, 2)
    ;
    
SELECT * FROM products;