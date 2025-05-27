const BASE_URL = "https://www.dnd5eapi.co/api/2014";
export interface DndItem {
    index: string;
    name: string;
    url: string;
}
export interface BaseDndResponse {
    results: DndItem[]
}

export async function getAllSpells() {
    return fetch(BASE_URL + "/spells").then((response) => response.json());
}

export interface DndClassResponse {
    index: string;
    name: string;
    url: string;
}
export async function getClasses() {
    return fetch(BASE_URL + "/classes").then((response) => response.json());
}

export async function getClass(className: string) {
    return fetch(BASE_URL + "/classes/" + className).then((response) => response.json());
}

export async function getSubclasses(className: string): Promise<BaseDndResponse> {
    return fetch(BASE_URL + "/classes/" + className + "/subclasses").then((response) => response.json());
}

export interface DndRaceResponse {
    index: string;
    name: string;
    url: string;
}
export async function getRaces() {
    return fetch(BASE_URL + "/races").then((response) => response.json());
}


export async function getSubraces(race: string): Promise<BaseDndResponse> {
    return fetch(BASE_URL + "/races/" + race + "/subraces").then((response) => response.json());
}