CREATE TABLE Reviews (
    reviewID INT AUTO_INCREMENT,
    productID INT,
    userID INT,
    rating INT,
    review TEXT,
    PRIMARY KEY(reviewID)
);
