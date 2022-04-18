CREATE DATABASE DemoDB;
GO
USE DemoDB;
GO
CREATE TABLE Orders
(
    order_id nvarchar(50) NOT NULL PRIMARY KEY,
    description nvarchar(255),
    status nvarchar(50),
    email nvarchar(255),
    created DATETIME DEFAULT(getdate()),
);
GO
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000001", "Sample Order 1", "in process", "max.mueller@test.com")
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000002", "Sample Order 2", "in process", "sandra.huber@tester.com" )
INSERT INTO Orders
    (order_id, description, status, email)
VALUES("10000003", "Sample Order 3", "created", "paulchen.panther@tester.com" )
GO
