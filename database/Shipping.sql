CREATE TABLE Shipping (
    shippingID INT AUTO_INCREMENT,
    orderID INT,
    shippingDate DATETIME,
    status VARCHAR(50),
    PRIMARY KEY(shippingID)
);
