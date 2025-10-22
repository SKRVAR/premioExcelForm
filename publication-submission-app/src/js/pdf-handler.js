function handlePDFUpload(fileInput) {
    const file = fileInput.files[0];
    const allowedTypes = ['application/pdf'];
    
    if (!file) {
        alert('Por favor, selecciona un archivo PDF para cargar.');
        return false;
    }

    if (!allowedTypes.includes(file.type)) {
        alert('Solo se permiten archivos PDF. Por favor, selecciona un archivo válido.');
        return false;
    }

    if (file.size > 5 * 1024 * 1024) { // Limitar a 5MB
        alert('El archivo es demasiado grande. El tamaño máximo permitido es 5MB.');
        return false;
    }

    return true; // Validación exitosa
}

function uploadPDF(file) {
    const storageKey = 'uploadedPDFs';
    let uploadedPDFs = JSON.parse(localStorage.getItem(storageKey)) || [];

    const reader = new FileReader();
    reader.onload = function(event) {
        const pdfData = event.target.result;
        uploadedPDFs.push({ name: file.name, data: pdfData });
        localStorage.setItem(storageKey, JSON.stringify(uploadedPDFs));
        alert('Archivo PDF cargado exitosamente.');
    };

    reader.readAsDataURL(file);
}

document.getElementById('pdfInput').addEventListener('change', function(event) {
    const fileInput = event.target;
    if (handlePDFUpload(fileInput)) {
        uploadPDF(fileInput.files[0]);
    }
});