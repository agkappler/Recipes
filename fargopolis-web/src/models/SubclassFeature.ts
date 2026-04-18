export default class SubclassFeature {
    subclassFeatureId: number;
    name: string;
    level: number;
    description: string;
    subclassId: number;

    constructor(subclassFeatureId: number, name: string, level: number, description: string, subclassId: number) {
        this.subclassFeatureId = subclassFeatureId;
        this.name = name;
        this.level = level;
        this.description = description;
        this.subclassId = subclassId;
    }
}