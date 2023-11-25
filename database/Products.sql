CREATE TABLE Products (
    productID INT AUTO_INCREMENT,
    name VARCHAR(50),
    description TEXT,
    price DECIMAL(10,2),
    categoryID INT,
    PRIMARY KEY(productID)
);
