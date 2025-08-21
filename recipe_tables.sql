
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

ALTER TABLE recipes ADD COLUMN IF NOT EXISTS avatar_id integer;
ALTER TABLE recipes ADD CONSTRAINT recipes_avatar_id_fkey FOREIGN KEY (avatar_id)
	REFERENCES files(file_id) MATCH SIMPLE
	ON UPDATE NO ACTION
	ON DELETE CASCADE;
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS total_calories integer;

CREATE TABLE IF NOT EXISTS recipe_steps (
	step_id SERIAL PRIMARY KEY,
	recipe_id integer NOT NULL,
	step_number integer NOT NULL,
	description TEXT NOT NULL,
	CONSTRAINT recipe_steps_recipe_id_fkey FOREIGN KEY (recipe_id)
        REFERENCES public.recipes (recipe_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);

ALTER TABLE recipes DROP COLUMN IF EXISTS instructions;
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS description TEXT;