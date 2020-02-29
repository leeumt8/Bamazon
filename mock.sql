USE bamazon;

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES
("Push 2 Controller", "Electronics", 700.00, 2),
("XLR Cable", "Electronics", 25.00, 20),
("Klipsch 15M Speakers", "Electronics", 500.00, 5),
("Takis", "Food/Beverage", 2.50, 420),
("Pendleton Westerley", "Apparel", 200.00, 1),
("Nike Air Force 1 Carhartt WIP", "Apparel", 150.00, 3),
("Jupina", "Food/Beverage", 0.99, 300),
("GeForce GTX 1080TI", "Electronics", 750.00, 15),
("Adidas Slides", "Apparel", 50.00, 30),
("Bleach Anime Reboot", "Dreams", 1000000.00, 1)

SET SQL_SAFE_UPDATES=0;
UPDATE products SET product_sales = 0;