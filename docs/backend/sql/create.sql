-- 创建category表
CREATE TABLE category (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    _at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建products表
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    category_id INTEGER REFERENCES category(id) ON DELETE SET NULL,
    price DECIMAL(10, 2) CHECK (price >= 0),
    _at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);