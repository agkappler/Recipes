
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

CREATE TABLE IF NOT EXISTS known_spells (
    character_id INTEGER NOT NULL,
    spell_key VARCHAR(100) NOT NULL,
    spell_name TEXT NOT NULL,
    spell_level INTEGER NOT NULL,
    PRIMARY KEY (character_id, spell_key),
    FOREIGN KEY (character_id) REFERENCES dnd_characters(character_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS weapons (
    weapon_id SERIAL PRIMARY KEY,
    character_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    damage TEXT NOT NULL,
    range TEXT,
    damage_type TEXT,
    description TEXT,
    FOREIGN KEY (character_id) REFERENCES dnd_characters(character_id) ON DELETE CASCADE
);

-- Create index on character_id for efficient lookups of all weapons for a character
CREATE INDEX IF NOT EXISTS idx_weapons_character_id ON weapons (character_id);

CREATE TABLE IF NOT EXISTS abilities (
    ability_id SERIAL PRIMARY KEY,
    character_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    source INTEGER,
    source_description TEXT,
    usage TEXT,
    FOREIGN KEY (character_id) REFERENCES dnd_characters(character_id) ON DELETE CASCADE
);

-- Create index on character_id for efficient lookups of all abilities for a character
CREATE INDEX IF NOT EXISTS idx_abilities_character_id ON abilities (character_id);