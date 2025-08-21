import { AbilitySource } from "@/app/_constants/AbilitySource";

export default class Ability {
    abilityId: number;
    characterId: number;
    name: string;
    description: string;
    source: AbilitySource;
    sourceDescription: string;
    usage: string;

    constructor(
        abilityId: number,
        characterId: number,
        name: string,
        description: string,
        source: AbilitySource,
        sourceDescription: string,
        usage: string
    ) {
        this.abilityId = abilityId;
        this.characterId = characterId;
        this.name = name;
        this.description = description;
        this.source = source;
        this.sourceDescription = sourceDescription;
        this.usage = usage;
    }
}
