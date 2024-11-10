CREATE TABLE IF NOT EXISTS balance (
    user_id VARCHAR PRIMARY KEY,
    total NUMERIC NOT NULL,
    email VARCHAR NOT NULL,
    available NUMERIC NOT NULL,
    CONSTRAINT balance_total_available_check CHECK (total >= available),
    CONSTRAINT balance_email_unique UNIQUE (email),
    CONSTRAINT balance_total_positive_check CHECK (total >= 0),
    CONSTRAINT balance_available_positive_check CHECK (available >= 0)
);

CREATE TABLE IF NOT EXISTS offers (
    offer_id UUID PRIMARY KEY,
    publication_id VARCHAR NOT NULL,
    user_id VARCHAR NOT NULL,
    price NUMERIC NOT NULL,
    time TIMESTAMP NOT NULL,
    CONSTRAINT offers_pub_user_time_unique UNIQUE (publication_id, user_id, time),
    CONSTRAINT offers_pub_price_unique UNIQUE (publication_id, price),
    CONSTRAINT offers_user_id_fk FOREIGN KEY (user_id) REFERENCES balance (user_id),
    CONSTRAINT offers_price_positive_check CHECK (price > 0)
);

CREATE TABLE IF NOT EXISTS closed_auctions (
    publication_id VARCHAR PRIMARY KEY,
    user_id VARCHAR NULL,
    price NUMERIC NULL,
    time TIMESTAMP NULL,
    close_time TIMESTAMP NOT NULL,
    CONSTRAINT closed_auctions_user_id_fk FOREIGN KEY (user_id) REFERENCES balance (user_id),
    CONSTRAINT closed_auctions_price_positive_check CHECK (price > 0)
);