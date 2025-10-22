# Publication Submission App

This project is a web application designed for submitting publication data, including the ability to upload PDF files. It provides a user-friendly interface for both users submitting their publications and administrators managing the submissions.

## Project Structure

```
publication-submission-app
├── src
│   ├── index.html          # Main entry point of the application
│   ├── form.html           # Form for submitting publication data
│   ├── admin.html          # Admin page for managing submissions
│   ├── css
│   │   └── styles.css      # Styles for the application
│   ├── js
│   │   ├── form-handler.js  # Handles form submission logic
│   │   ├── storage.js      # Manages local storage operations
│   │   ├── pdf-handler.js   # Handles PDF file uploads
│   │   └── admin.js        # Manages admin page functionality
│   └── assets
│       └── icons           # Icon files used in the application
├── .gitignore              # Files and directories to ignore by Git
├── .github
│   └── workflows
│       └── deploy.yml      # GitHub Actions workflow for deployment
└── README.md               # Documentation for the project
```

## Features

- **User Submission Form**: Users can enter publication details and upload PDF files.
- **Admin Management**: Administrators can view and manage submitted publications.
- **Local Storage**: The application saves submissions locally without needing a backend.
- **Responsive Design**: The application is designed to be user-friendly on both desktop and mobile devices.

## Getting Started

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/publication-submission-app.git
   ```

2. Navigate to the project directory:
   ```
   cd publication-submission-app
   ```

3. Open `src/index.html` in your web browser to view the application.

## Deployment

This application can be deployed on GitHub Pages. The deployment is automated using GitHub Actions. Ensure that you have configured the `deploy.yml` file correctly for your repository.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any enhancements or bugs.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.