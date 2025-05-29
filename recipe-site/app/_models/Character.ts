import { DndClass } from "../_constants/DndClass";
import { DndRace } from "../_constants/DndRace";

export default class Character {
    characterId: number;
    name: string;
    race: DndRace;
    className: DndClass;
    subclassName: string;
    level: number;
    avatarId?: number;

    constructor(characterId: number, name: string, race: DndRace, className: DndClass, subclassName: string, level: number) {
        this.characterId = characterId;
        this.name = name;
        this.race = race;
        this.className = className;
        this.subclassName = subclassName;
        this.level = level;
    }
}