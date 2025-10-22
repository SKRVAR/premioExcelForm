/**
 * GOOGLE APPS SCRIPT - BACKEND PARA FORMULARIO PREMIO EXCELENCIA
 * 
 * INSTRUCCIONES DE INSTALACIÓN:
 * 1. Ir a https://script.google.com/
 * 2. Crear un nuevo proyecto
 * 3. Pegar este código en Code.gs
 * 4. Ejecutar la función inicializarProyecto() (solo una vez)
 * 5. Autorizar los permisos
 * 6. Copiar la URL del web app después de publicar
 */

// ============================================
// CONFIGURACIÓN INICIAL
// ============================================

/**
 * Función para inicializar el proyecto por primera vez
 * Ejecuta esto SOLO UNA VEZ para crear la carpeta y hoja de cálculo
 */
function inicializarProyecto() {
  // Crear carpeta en Drive
  const carpeta = DriveApp.createFolder('Premio Excelencia UNCP - Postulaciones 2025');
  const carpetaId = carpeta.getId();
  
  // Crear hoja de cálculo
  const ss = SpreadsheetApp.create('Postulaciones Premio Excelencia 2025');
  const sheet = ss.getActiveSheet();
  
  // Configurar encabezados
  const headers = [
    'Fecha Postulación',
    'Nombres',
    'Apellidos',
    'Email',
    'Facultad',
    'Escuela',
    'Teléfono',
    'DOI',
    'Título Artículo',
    'Autores',
    'Revista',
    'Editorial',
    'Fecha Publicación',
    'URL PDF',
    'Nombre Archivo',
    'Estado',
    'ID Carpeta Drive'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#4285f4').setFontColor('#ffffff');
  sheet.setFrozenRows(1);
  
  // Mover hoja a la carpeta
  const file = DriveApp.getFileById(ss.getId());
  file.moveTo(carpeta);
  
  Logger.log('✅ Proyecto inicializado correctamente');
  Logger.log('📁 ID de carpeta: ' + carpetaId);
  Logger.log('📊 ID de hoja: ' + ss.getId());
  Logger.log('🔗 URL de hoja: ' + ss.getUrl());
  
  // Guardar IDs en propiedades del script
  PropertiesService.getScriptProperties().setProperties({
    'FOLDER_ID': carpetaId,
    'SHEET_ID': ss.getId()
  });
  
  return {
    carpetaId: carpetaId,
    sheetId: ss.getId(),
    sheetUrl: ss.getUrl()
  };
}

// ============================================
// ENDPOINT PRINCIPAL (WEB APP)
// ============================================

/**
 * Maneja las peticiones POST del formulario
 */
function doPost(e) {
  try {
    // Permitir CORS
    const output = ContentService.createTextOutput();
    output.setMimeType(ContentService.MimeType.JSON);
    
    // Parsear datos del formulario
    const data = JSON.parse(e.postData.contents);
    
    // Procesar según el tipo de acción
    if (data.action === 'submitForm') {
      return handleFormSubmission(data);
    } else if (data.action === 'uploadFile') {
      return handleFileUpload(data);
    }
    
    return createResponse(false, 'Acción no válida');
    
  } catch (error) {
    Logger.log('Error en doPost: ' + error.toString());
    return createResponse(false, 'Error del servidor: ' + error.toString());
  }
}

/**
 * Maneja peticiones GET (para verificar que el script funciona)
 */
function doGet(e) {
  return ContentService.createTextOutput(
    JSON.stringify({
      status: 'OK',
      message: 'Google Apps Script está funcionando correctamente',
      timestamp: new Date().toISOString()
    })
  ).setMimeType(ContentService.MimeType.JSON);
}

// ============================================
// MANEJO DE ARCHIVOS
// ============================================

/**
 * Guarda el archivo PDF en Google Drive
 */
function handleFileUpload(data) {
  try {
    const folderId = PropertiesService.getScriptProperties().getProperty('FOLDER_ID');
    const folder = DriveApp.getFolderById(folderId);
    
    // Decodificar base64
    const fileBlob = Utilities.newBlob(
      Utilities.base64Decode(data.fileData),
      'application/pdf',
      data.fileName
    );
    
    // Crear archivo en Drive
    const file = folder.createFile(fileBlob);
    
    // Hacer el archivo accesible con el link
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    return createResponse(true, 'Archivo subido correctamente', {
      fileId: file.getId(),
      fileUrl: file.getUrl(),
      fileName: file.getName()
    });
    
  } catch (error) {
    Logger.log('Error al subir archivo: ' + error.toString());
    return createResponse(false, 'Error al subir archivo: ' + error.toString());
  }
}

/**
 * Guarda el PDF recibido como Base64
 */
function guardarPDF(base64Data, fileName) {
  const folderId = PropertiesService.getScriptProperties().getProperty('FOLDER_ID');
  const folder = DriveApp.getFolderById(folderId);
  
  // Decodificar Base64 y crear archivo
  const fileBlob = Utilities.newBlob(
    Utilities.base64Decode(base64Data),
    'application/pdf',
    fileName
  );
  
  const file = folder.createFile(fileBlob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  
  return {
    fileId: file.getId(),
    fileUrl: file.getUrl(),
    fileName: file.getName()
  };
}

// ============================================
// MANEJO DEL FORMULARIO
// ============================================

/**
 * Procesa y guarda los datos del formulario
 */
function handleFormSubmission(data) {
  try {
    // 1. Guardar PDF
    const pdfInfo = guardarPDF(data.pdfBase64, data.pdfFileName);
    
    // 2. Guardar datos en Google Sheets
    const sheetId = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
    const ss = SpreadsheetApp.openById(sheetId);
    const sheet = ss.getActiveSheet();
    
    // Preparar datos para la fila
    const rowData = [
      new Date(), // Fecha postulación
      data.nombres,
      data.apellidos,
      data.email,
      data.facultad,
      data.escuela,
      data.telefono,
      data.publicacion.doi,
      data.publicacion.titulo,
      JSON.stringify(data.publicacion.autores), // Convertir array a string
      data.publicacion.revista,
      data.publicacion.editorial,
      data.publicacion.fecha,
      pdfInfo.fileUrl,
      pdfInfo.fileName,
      'Pendiente', // Estado inicial
      PropertiesService.getScriptProperties().getProperty('FOLDER_ID')
    ];
    
    // Añadir fila
    sheet.appendRow(rowData);
    
    // 3. Enviar email de confirmación (opcional)
    enviarEmailConfirmacion(data.email, data.nombres, data.apellidos);
    
    return createResponse(true, 'Postulación enviada correctamente', {
      pdfUrl: pdfInfo.fileUrl,
      rowNumber: sheet.getLastRow()
    });
    
  } catch (error) {
    Logger.log('Error al procesar formulario: ' + error.toString());
    return createResponse(false, 'Error al procesar formulario: ' + error.toString());
  }
}

// ============================================
// EMAIL DE CONFIRMACIÓN
// ============================================

/**
 * Envía un email de confirmación al postulante
 */
function enviarEmailConfirmacion(email, nombres, apellidos) {
  try {
    const subject = 'Confirmación de Postulación - Premio Excelencia UNCP 2025';
    const body = `
Estimado/a ${nombres} ${apellidos},

Su postulación al II Premio a la Excelencia Científica UNCP-2025 ha sido recibida exitosamente.

Fecha de recepción: ${new Date().toLocaleString('es-PE')}

El comité evaluador revisará su postulación y le comunicaremos los resultados oportunamente.

Atentamente,
Vicerrectorado de Investigación
Universidad Nacional del Centro del Perú
    `;
    
    MailApp.sendEmail({
      to: email,
      subject: subject,
      body: body
    });
    
    Logger.log('Email de confirmación enviado a: ' + email);
  } catch (error) {
    Logger.log('Error al enviar email: ' + error.toString());
    // No lanzar error para no bloquear el guardado
  }
}

// ============================================
// FUNCIONES DE ADMINISTRACIÓN
// ============================================

/**
 * Obtiene todas las postulaciones (para panel de administración)
 */
function obtenerPostulaciones() {
  const sheetId = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  const ss = SpreadsheetApp.openById(sheetId);
  const sheet = ss.getActiveSheet();
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = data.slice(1);
  
  return rows.map(row => {
    let obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj;
  });
}

/**
 * Actualiza el estado de una postulación
 */
function actualizarEstado(rowNumber, nuevoEstado) {
  const sheetId = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  const ss = SpreadsheetApp.openById(sheetId);
  const sheet = ss.getActiveSheet();
  
  // Columna 16 = Estado
  sheet.getRange(rowNumber, 16).setValue(nuevoEstado);
  
  return createResponse(true, 'Estado actualizado correctamente');
}

/**
 * Exporta los datos a un archivo Excel
 */
function exportarAExcel() {
  const sheetId = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  const ss = SpreadsheetApp.openById(sheetId);
  
  // Crear una copia temporal
  const tempFile = DriveApp.getFileById(sheetId).makeCopy('Postulaciones_' + new Date().getTime());
  
  return {
    fileId: tempFile.getId(),
    fileUrl: tempFile.getUrl()
  };
}

// ============================================
// UTILIDADES
// ============================================

/**
 * Crea una respuesta JSON estandarizada
 */
function createResponse(success, message, data = null) {
  const response = {
    success: success,
    message: message,
    timestamp: new Date().toISOString()
  };
  
  if (data) {
    response.data = data;
  }
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Obtiene la configuración actual del proyecto
 */
function obtenerConfiguracion() {
  const props = PropertiesService.getScriptProperties();
  
  return {
    folderId: props.getProperty('FOLDER_ID'),
    sheetId: props.getProperty('SHEET_ID'),
    sheetUrl: SpreadsheetApp.openById(props.getProperty('SHEET_ID')).getUrl()
  };
}
