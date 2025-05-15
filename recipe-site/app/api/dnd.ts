const BASE_URL = "https://www.dnd5eapi.co/api/2014";

export async function getAllSpells() {
    return fetch(BASE_URL + "/spells").then((response) => response.json());
}

export async function getClasses() {
    return fetch(BASE_URL + "/classes").then((response) => response.json());
}

export async function getClass(className: string) {
    return fetch(BASE_URL + "/classes/" + className).then((response) => response.json());
}