export default class KnownSpell {
    spellName: string;
    characterId: number;
    spellKey: string;
    spellLevel: number;

    constructor(spellName: string, spellKey: string, characterId: number, spellLevel: number) {
        this.spellName = spellName;
        this.spellKey = spellKey;
        this.characterId = characterId;
        this.spellLevel = spellLevel;
    }
}