CREATE TABLE OrderDetails (
    orderDetailID INT AUTO_INCREMENT,
    orderID INT,
    productID INT,
    quantity INT,
    PRIMARY KEY(orderDetailID),
    FOREIGN KEY (orderID) REFERENCES Orders(orderID)
);
