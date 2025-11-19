# 🔄 CAMBIOS IMPLEMENTADOS: Afiliación, Vínculo Laboral y Autor Corresponsal

## 📋 Resumen de Cambios

Se ha implementado la separación de campos distintos en la sección de autores:

### ✅ **ANTES** (versión anterior)
- ❌ Un solo campo: "Afiliación declarada en el artículo"
- ❌ Al seleccionar UNCP aparecía la opción de cargar PDF

### ✅ **AHORA** (versión actualizada)
- ✅ **Campo 1:** "Afiliación declarada en el artículo" (sin PDF)
- ✅ **Campo 2:** "Vínculo laboral vigente" (con PDF solo si es UNCP)
- ✅ **Campo 3:** "Autor corresponsal" (checkbox para marcar si es corresponsal)

---

## 🔧 Cambios Técnicos Implementados

### 1. **Frontend (form_google_apps_script.html)**

#### Nuevos campos en la interfaz:
```html
<!-- Campo 1: Afiliación declarada -->
<select id="afiliacionDeclarada_${index}">
    <option value="UNCP">UNCP (Universidad Nacional del Centro del Perú)</option>
    <option value="EXTERNO">Externo (otra institución)</option>
</select>

<!-- Campo 2: Vínculo laboral vigente -->
<select id="vinculoLaboral_${index}" onchange="togglePdfUpload(${index})">
    <option value="UNCP">UNCP (Universidad Nacional del Centro del Perú)</option>
    <option value="EXTERNO">Externo (otra institución)</option>
</select>

<!-- Campo 3: Autor corresponsal -->
<input type="checkbox" id="autorCorresponsal_${index}">
<label>Es autor corresponsal declarado en la publicación</label>

<!-- PDF solo para vínculo laboral UNCP -->
<div id="pdfContainer_${index}" class="hidden">
    <input type="file" id="pdfAutor_${index}" accept=".pdf">
</div>
```

#### Funciones JavaScript actualizadas:
- `generarListaAutores()` - Incluye los tres campos
- `togglePdfUpload()` - Solo muestra PDF para vínculo laboral UNCP
- `validarPostulanteEsAutorUNCP()` - Valida afiliación O vínculo laboral
- `validarAlMenosUnAutorUNCP()` - Requiere al menos uno con UNCP
- `enviarPostulacion()` - Recopila datos de los tres campos

### 2. **Backend (Code.gs)**

#### Nuevas columnas en Google Sheets:
```javascript
const headers = [
    // ... otros campos ...
    'Autores Afiliación UNCP',    // NUEVO: autores con afiliación UNCP
    'Autores Vínculo UNCP',       // NUEVO: autores con vínculo laboral UNCP
    'Autores Corresponsales',     // NUEVO: autores corresponsales
    'Autores Externos',           // ACTUALIZADO: sin afiliación ni vínculo UNCP
    // ... otros campos ...
];
```

#### Procesamiento de datos actualizado:
```javascript
// Separación por categorías
const autoresAfiliacionUNCP = []; // Afiliación declarada = UNCP
const autoresVinculoUNCP = [];    // Vínculo laboral = UNCP
const autoresCorresponsales = []; // Autores corresponsales
const autoresExternos = [];       // Sin conexión UNCP

// Procesar autor corresponsal
if (autor.esAutorCorresponsal === true || autor.esAutorCorresponsal === 'true') {
    autoresCorresponsales.push(autor.nombre);
}

// Solo guardar PDF para vínculo laboral UNCP
if (autor.vinculoLaboral === 'UNCP' && autor.pdfVerificacion) {
    const pdfInfo = guardarPDF(autor.pdfVerificacion, autor.pdfFileName, subcarpeta);
    pdfsUrls.push(`${autor.nombre}: ${pdfInfo.fileUrl}`);
}
```

#### Email de confirmación actualizado:
```javascript
const body = `
...
Número de autores con afiliación UNCP declarada en el artículo: ${numAutoresAfiliacion}
Número de autores con vínculo laboral vigente UNCP: ${numAutoresVinculo}
Número de autores corresponsales: ${numAutoresCorresponsales}
...
`;
```

---

## 🎯 Flujo de Usuario Actualizado

### **Paso 1:** Seleccionar afiliación declarada
- Usuario selecciona si en el artículo el autor aparece con afiliación UNCP o externa
- ❌ **NO se solicita PDF** en este paso

### **Paso 2:** Seleccionar vínculo laboral vigente
- Usuario selecciona si actualmente tiene vínculo laboral con UNCP o es externo
- ✅ **Solo aquí se solicita PDF** si selecciona UNCP

### **Paso 3:** Marcar autor corresponsal (opcional)
- Checkbox para indicar si el autor es corresponsal en la publicación
- ❌ **No requiere PDF adicional**

