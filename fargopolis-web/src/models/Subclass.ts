export default class Subclass {
    subclassId: number;
    name: string;
    index: string;
    classIndex: string;
    isCustomClass: boolean;
    isCustom: boolean;

    constructor(subclassId: number, name: string, index: string, classIndex: string, isCustomClass: boolean, isCustom: boolean) {
        this.subclassId = subclassId;
        this.name = name;
        this.index = index;
        this.classIndex = classIndex;
        this.isCustomClass = isCustomClass;
        this.isCustom = isCustom;
    }
}