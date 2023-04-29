CREATE TABLE transactions (
    id int NOT NULL AUTO_INCREMENT,
    title VARCHAR (255),
    transaction_description VARCHAR (255),
    amount NUMBER,
    PRIMARY KEY (ID)
);

INSERT INTO transactions(id, title, transaction_description, amount) VALUES
(1, 'A', 'D1', 123),
(2, 'B', 'D2', 456),
(3, 'C', 'D3', 789);