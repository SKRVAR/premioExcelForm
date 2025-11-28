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
    'ID', 'Fecha Postulación', 'Nombres', 'Apellidos', 'Email', 
    'PDF Declaración Jurada', 'PDF DJ ID',
    'DOI', 'Título', 'Autores', 'Afiliaciones', 'Vínculos', 'Corresponsales',
    'Año Publicación', 'Enlaces PDFs Autores', 'PDF IDs Autores',
    'Estado', 'Observaciones'
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
 * Verifica si un DOI o título ya ha sido registrado previamente
 * LÓGICA: Se considera duplicado si:
 * - El DOI coincide (y no es "S/N" o vacío), O
 * - El título coincide (normalizado, sin importar mayúsculas/espacios)
 */
function checkDuplicateDOI(data) {
  try {
    const sheetId = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
    const ss = SpreadsheetApp.openById(sheetId);
    const sheet = ss.getActiveSheet();
    
    const doi = data.doi || '';
    const titulo = data.titulo || '';
    
    // Normalizar DOI y título para comparación
    const doiNormalizado = doi.toLowerCase().trim();
    const tituloNormalizado = normalizarTexto(titulo);
    
    // Obtener todos los datos de la hoja
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    // Buscar duplicados (columna H = índice 7 para DOI, columna I = índice 8 para Título)
    // Empezar desde la fila 2 (índice 1) para saltar encabezados
    for (let i = 1; i < values.length; i++) {
      const rowDOI = (values[i][7] || '').toString().toLowerCase().trim();
      const rowTitulo = (values[i][8] || '').toString();
      const rowTituloNormalizado = normalizarTexto(rowTitulo);
      
      let esDuplicado = false;
      let motivoDuplicado = '';
      
      // Verificar duplicado por DOI (solo si el DOI no es "S/N" o vacío)
      if (doiNormalizado && doiNormalizado !== 's/n' && doiNormalizado !== 'sin' && 
          rowDOI && rowDOI !== 's/n' && rowDOI !== 'sin') {
        if (rowDOI === doiNormalizado) {
          esDuplicado = true;
          motivoDuplicado = 'DOI coincidente';
        }
      }
      
      // Verificar duplicado por título (si los títulos normalizados coinciden)
      if (!esDuplicado && tituloNormalizado && rowTituloNormalizado) {
        if (tituloNormalizado === rowTituloNormalizado) {
          esDuplicado = true;
          motivoDuplicado = 'Título coincidente';
        }
      }
      
      if (esDuplicado) {
        // Encontrado duplicado - devolver datos del postulante previo
        return createResponse(false, 'Este artículo ya ha sido postulado (' + motivoDuplicado + ')', {
          isDuplicate: true,
          motivo: motivoDuplicado,
          postulacionPrevia: {
            id: values[i][0], // ID postulación
            fecha: values[i][1], // Fecha postulación
            nombres: values[i][2],
            apellidos: values[i][3],
            email: values[i][4],
            doi: values[i][7],
            titulo: values[i][8],
            autores: values[i][9], // Autores (índice 9)
            estado: values[i][16] // Estado (índice 16)
          }
        });
      }
    }
    
    // No se encontró duplicado
    return createResponse(true, 'Artículo disponible para postular', {
      isDuplicate: false
    });
    
  } catch (error) {
    Logger.log('Error al verificar duplicado: ' + error.toString());
    return createResponse(false, 'Error al verificar duplicado: ' + error.toString());
  }
}

/**
 * Normaliza un texto para comparación:
 * - Convierte a minúsculas
 * - Elimina espacios múltiples y espacios al inicio/final
 * - Elimina signos de puntuación comunes
 * - Elimina tildes/acentos
 */
