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
    'Teléfono',
    'DOI',
    'Título Artículo',
    'Autores del Artículo',
    'Autores UNCP',
    'Autores Externos',
    'Revista',
    'Editorial',
    'Fecha Publicación',
    'URLs PDFs Verificación',
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
    } else if (data.action === 'checkDuplicate') {
      return checkDuplicateDOI(data);
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
// VALIDACIÓN DE DUPLICADOS
// ============================================

/**
 * Verifica si un DOI ya ha sido registrado previamente
 */
function checkDuplicateDOI(data) {
  try {
    const sheetId = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
    const ss = SpreadsheetApp.openById(sheetId);
    const sheet = ss.getActiveSheet();
    
    const doi = data.doi;
    const titulo = data.titulo;
    
    // Obtener todos los datos de la hoja
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    // Buscar DOI duplicado (columna 7 = índice 6)
    // Empezar desde la fila 2 (índice 1) para saltar encabezados
    for (let i = 1; i < values.length; i++) {
      const rowDOI = values[i][6]; // Columna DOI
      const rowTitulo = values[i][7]; // Columna Título
      
      // Verificar si el DOI coincide o el título es muy similar
      if (rowDOI && (rowDOI.toLowerCase() === doi.toLowerCase() || 
          (rowTitulo && rowTitulo.toLowerCase() === titulo.toLowerCase()))) {
        
        // Encontrado duplicado - devolver datos del postulante previo
        return createResponse(false, 'Este artículo ya ha sido postulado', {
          isDuplicate: true,
          postulacionPrevia: {
            fecha: values[i][0], // Fecha postulación
            nombres: values[i][1],
            apellidos: values[i][2],
            email: values[i][3],
            facultad: values[i][4],
            telefono: values[i][5],
            doi: values[i][6],
            titulo: values[i][7],
            autoresUNCP: values[i][9],
            estado: values[i][15]
          }
        });
      }
    }
    
    // No se encontró duplicado
    return createResponse(true, 'DOI disponible para postular', {
      isDuplicate: false
    });
    
  } catch (error) {
    Logger.log('Error al verificar duplicado: ' + error.toString());
    return createResponse(false, 'Error al verificar duplicado: ' + error.toString());
  }
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
function guardarPDF(base64Data, fileName, carpeta = null) {
  // Si no se especifica carpeta, usar la principal
  if (!carpeta) {
    const folderId = PropertiesService.getScriptProperties().getProperty('FOLDER_ID');
    carpeta = DriveApp.getFolderById(folderId);
  }
  
  // Decodificar Base64 y crear archivo
  const fileBlob = Utilities.newBlob(
    Utilities.base64Decode(base64Data),
    'application/pdf',
    fileName
  );
  
  const file = carpeta.createFile(fileBlob);
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
    const folderId = PropertiesService.getScriptProperties().getProperty('FOLDER_ID');
    const carpetaPrincipal = DriveApp.getFolderById(folderId);
    
    // 1. Crear subcarpeta para esta postulación
    const nombreCarpeta = `${data.apellidos}_${data.nombres}_${new Date().getTime()}`;
    const subcarpeta = carpetaPrincipal.createFolder(nombreCarpeta);
    
    // 2. Guardar PDFs de los autores UNCP
    const autoresUNCP = [];
    const autoresExternos = [];
    const pdfsUrls = [];
    
    data.publicacion.autores.forEach((autor, index) => {
      if (autor.afiliacion === 'UNCP') {
        autoresUNCP.push(autor.nombre);
        
        // Guardar PDF de verificación
        if (autor.pdfVerificacion) {
          const pdfInfo = guardarPDF(autor.pdfVerificacion, autor.pdfFileName, subcarpeta);
          pdfsUrls.push(`${autor.nombre}: ${pdfInfo.fileUrl}`);
        }
      } else {
        autoresExternos.push(autor.nombre);
      }
    });
    
    // 3. Guardar datos en Google Sheets
    const sheetId = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
    const ss = SpreadsheetApp.openById(sheetId);
    const sheet = ss.getActiveSheet();
    
    // Preparar listado de todos los autores
    const todosAutores = data.publicacion.autores.map(a => 
      `${a.nombre} (${a.afiliacion})`
    ).join('; ');
    
    // Preparar datos para la fila
    const rowData = [
      new Date(), // Fecha postulación
      data.nombres,
      data.apellidos,
      data.email,
      data.facultad,
      data.telefono,
      data.publicacion.doi,
      data.publicacion.titulo,
      todosAutores, // Todos los autores con su afiliación
      autoresUNCP.join('; '), // Solo autores UNCP
      autoresExternos.join('; '), // Solo autores externos
      data.publicacion.revista,
      data.publicacion.editorial,
      data.publicacion.fecha,
      pdfsUrls.join('\n'), // URLs de PDFs de verificación
      'Pendiente', // Estado inicial
      subcarpeta.getId()
    ];
    
    // Añadir fila
    sheet.appendRow(rowData);
    
    // 4. Enviar email de confirmación
    enviarEmailConfirmacion(data.email, data.nombres, data.apellidos, autoresUNCP.length);
    
    return createResponse(true, 'Postulación enviada correctamente', {
      carpetaUrl: subcarpeta.getUrl(),
      rowNumber: sheet.getLastRow(),
      autoresUNCP: autoresUNCP.length,
      autoresExternos: autoresExternos.length
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
function enviarEmailConfirmacion(email, nombres, apellidos, numAutoresUNCP) {
  try {
    const subject = 'Confirmación de Postulación - Premio Excelencia UNCP 2025';
    const body = `
Estimado/a ${nombres} ${apellidos},

Su postulación al II Premio a la Excelencia Científica UNCP-2025 ha sido recibida exitosamente.

Fecha de recepción: ${new Date().toLocaleString('es-PE')}
Número de autores con afiliación UNCP: ${numAutoresUNCP}

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
