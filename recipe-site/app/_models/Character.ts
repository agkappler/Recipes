export default class Character {
    characterId: number;
    name: string;
    race: string;
    className: string;
    subclassName: string;
    level: number;

    constructor(characterId: number, name: string, race: string, className: string, subclassName: string, level: number) {
        this.characterId = characterId;
        this.name = name;
        this.race = race;
        this.className = className;
        this.subclassName = subclassName;
        this.level = level;
    }
}