### **Paso 4:** Cargar documento de verificación
- Aparece campo de PDF **únicamente** si vínculo laboral = UNCP
- Tipos de documentos: constancia laboral, resolución, contrato, etc.

---

## 📊 Datos Registrados en Google Sheets

### Columnas del Google Sheet:
1. **Autores del Artículo:** Lista completa con información detallada
   - Formato: `Nombre (Afiliación: UNCP) (Vínculo: UNCP) (Corresponsal)`
2. **Autores Afiliación UNCP:** Autores que en el paper aparecen con afiliación UNCP
3. **Autores Vínculo UNCP:** Autores que actualmente trabajan en UNCP (con PDF)
4. **Autores Corresponsales:** Autores marcados como corresponsales
5. **Autores Externos:** Autores sin afiliación ni vínculo UNCP
6. **URLs PDFs Verificación:** Solo documentos de vínculo laboral UNCP

### En Google Drive se almacena:
- Carpeta individual por postulación
- PDFs de verificación de vínculo laboral (solo autores con vínculo UNCP vigente)

---

## 🔍 Validaciones Implementadas

### ✅ Validaciones Frontend:
- Los tres campos obligatorios para cada autor (afiliación, vínculo, corresponsal opcional)
- PDF obligatorio solo para vínculo laboral UNCP
- Al menos un autor debe tener afiliación UNCP O vínculo laboral UNCP
- El postulante debe estar entre los autores con conexión UNCP

### ✅ Validaciones Backend:
- Verificación de estructura de datos (incluye campo corresponsal)
- Validación de archivos PDF (tamaño, formato)
- Control de duplicados por DOI
- Logging de errores detallado

---

## 🚀 Beneficios de los Cambios

1. **Claridad conceptual:** Separa la afiliación académica del vínculo laboral actual
2. **Identificación de corresponsales:** Registro claro de autores corresponsales
3. **Reducción de documentos:** Solo se solicita PDF para verificar vínculo laboral vigente
4. **Flexibilidad:** Permite casos donde la afiliación del paper no coincide con el vínculo actual
5. **Mejor trazabilidad:** Registro separado de tres tipos de información
6. **Proceso más ágil:** Menos requisitos documentales para completar el formulario

---

## 📝 Ejemplos Prácticos

### Caso 1: Autor con afiliación UNCP, vínculo UNCP y es corresponsal
- **Afiliación declarada:** UNCP
- **Vínculo laboral vigente:** UNCP
- **Autor corresponsal:** ✅ SÍ
- **PDF requerido:** ✅ SÍ (para vínculo laboral)

### Caso 2: Autor con afiliación externa, vínculo UNCP y no corresponsal
- **Afiliación declarada:** EXTERNO
- **Vínculo laboral vigente:** UNCP  
- **Autor corresponsal:** ❌ NO
- **PDF requerido:** ✅ SÍ (para vínculo laboral)

### Caso 3: Autor con afiliación UNCP, sin vínculo actual pero es corresponsal
- **Afiliación declarada:** UNCP
- **Vínculo laboral vigente:** EXTERNO
- **Autor corresponsal:** ✅ SÍ
- **PDF requerido:** ❌ NO

### Caso 4: Autor completamente externo pero corresponsal
- **Afiliación declarada:** EXTERNO
- **Vínculo laboral vigente:** EXTERNO
- **Autor corresponsal:** ✅ SÍ
- **PDF requerido:** ❌ NO

---

## 🔧 Archivos Modificados

- ✅ `google-apps-script/Code.gs` - Backend de Google Apps Script
- ✅ `form_google_apps_script.html` - Frontend del formulario

Los cambios son **compatibles hacia atrás** y no afectan postulaciones anteriores.

---

## 📋 Estructura Final del Google Sheet

| Columna | Descripción |
|---------|-------------|
| Fecha Postulación | Timestamp de la postulación |
| Nombres | Nombre del postulante |
| Apellidos | Apellidos del postulante |
| Email | Correo electrónico |
| Facultad | Facultad del postulante |
| Teléfono | Número de contacto |
| DOI | Identificador del artículo |
| Título Artículo | Título de la publicación |
| Autores del Artículo | Lista completa con detalles |
| **Autores Afiliación UNCP** | **NUEVO: Autores con afiliación UNCP en el paper** |
| **Autores Vínculo UNCP** | **NUEVO: Autores con vínculo laboral actual UNCP** |
| **Autores Corresponsales** | **NUEVO: Autores corresponsales** |
| Autores Externos | Autores sin conexión UNCP |
| Revista | Nombre de la revista |
| Editorial | Editorial de la publicación |
| Fecha Publicación | Fecha de publicación |
| URLs PDFs Verificación | Enlaces a documentos de verificación |
| Estado | Estado de la postulación |
| ID Carpeta Drive | Identificador de la carpeta |