CREATE TABLE offers (
    offer_id UUID PRIMARY KEY,
    publication_id VARCHAR NOT NULL,
    user_id VARCHAR NOT NULL,
    price NUMERIC NOT NULL,
    time TIMESTAMP NOT NULL,
    CONSTRAINT offers_pub_user_time_unique UNIQUE (publication_id, user_id, time),
    CONSTRAINT offers_pub_price_unique UNIQUE (publication_id, price)
);

CREATE TABLE balance (
    user_id VARCHAR PRIMARY KEY,
    total NUMERIC NOT NULL,
    email VARCHAR NOT NULL,
    available NUMERIC NOT NULL,
    CONSTRAINT balance_total_available_check CHECK (total >= available),
    CONSTRAINT balance_email_unique UNIQUE (email),
    CONSTRAINT balance_total_positive_check CHECK (total >= 0),
    CONSTRAINT balance_available_positive_check CHECK (available >= 0)
);