
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

CREATE TABLE IF NOT EXISTS files (
  file_id SERIAL PRIMARY KEY,
  uu_id TEXT NOT NULL,
  filename TEXT NOT NULL,
  content_type TEXT,
  size_bytes BIGINT,
  file_role INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS dnd_characters (
	character_id SERIAL PRIMARY KEY,
	name text  NOT NULL,
	race text NOT NULL,
	subrace text NOT NULL,
	class text NOT NULL,
	subclass text,
	level integer NOT NULL,
	avatar_id integer,
	FOREIGN KEY (avatar_id) REFERENCES files(file_id)
);

ALTER TABLE dnd_characters ADD COLUMN IF NOT EXISTS is_custom_race BOOLEAN DEFAULT FALSE;
ALTER TABLE dnd_characters ADD COLUMN IF NOT EXISTS is_custom_class BOOLEAN DEFAULT FALSE;
ALTER TABLE dnd_characters ADD COLUMN IF NOT EXISTS is_custom_subclass BOOLEAN DEFAULT FALSE;
ALTER TABLE dnd_characters ADD COLUMN IF NOT EXISTS is_custom_subrace BOOLEAN DEFAULT FALSE;

CREATE TABLE IF NOT EXISTS custom_dnd_races (
	race_id SERIAL PRIMARY KEY,
	name TEXT NOT NULL,
	description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS custom_dnd_subraces (
	subrace_id SERIAL PRIMARY KEY,
	name TEXT NOT NULL,
	race_id INTEGER NOT NULL,
	description TEXT NOT NULL,
	CONSTRAINT custom_dnd_subraces_race_id_fkey FOREIGN KEY (race_id)
        REFERENCES public.custom_dnd_races (race_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS dnd_race_traits (
	race_trait_id SERIAL PRIMARY KEY,
	name TEXT NOT NULL,
	description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS rel_dnd_race_traits (
	race_id INTEGER,
	race_trait_id INTEGER,
	CONSTRAINT rel_dnd_race_traits_race_id_fkey FOREIGN KEY (race_id)
        REFERENCES public.custom_dnd_races (race_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
	CONSTRAINT rel_dnd_race_traits_race_trait_id_fkey FOREIGN KEY (race_trait_id)
        REFERENCES public.dnd_race_traits (race_trait_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS rel_dnd_subrace_traits (
	subrace_id INTEGER,
	race_trait_id INTEGER,
	CONSTRAINT rel_dnd_subrace_traits_race_id_fkey FOREIGN KEY (subrace_id)
        REFERENCES public.custom_dnd_subraces (subrace_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
	CONSTRAINT rel_dnd_race_traits_race_trait_id_fkey FOREIGN KEY (race_trait_id)
        REFERENCES public.dnd_race_traits (race_trait_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS rel_character_resource_file (
  character_id INTEGER NOT NULL,
  file_id INTEGER NOT NULL,
  CONSTRAINT rel_character_resource_file_character_id_fkey FOREIGN KEY (character_id)
        REFERENCES public.dnd_characters (character_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
  CONSTRAINT rel_character_resource_file_id_fkey FOREIGN KEY (file_id)
        REFERENCES public.files (file_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);

ALTER TABLE recipes ADD COLUMN IF NOT EXISTS avatar_id integer;
ALTER TABLE recipes ADD CONSTRAINT recipes_avatar_id_fkey FOREIGN KEY (avatar_id)
	REFERENCES files(file_id) MATCH SIMPLE
	ON UPDATE NO ACTION
	ON DELETE CASCADE;
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS total_calories integer;

ALTER TABLE users ADD CONSTRAINT uq_users_email UNIQUE (email);