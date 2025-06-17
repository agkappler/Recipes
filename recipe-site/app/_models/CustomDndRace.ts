import RacialTrait from "./RacialTrait";

export default class CustomDndRace {
    raceId: number;
    name: string;
    index: string;
    description: string;
    traits: RacialTrait[];
    isCustom = true;

    constructor(race: CustomDndRace) {
        this.raceId = race.raceId;
        this.name = race.name;
        this.description = race.description;
        this.index = race.index;
        this.traits = race.traits || [];
    }
}