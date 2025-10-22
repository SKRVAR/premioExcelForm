// This file manages local storage operations, allowing the application to save and retrieve submitted publication data without a backend.

const STORAGE_KEY = 'publicationData';

// Function to save publication data to local storage
function savePublicationData(data) {
    let publications = getPublicationData();
    publications.push(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(publications));
}

// Function to retrieve publication data from local storage
function getPublicationData() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

// Function to clear all publication data from local storage
function clearPublicationData() {
    localStorage.removeItem(STORAGE_KEY);
}