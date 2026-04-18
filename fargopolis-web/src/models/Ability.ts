import { AbilitySource, UsageType } from "@/constants/Abilities";

export default class Ability {
    abilityId: number;
    characterId: number;
    name: string;
    description: string;
    source: AbilitySource;
    sourceDescription: string;
    usage: UsageType;
    recovery: string;

    constructor(
        abilityId: number,
        characterId: number,
        name: string,
        description: string,
        source: AbilitySource,
        sourceDescription: string,
        usage: UsageType,
        recovery: string
    ) {
        this.abilityId = abilityId;
        this.characterId = characterId;
        this.name = name;
        this.description = description;
        this.source = source;
        this.sourceDescription = sourceDescription;
        this.usage = usage;
        this.recovery = recovery;
    }
}
