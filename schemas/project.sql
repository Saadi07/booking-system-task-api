CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id),
    user_id UUID NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING',
    session_id VARCHAR(255) NOT NULL,
    confirmed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO products (name, price)
VALUES 
    ('Wireless Mouse', 29.99),
    ('Mechanical Keyboard', 79.99),
    ('USB-C Hub', 49.99),
    ('27" 4K Monitor', 299.99),
    ('Bluetooth Headphones', 89.99)
ON CONFLICT DO NOTHING;
