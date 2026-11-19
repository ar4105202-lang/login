// js/storage.js
const KEY = "people";

export function loadPeople() {
    return JSON.parse(localStorage.getItem(KEY)) || [];
}

export function savePeople(people) {
    localStorage.setItem(KEY, JSON.stringify(people));
}