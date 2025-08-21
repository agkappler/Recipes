
CREATE TABLE IF NOT EXISTS bounty_categories
(
    category_id SERIAL PRIMARY KEY,
    name text
);

CREATE TABLE IF NOT EXISTS bounties
(
    bounty_id SERIAL PRIMARY KEY,
    title text,
    description text,
    status integer NOT NULL,
	category_id integer,
    expiration_date date,
	FOREIGN KEY (category_id) REFERENCES bounty_categories(category_id)
);