-- Barbarian Subclasses from Player's Handbook
-- Insert statements for custom_dnd_subclasses and subclass_features tables

-- Berserker Subclass
INSERT INTO custom_dnd_subclasses (name, class_index, is_custom_class) 
VALUES ('Berserker', 'barbarian', false) 
RETURNING subclass_id;

-- Berserker Features
INSERT INTO subclass_features (subclass_id, name, description, level) VALUES
(1, 'Frenzy', 'Starting when you choose this path at 3rd level, you can go into a frenzy when you rage. If you do so, for the duration of your rage you can make a single melee weapon attack as a bonus action on each of your turns after this one. When your rage ends, you suffer one level of exhaustion.', 3),
(1, 'Mindless Rage', 'Beginning at 6th level, you can''t be charmed or frightened while raging. If you are charmed or frightened when you enter your rage, the effect is suspended for the duration of the rage.', 6),
(1, 'Intimidating Presence', 'Beginning at 10th level, you can use your action to frighten someone with your menacing presence. When you do so, choose one creature that you can see within 30 feet of you. If the creature can see or hear you, it must succeed on a Wisdom saving throw (DC equal to 8 + your proficiency bonus + your Charisma modifier) or be frightened of you until the end of your next turn. On subsequent turns, you can use your action to extend the duration of this effect on the frightened creature until the end of your next turn. This effect ends if the creature ends its turn out of line of sight or more than 60 feet away from you. If the creature succeeds on its saving throw, you can''t use this feature on that creature again for 24 hours.', 10),
(1, 'Retaliation', 'Starting at 14th level, when you take damage from a creature that is within 5 feet of you, you can use your reaction to make a melee weapon attack against that creature.', 14);

-- Totem Warrior Subclass
INSERT INTO custom_dnd_subclasses (name, class_index, is_custom_class) 
VALUES ('Totem Warrior', 'barbarian', false) 
RETURNING subclass_id;

-- Totem Warrior Features
INSERT INTO subclass_features (subclass_id, name, description, level) VALUES
(2, 'Spirit Seeker', 'Yours is a path that seeks attunement with the natural world, giving you a kinship with beasts. At 3rd level when you adopt this path, you gain the ability to cast the beast sense and speak with animals spells, but only as rituals.', 3),
(2, 'Totem Spirit', 'At 3rd level, when you adopt this path, you choose a totem spirit and gain its feature. You must make or acquire a physical totem object – an amulet or similar adornment – that incorporates fur or feathers, claws, teeth, or bones of the totem animal. At your option, you also gain minor physical attributes that are reminiscent of your totem spirit. For example, if you have a bear totem spirit, you might be unusually hairy and thick-skinned, or if your totem is the eagle, your eyes take on a bright yellow color. Your totem animal might be an animal related to those listed here but more appropriate to your homeland. For example, you could choose a hawk or vulture in place of an eagle.', 3),
(2, 'Aspect of the Beast', 'At 6th level, you gain a magical benefit based on the totem animal of your choice. You can choose the same animal you selected at 3rd level or a different one.', 6),
(2, 'Spirit Walker', 'At 10th level, you can cast the commune with nature spell, but only as a ritual. When you do so, a primal magic might give you an omen, an understanding, or a brief message from a nature spirit or a natural force of the world around you.', 10),
(2, 'Totemic Attunement', 'At 14th level, you gain a magical benefit based on a totem animal of your choice. You can choose the same animal you selected previously or a different one.', 14);

-- Note: The specific totem animal features (Bear, Eagle, Wolf, etc.) would need to be added as separate features
-- or handled through a different mechanism since they are choices within the main features




