
CREATE DATABASE project_x;
USE project_x;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE goals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    target_amount DECIMAL(10, 2) NOT NULL,
    current_amount DECIMAL(10, 2) DEFAULT 0,
    description VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    goal_id INT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    description TEXT,
    is_flagged BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (goal_id) REFERENCES goals(id)
);
USE project_x;

-- Insert sample users (password: password123)
INSERT INTO users (username, password) VALUES
('testuser', '$2b$10$3f6Qz3X4z7v8m9n0p2r3s4t5u6v7w8x9y0z1a2b3c4d5e6f7g8h9i0'),
('jane', '$2b$10$4g5Qz3X4z7v8m9n0p2r3s4t5u6v7w8x9y0z1a2b3c4d5e6f7g8h9i1');

-- Insert sample goals
INSERT INTO goals (user_id, target_amount, current_amount, description) VALUES
(1, 1000.00, 300.00, 'New Laptop'),
(1, 500.00, 100.00, 'Vacation Fund'),
(2, 2000.00, 0.00, 'Car Down Payment');

-- Insert sample transactions
INSERT INTO transactions (user_id, goal_id, amount, category, date, description, is_flagged) VALUES
(1, 1, 200.00, 'Salary', '2025-07-01', 'Monthly salary', FALSE),
(1, NULL, -50.00, 'Gambling', '2025-07-02', 'Casino night', TRUE),
(1, 1, 100.00, 'Freelance', '2025-07-03', 'Side project', FALSE),
(1, 2, 100.00, 'Bonus', '2025-07-04', 'Year-end bonus', FALSE),
(2, NULL, -75.00, 'Groceries', '2025-07-01', 'Weekly shopping', FALSE);