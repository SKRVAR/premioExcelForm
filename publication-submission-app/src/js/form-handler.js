// This file handles the form submission logic, including validation of input fields and managing the PDF file upload process.

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('publicationForm');
    const pdfInput = document.getElementById('pdfUpload');
    const titleInput = document.getElementById('title');
    const authorInput = document.getElementById('author');
    const yearInput = document.getElementById('year');
    const resultDiv = document.getElementById('result');

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const title = titleInput.value.trim();
        const author = authorInput.value.trim();
        const year = yearInput.value.trim();
        const pdfFile = pdfInput.files[0];

        if (!title || !author || !year || !pdfFile) {
            resultDiv.innerHTML = '<p class="text-red-500">Por favor, completa todos los campos y sube un archivo PDF.</p>';
            return;
        }

        if (!validateYear(year)) {
            resultDiv.innerHTML = '<p class="text-red-500">Por favor, ingresa un año válido.</p>';
            return;
        }

        const publicationData = {
            title,
            author,
            year,
            pdfFile: pdfFile.name
        };

        saveToLocalStorage(publicationData);
        resultDiv.innerHTML = '<p class="text-green-500">Publicación enviada con éxito.</p>';
        form.reset();
    });

    function validateYear(year) {
        const currentYear = new Date().getFullYear();
        return year.match(/^\d{4}$/) && year <= currentYear;
    }

    function saveToLocalStorage(data) {
        let submissions = JSON.parse(localStorage.getItem('submissions')) || [];
        submissions.push(data);
        localStorage.setItem('submissions', JSON.stringify(submissions));
    }
});