function normalizarTexto(texto) {
  if (!texto) return '';
  
  return texto
    .toString()
    .toLowerCase()
    .trim()
    // Remover tildes/acentos
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Remover puntuación común
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
    // Reemplazar múltiples espacios por uno solo
    .replace(/\s+/g, ' ')
    .trim();
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
    
    // Crear archivo en Drive (en carpeta principal temporalmente)
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
    const sheetId = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
    const folderId = PropertiesService.getScriptProperties().getProperty('FOLDER_ID');
    const ss = SpreadsheetApp.openById(sheetId);
    const sheet = ss.getActiveSheet();
    const carpetaPrincipal = DriveApp.getFolderById(folderId);
    
    // Configurar encabezados si es la primera vez
    if (sheet.getLastRow() === 0) {
      const headers = [
        'ID', 'Fecha Postulación', 'Nombres', 'Apellidos', 'Email', 
        'PDF Declaración Jurada', 'PDF DJ ID',
        'DOI', 'Título', 'Autores', 'Afiliaciones', 'Vínculos', 'Corresponsales',
        'Año Publicación', 'Enlaces PDFs Autores', 'PDF IDs Autores',
        'Estado', 'Observaciones'
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    }
    
    // Generar ID correlativo
    const postulacionID = generarSiguienteID(sheet);
    
    // Crear subcarpeta para esta postulación con formato: ID_ApellidosLimpios_Timestamp
    const timestamp = new Date().getTime();
    const apellidosLimpios = limpiarTexto(data.apellidos);
    const nombreCarpeta = `${postulacionID}_${apellidosLimpios}_${timestamp}`;
    const subcarpeta = carpetaPrincipal.createFolder(nombreCarpeta);
    
    // Procesar PDF de Declaración Jurada
    let pdfDJUrl = 'ninguno';
    let pdfDJId = 'ninguno';
    
    if (data.pdfDeclaracionJurada && data.pdfDeclaracionJurada.fileId) {
      try {
        const fileDJ = DriveApp.getFileById(data.pdfDeclaracionJurada.fileId);
        const nuevoNombreDJ = `${postulacionID}_dj.pdf`;
        
        // Renombrar y mover a la subcarpeta
        fileDJ.setName(nuevoNombreDJ);
        fileDJ.moveTo(subcarpeta);
        
        // Actualizar URL e ID
        pdfDJUrl = fileDJ.getUrl();
        pdfDJId = data.pdfDeclaracionJurada.fileId;
        
        Logger.log(`PDF Declaración Jurada procesado: ${nuevoNombreDJ}`);
      } catch (djError) {
        Logger.log(`Error procesando PDF DJ: ${djError.toString()}`);
        pdfDJUrl = 'error';
        pdfDJId = 'error';
      }
    }
    
    // Extraer datos de publicación (vienen en data.publicacion)
    const publicacion = data.publicacion || {};
    const autoresData = publicacion.autores || [];
    
    // Procesar autores en arrays separados
    let autoresArray = [];
    let afiliacionesArray = [];
    let vinculosArray = [];
    let corresponsalesArray = [];
    let enlacesPDFsArray = [];
    let pdfIDsArray = [];
    
    if (Array.isArray(autoresData) && autoresData.length > 0) {
      autoresData.forEach((autor, index) => {
        // Formato: "Apellidos, Nombres" (usar el nombre completo si viene así)
        const nombreCompleto = autor.nombre || `${autor.apellidos || ''}, ${autor.nombres || ''}`;
        autoresArray.push(nombreCompleto);
        
        // Afiliación declarada
        const afiliacion = autor.afiliacionDeclarada || autor.afiliacion || 'ninguno';
        afiliacionesArray.push(afiliacion);
        
        // Vínculo: "uncp" o "ninguno"
        let vinculo = 'ninguno';
        if (autor.vinculoLaboral === 'UNCP' || autor.vinculo === 'uncp') {
          vinculo = 'uncp';
        }
        vinculosArray.push(vinculo);
        
        // Corresponsal: "si" o "no"
        const corresponsal = (autor.esAutorCorresponsal || autor.corresponsal) ? 'si' : 'no';
        corresponsalesArray.push(corresponsal);
        
        // PDFs - verificar si ya fue subido previamente
        if (vinculo === 'uncp') {
          if (autor.pdfId && autor.pdfUrl) {
            // El PDF ya fue subido, renombrarlo y moverlo a la subcarpeta
            try {
              const file = DriveApp.getFileById(autor.pdfId);
              
              // Generar nuevo nombre: autor_X_timestamp_NombreAutor_sustentoVinculo.pdf
              const nombreAutorLimpio = limpiarTexto(autor.nombre || '');
              const nuevoNombre = `autor_${index + 1}_${timestamp}_${nombreAutorLimpio}_sustentoVinculo.pdf`;
              
              // Renombrar y mover
              file.setName(nuevoNombre);
              file.moveTo(subcarpeta);
              
              // Actualizar URL después del movimiento
              enlacesPDFsArray.push(file.getUrl());
              pdfIDsArray.push(autor.pdfId);
            } catch (moveError) {
              Logger.log(`Error moviendo PDF del autor ${index + 1}: ${moveError.toString()}`);
              enlacesPDFsArray.push(autor.pdfUrl); // Mantener URL aunque no se movió
              pdfIDsArray.push(autor.pdfId);
            }
          } else if (autor.pdfVerificacion && autor.pdfFileName) {
            // Modo legacy: PDF viene en Base64 (por si acaso)
            try {
              const pdfInfo = guardarPDF(autor.pdfVerificacion, autor.pdfFileName, subcarpeta);
              enlacesPDFsArray.push(pdfInfo.fileUrl);
              pdfIDsArray.push(pdfInfo.fileId);
            } catch (pdfError) {
              Logger.log(`Error guardando PDF del autor ${index + 1}: ${pdfError.toString()}`);
              enlacesPDFsArray.push('error');
              pdfIDsArray.push('error');
            }
          } else {
            enlacesPDFsArray.push('ninguno');
            pdfIDsArray.push('ninguno');
          }
        } else {
          // Autores externos no requieren PDF
          enlacesPDFsArray.push('ninguno');
          pdfIDsArray.push('ninguno');
        }
      });
    }
    
    // Convertir arrays a strings separados por punto y coma
    const autoresString = autoresArray.join(';');
    const afiliacionesString = afiliacionesArray.join(';');
    const vinculosString = vinculosArray.join(';');
    const corresponsalesString = corresponsalesArray.join(';');
    const enlacesPDFsString = enlacesPDFsArray.join(';');
    const pdfIDsString = pdfIDsArray.join(';');
    
    // Obtener año de publicación (ya viene como año simple desde el frontend)
    const anio = publicacion.fecha || '';
    
    // Preparar datos para insertar (18 columnas - ID es la primera)
    const rowData = [
      postulacionID, // ID
      new Date(), // Fecha Postulación
      data.nombres || '', // Nombres
      data.apellidos || '', // Apellidos
      data.email || '', // Email
      pdfDJUrl, // PDF Declaración Jurada
      pdfDJId, // PDF DJ ID
      publicacion.doi || '', // DOI
      publicacion.titulo || '', // Título
      autoresString, // Autores
      afiliacionesString, // Afiliaciones
      vinculosString, // Vínculos
      corresponsalesString, // Corresponsales
      anio, // Año Publicación
      enlacesPDFsString, // Enlaces PDFs Autores
      pdfIDsString, // PDF IDs Autores
      'Pendiente', // Estado
      '' // Observaciones
    ];
    
    // Insertar datos
    const nuevaFila = sheet.getLastRow() + 1;
    sheet.appendRow(rowData);
    
    // Formatear la columna del PDF de Declaración Jurada como hipervínculo
    if (pdfDJUrl !== 'ninguno' && pdfDJUrl !== 'error') {
      const columnaDJ = 6; // Columna F (PDF Declaración Jurada)
      const celdaDJ = sheet.getRange(nuevaFila, columnaDJ);
      celdaDJ.setFormula(`=HYPERLINK("${pdfDJUrl}"; "${postulacionID}_dj.pdf")`);
    }
    
    // Formatear la columna de Enlaces PDFs Autores con formato simple: a1_ninguno; a2_enlace; etc.
    if (enlacesPDFsArray.length > 0) {
      const columnaEnlacesPDFs = 15; // Columna O (Enlaces PDFs Autores)
      const celda = sheet.getRange(nuevaFila, columnaEnlacesPDFs);
      
      // Crear lista simple con prefijo a1_, a2_, etc.
      let enlaces = [];
      enlacesPDFsArray.forEach((url, idx) => {
        const prefijo = `a${idx + 1}_`;
        if (url !== 'ninguno' && url !== 'error') {
          enlaces.push(`${prefijo}${url}`);
        } else {
          enlaces.push(`${prefijo}${url}`);
        }
      });
      
      // Unir con punto y coma
      celda.setValue(enlaces.join('; '));
      celda.setWrap(true); // Habilitar ajuste de texto
    }
    
    // Enviar email de confirmación
    const emailEnviado = enviarEmailConfirmacion(
      data.email,
      data.nombres,
      data.apellidos, 
      publicacion.titulo || '',
      publicacion.doi || '',
      autoresString,
      postulacionID,
      anio
    );
    
    return createResponse(true, 'Postulación guardada exitosamente', {
      rowNumber: sheet.getLastRow(),
      totalAutores: autoresData.length,
      carpetaUrl: subcarpeta.getUrl(),
      emailEnviado: emailEnviado
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
function enviarEmailConfirmacion(email, nombres, apellidos, titulo, doi, autores, postulacionID, anio) {
  try {
    const subject = `Confirmación de Postulación ${postulacionID} - II Premio de Excelencia Científica UNCP 2025`;
    
    // Separar autores por punto y coma para mostrarlos en lista
    const listaAutores = autores.split(';').map(a => `<li>${a.trim()}</li>`).join('');
    
    const htmlBody = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 650px; margin: 0 auto; background: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 30px 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">II Premio de Excelencia Científica UNCP 2025</h1>
          <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 14px;">Universidad Nacional del Centro del Perú</p>
        </div>
        
        <!-- Body -->
        <div style="padding: 30px 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
          <div style="background: #10b981; color: white; padding: 12px 20px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
            <strong style="font-size: 16px;">✓ Postulación Recibida Exitosamente</strong>
          </div>
          
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">Estimado/a <strong>${nombres} ${apellidos}</strong>,</p>
          
          <p style="color: #374151; font-size: 14px; line-height: 1.6;">
            Su postulación ha sido registrada correctamente en nuestro sistema. A continuación, encontrará los detalles de su envío:
          </p>
          
          <!-- Datos de la Postulación -->
          <div style="background: #f9fafb; padding: 20px; border-left: 4px solid #3b82f6; margin: 25px 0; border-radius: 6px;">
            <h3 style="color: #1e3a8a; margin: 0 0 15px 0; font-size: 16px;">Datos de la Postulación</h3>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 140px;"><strong>Código:</strong></td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px;"><strong style="color: #3b82f6; font-size: 16px;">${postulacionID}</strong></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;"><strong>Título:</strong></td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px;">${titulo}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;"><strong>DOI:</strong></td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px;"><a href="https://doi.org/${doi}" style="color: #3b82f6; text-decoration: none;">${doi}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;"><strong>Año:</strong></td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px;">${anio || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px; vertical-align: top;"><strong>Autores:</strong></td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px;">
                  <ul style="margin: 0; padding-left: 20px;">
                    ${listaAutores}
                  </ul>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;"><strong>Estado:</strong></td>
                <td style="padding: 8px 0;">
                  <span style="background: #fef3c7; color: #92400e; padding: 4px 12px; border-radius: 12px; font-size: 13px; font-weight: 600;">Pendiente de revisión</span>
                </td>
              </tr>
            </table>
          </div>
          
          <!-- Próximos Pasos -->
          <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h3 style="color: #1e40af; margin: 0 0 12px 0; font-size: 15px;">📅 Próximos Pasos</h3>
            <ol style="margin: 0; padding-left: 20px; color: #1e40af; font-size: 14px; line-height: 1.8;">
              <li>Su postulación será evaluada por el Comité de Excelencia Científica</li>
              <li>Le notificaremos sobre cualquier actualización del estado</li>
              <li>Los resultados finales serán comunicados vía correo electrónico</li>
            </ol>
          </div>
          
          <!-- Información Adicional -->
          <div style="background: #fef9c3; border-left: 4px solid #eab308; padding: 15px; border-radius: 6px; margin: 25px 0;">
            <p style="margin: 0; color: #713f12; font-size: 13px; line-height: 1.6;">
              <strong>⚠️ Importante:</strong> Conserve este correo como comprobante de su postulación. 
              El código <strong>${postulacionID}</strong> identifica su envío de manera única.
            </p>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-top: 30px;">
            Si tiene alguna consulta, no dude en contactarnos.
          </p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #374151; font-size: 14px; margin: 0;">Saludos cordiales,</p>
            <p style="color: #1e3a8a; font-weight: 600; font-size: 14px; margin: 5px 0;">Comité de Excelencia Científica</p>
            <p style="color: #6b7280; font-size: 13px; margin: 5px 0;">Vicerrectorado de Investigación</p>
            <p style="color: #6b7280; font-size: 13px; margin: 5px 0;">Universidad Nacional del Centro del Perú</p>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
          <p style="margin: 0;">Este es un mensaje automático, por favor no responda a este correo.</p>
          <p style="margin: 5px 0 0 0;">© 2025 Universidad Nacional del Centro del Perú</p>
        </div>
      </div>
    `;
    
    MailApp.sendEmail({
      to: email,
      subject: subject,
      htmlBody: htmlBody
    });
    
    return true;
  } catch (error) {
    console.error('Error enviando email:', error);
    return false;
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
  
  // Columna 17 = Estado (con columnas ID y DJ ahora es la 17)
  sheet.getRange(rowNumber, 17).setValue(nuevoEstado);
  
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
 * Limpia un texto removiendo tildes, espacios y convirtiéndolo a CamelCase
 */
function limpiarTexto(texto) {
  if (!texto) return '';
  
  // Remover tildes
  const sinTildes = texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  
  // Convertir a CamelCase y remover espacios
  const palabras = sinTildes.split(/\s+/);
  const camelCase = palabras
    .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase())
    .join('');
  
  return camelCase;
}

/**
 * Genera el siguiente ID correlativo (p-001, p-002, etc.)
 */
function generarSiguienteID(sheet) {
  const lastRow = sheet.getLastRow();
  
  if (lastRow <= 1) {
    // Primera postulación
    return 'p-001';
  }
  
  // Obtener el último ID
  const ultimoID = sheet.getRange(lastRow, 1).getValue();
  
  if (!ultimoID || typeof ultimoID !== 'string') {
    return 'p-001';
  }
  
  // Extraer número del ID (p-001 -> 001)
  const numero = parseInt(ultimoID.split('-')[1]) || 0;
  const siguienteNumero = numero + 1;
  
  // Formatear con ceros a la izquierda
  return 'p-' + String(siguienteNumero).padStart(3, '0');
}

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
