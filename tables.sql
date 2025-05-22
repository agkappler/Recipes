
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

CREATE TABLE IF NOT EXISTS recipes
(
    recipe_id SERIAL PRIMARY KEY,
    name text NOT NULL,
    instructions text NOT NULL,
    prep_time_minutes integer NOT NULL,
    cook_time_minutes integer NOT NULL,
    quantity text
);


CREATE TABLE IF NOT EXISTS ingredients
(
    ingredient_id SERIAL PRIMARY KEY,
    name text NOT NULL,
    quantity text NOT NULL,
    calories integer NOT NULL
);

CREATE TABLE IF NOT EXISTS rel_recipe_ingredient
(
    recipe_id integer NOT NULL,
    ingredient_id integer NOT NULL,
    CONSTRAINT rel_recipe_ingredient_pkey PRIMARY KEY (recipe_id, ingredient_id),
    CONSTRAINT rel_recipe_ingredient_ingredient_id_fkey FOREIGN KEY (ingredient_id)
        REFERENCES public.ingredients (ingredient_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT rel_recipe_ingredient_recipe_id_fkey FOREIGN KEY (recipe_id)
        REFERENCES public.recipes (recipe_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS users (
	user_id SERIAL PRIMARY KEY,
	email text  NOT NULL,
	password text NOT NULL
);
