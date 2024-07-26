CREATE TABLE IF NOT EXISTS menu (
    dish_id SERIAL PRIMARY KEY,
    dish_name VARCHAR(255) NOT NULL,
    dish_price DECIMAL(10, 2) NOT NULL,
    dish_description TEXT NOT NULL
);