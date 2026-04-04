-- Barbarian Subclasses from Player's Handbook - Detailed Version
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

-- Totem Warrior Base Features
INSERT INTO subclass_features (subclass_id, name, description, level) VALUES
(2, 'Spirit Seeker', 'Yours is a path that seeks attunement with the natural world, giving you a kinship with beasts. At 3rd level when you adopt this path, you gain the ability to cast the beast sense and speak with animals spells, but only as rituals.', 3),
(2, 'Totem Spirit', 'At 3rd level, when you adopt this path, you choose a totem spirit and gain its feature. You must make or acquire a physical totem object – an amulet or similar adornment – that incorporates fur or feathers, claws, teeth, or bones of the totem animal. At your option, you also gain minor physical attributes that are reminiscent of your totem spirit. For example, if you have a bear totem spirit, you might be unusually hairy and thick-skinned, or if your totem is the eagle, your eyes take on a bright yellow color. Your totem animal might be an animal related to those listed here but more appropriate to your homeland. For example, you could choose a hawk or vulture in place of an eagle.', 3),
(2, 'Aspect of the Beast', 'At 6th level, you gain a magical benefit based on the totem animal of your choice. You can choose the same animal you selected at 3rd level or a different one.', 6),
(2, 'Spirit Walker', 'At 10th level, you can cast the commune with nature spell, but only as a ritual. When you do so, a primal magic might give you an omen, an understanding, or a brief message from a nature spirit or a natural force of the world around you.', 10),
(2, 'Totemic Attunement', 'At 14th level, you gain a magical benefit based on a totem animal of your choice. You can choose the same animal you selected previously or a different one.', 14);

-- Totem Animal Options (Level 3 - Totem Spirit)
INSERT INTO subclass_features (subclass_id, name, description, level) VALUES
(2, 'Bear Totem Spirit', 'While raging, you have resistance to all damage except psychic damage. The spirit of the bear makes you tough enough to stand up to any punishment.', 3),
(2, 'Eagle Totem Spirit', 'While you''re raging and aren''t wearing heavy armor, other creatures have disadvantage on opportunity attack rolls against you, and you can use the Dash action as a bonus action on your turn. The spirit of the eagle makes you into a predator who can weave through the fray with ease.', 3),
(2, 'Wolf Totem Spirit', 'While you''re raging, your friends have advantage on melee attack rolls against creatures within 5 feet of you. The spirit of the wolf makes you a leader of hunters.', 3);

-- Totem Animal Options (Level 6 - Aspect of the Beast)
INSERT INTO subclass_features (subclass_id, name, description, level) VALUES
(2, 'Bear Aspect', 'You gain the might of a bear. Your carrying capacity (including maximum load and maximum lift) is doubled, and you have advantage on Strength checks made to push, pull, lift, or break objects.', 6),
(2, 'Eagle Aspect', 'You gain the eyesight of an eagle. You can see up to 1 mile away without difficulty, able to discern even fine details as though looking at something no more than 100 feet away from you. Additionally, dim light doesn''t impose disadvantage on your Wisdom (Perception) checks.', 6),
(2, 'Wolf Aspect', 'You gain the hunting sensibilities of a wolf. You can track other creatures while traveling at a fast pace, and you can move stealthily while traveling at a normal pace.', 6);

-- Totem Animal Options (Level 14 - Totemic Attunement)
INSERT INTO subclass_features (subclass_id, name, description, level) VALUES
(2, 'Bear Totemic Attunement', 'While you''re raging, any creature within 5 feet of you that''s hostile to you has disadvantage on attack rolls against targets other than you or another character with this feature. An enemy is immune to this effect if it can''t see or hear you, or if it can''t be frightened.', 14),
(2, 'Eagle Totemic Attunement', 'While raging, you have a flying speed equal to your current walking speed. This benefit works only in short bursts; you fall if you end your turn in the air and nothing else is holding you aloft.', 14),
(2, 'Wolf Totemic Attunement', 'While you''re raging, you can use a bonus action on your turn to knock a Large or smaller creature prone when you hit it with melee weapon attack.', 14);




