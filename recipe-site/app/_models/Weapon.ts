export default class Weapon {
    weaponId: number;
    characterId: number;
    name: string;
    damage: string;
    range: string;
    damageType: string;
    description: string;

    constructor(weaponId: number, characterId: number, name: string, damage: string, range: string, damageType: string, description: string) {
        this.weaponId = weaponId;
        this.characterId = characterId;
        this.name = name;
        this.damage = damage;
        this.range = range;
        this.damageType = damageType;
        this.description = description;
    }
}