// This file manages the functionality of the admin page, allowing the user to view and delete submissions.

document.addEventListener('DOMContentLoaded', () => {
    const submissionsList = document.getElementById('submissions-list');
    const clearButton = document.getElementById('clear-submissions');

    // Load submissions from local storage
    function loadSubmissions() {
        const submissions = JSON.parse(localStorage.getItem('submissions')) || [];
        submissionsList.innerHTML = '';

        submissions.forEach((submission, index) => {
            const listItem = document.createElement('li');
            listItem.className = 'submission-item';
            listItem.innerHTML = `
                <strong>${submission.title}</strong> - ${submission.author}
                <button class="delete-button" data-index="${index}">Eliminar</button>
            `;
            submissionsList.appendChild(listItem);
        });
    }

    // Delete a submission
    function deleteSubmission(index) {
        const submissions = JSON.parse(localStorage.getItem('submissions')) || [];
        submissions.splice(index, 1);
        localStorage.setItem('submissions', JSON.stringify(submissions));
        loadSubmissions();
    }

    // Clear all submissions
    clearButton.addEventListener('click', () => {
        localStorage.removeItem('submissions');
        loadSubmissions();
    });

    // Event delegation for delete buttons
    submissionsList.addEventListener('click', (event) => {
        if (event.target.classList.contains('delete-button')) {
            const index = event.target.getAttribute('data-index');
            deleteSubmission(index);
        }
    });

    // Initial load of submissions
    loadSubmissions();
});