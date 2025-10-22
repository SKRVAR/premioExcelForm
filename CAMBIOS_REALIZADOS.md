# Cambios Realizados en el Formulario de Postulación

## Resumen de Cambios

Se ha actualizado el formulario de postulación para incluir la gestión de múltiples autores con verificación de afiliación UNCP y **validación de DOI duplicado**.

---

## 🆕 Nueva Funcionalidad: Validación de Artículos Duplicados

### ⚠️ Control Anti-Duplicados Implementado

Después de obtener los metadatos del DOI, el sistema ahora:

1. **Verifica automáticamente** si el DOI o título del artículo ya fue registrado
2. **Compara** con todas las postulaciones previas en Google Sheets
3. **Bloquea la postulación** si encuentra un duplicado
4. **Muestra información completa** del postulante previo

### 📊 Información Mostrada al Detectar Duplicado:

- ✅ Fecha y hora de la postulación previa
- ✅ Nombre completo del postulante anterior
- ✅ Email de contacto
- ✅ Facultad
- ✅ Teléfono
- ✅ DOI y título del artículo
- ✅ Lista de autores UNCP registrados
- ✅ Estado actual de la postulación (Pendiente/Aprobado/Rechazado)

### 🎨 Interfaz de Usuario:

Cuando se detecta un duplicado:
- Se muestra un **mensaje de alerta rojo** prominente
- Se presenta una **tarjeta informativa** con todos los datos del postulante previo
- Se incluye una **nota informativa** sugiriendo contactar al administrador
- Botón para **"Buscar otro artículo"** y reiniciar el proceso

---

## 📋 Cambios en la Sección 2 - Datos del Postulante

### ✅ Campos que permanecen:
- Nombres
- Apellidos
- Email
- Facultad
- Teléfono Celular

### ❌ Campos eliminados:
- Escuela Profesional
- PDF del artículo completo (ya no es necesario porque se usa el DOI)

---

## 🆕 Nueva Sección 3 - Autores del Artículo

### Funcionalidad:
1. **Lista automática de autores**: Se obtienen todos los autores del artículo mediante el DOI desde la API de Crossref
2. **Para cada autor se muestra**:
   - Nombre completo
   - Campo desplegable de afiliación (UNCP / Externo)
   - Si selecciona UNCP: campo para subir PDF de verificación de vínculo

### Validaciones implementadas:
- ✅ Todos los autores deben tener una afiliación seleccionada
- ✅ Cada autor UNCP debe tener su PDF de verificación (máx 10 MB)
- ✅ Debe haber al menos un autor con afiliación UNCP
- ✅ El postulante debe ser uno de los autores UNCP (validación por nombre)

---

## 🔧 Actualización del Backend (Google Apps Script)

### Archivo: `google-apps-script/Code.gs`

#### Cambios en la estructura de datos:

**Antes:**
```
Escuela, DOI, Título, Autores, URL PDF, Nombre Archivo
```

**Ahora:**
```
Teléfono, DOI, Título, Autores del Artículo, Autores UNCP, Autores Externos, URLs PDFs Verificación
```

#### Nuevas funcionalidades:

1. **Carpetas por postulación**: 
   - Cada postulación crea una subcarpeta en Google Drive
   - Los PDFs de verificación se guardan en esa subcarpeta
   - Formato: `Apellidos_Nombres_timestamp`

2. **Procesamiento de autores**:
   - Se separan autores UNCP y externos
   - Se guarda el PDF de cada autor UNCP
   - Se registran las URLs de todos los PDFs

3. **Email de confirmación mejorado**:
   - Incluye el número de autores UNCP registrados

---

## 📝 Instrucciones para Actualizar Google Apps Script

### Paso 1: Abrir el proyecto en Google Apps Script
1. Ve a https://script.google.com/
2. Abre tu proyecto existente "Premio Excelencia UNCP"

### Paso 2: Actualizar el código
1. Reemplaza **TODO** el contenido del archivo `Code.gs` con el nuevo código
2. El nuevo código está en: `google-apps-script/Code.gs`

### Paso 3: Actualizar la hoja de cálculo (IMPORTANTE)
Como cambiaron las columnas, tienes dos opciones:

#### Opción A - Crear nueva hoja (recomendado si no tienes datos):
1. Ejecuta la función `inicializarProyecto()` nuevamente
2. Se creará una nueva hoja con los nuevos encabezados
3. Actualiza el SHEET_ID en las propiedades del script

#### Opción B - Actualizar hoja existente (si tienes datos previos):
1. Abre tu hoja de Google Sheets
2. Modifica los encabezados manualmente para que coincidan:
   ```
   Fecha Postulación | Nombres | Apellidos | Email | Facultad | 
   Teléfono | DOI | Título Artículo | Autores del Artículo | 
   Autores UNCP | Autores Externos | Revista | Editorial | 
   Fecha Publicación | URLs PDFs Verificación | Estado | ID Carpeta Drive
   ```

### Paso 4: Volver a publicar el Web App
1. Click en "Implementar" > "Administrar implementaciones"
2. Click en el ícono de lápiz en la implementación activa
3. En "Nueva descripción" escribe algo como "v2 - con autores múltiples"
4. Click en "Implementar"
5. Copia la nueva URL (debería ser la misma)

### Paso 5: Verificar
1. Prueba el formulario con un DOI real
2. Verifica que se creen las subcarpetas en Drive
3. Confirma que los datos se guarden correctamente en la hoja

---

## 🎯 Flujo Completo del Usuario

1. **Sección 1**: Ingresa el DOI del artículo
   - El sistema obtiene automáticamente título, autores, revista, etc.

2. **Sección 2**: Completa sus datos personales
   - Nombres, Apellidos, Email, Facultad, Teléfono

3. **Sección 3**: Configura los autores del artículo
   - Para cada autor listado:
     - Selecciona si es UNCP o Externo
     - Si es UNCP: sube PDF de verificación de vínculo

4. **Validación y Envío**:
   - El sistema valida que el postulante sea uno de los autores UNCP
   - Envía todos los datos y PDFs a Google Drive
   - Registra la información en Google Sheets
   - Envía email de confirmación

---

## 📊 Datos que se guardan en Google Sheets

Por cada postulación se registra:

| Campo | Descripción |
|-------|-------------|
| Fecha Postulación | Timestamp automático |
| Nombres | Del postulante |
| Apellidos | Del postulante |
| Email | Del postulante |
| Facultad | Del postulante |
| Teléfono | Del postulante |
| DOI | Del artículo |
| Título Artículo | Obtenido del DOI |
| Autores del Artículo | Lista completa con afiliación |
| Autores UNCP | Solo los autores UNCP |
| Autores Externos | Solo los autores externos |
| Revista | Donde se publicó |
| Editorial | Del artículo |
| Fecha Publicación | Del artículo |
| URLs PDFs Verificación | Links a cada PDF en Drive |
| Estado | Pendiente (inicial) |
| ID Carpeta Drive | ID de la subcarpeta creada |

---

## 🔍 Puntos Importantes

1. **No se sube el PDF del artículo completo**: Ahora solo se necesita el DOI
2. **Múltiples PDFs**: Se pueden subir varios PDFs (uno por cada autor UNCP)
3. **Organización en Drive**: Cada postulación tiene su propia carpeta
4. **Validación estricta**: El postulante DEBE ser uno de los autores UNCP

---

## ❓ Preguntas Frecuentes

**P: ¿Qué pasa si el DOI no tiene autores en los metadatos?**
R: El sistema mostrará un mensaje indicando que no hay autores disponibles. Se debe verificar el DOI.

**P: ¿Cómo se valida que el postulante es un autor UNCP?**
R: Se compara el nombre y apellido del postulante con los nombres de los autores marcados como UNCP (validación aproximada).

**P: ¿Puedo tener un artículo con solo autores externos?**
R: No, el sistema requiere que al menos un autor tenga afiliación UNCP.

**P: ¿Qué documentos son válidos para verificar el vínculo UNCP?**
R: Cualquier PDF que demuestre la relación con la UNCP (constancia laboral, resolución, carta, etc.). El comité evaluador determinará la validez.

---

## 📧 Soporte

Si tienes problemas con la actualización:
1. Revisa que el código de `Code.gs` esté completo
2. Verifica que los permisos estén correctamente otorgados
3. Revisa los logs en Google Apps Script (Ver > Registros)
4. Prueba con un DOI conocido (ej: 10.1038/nature12373)

---

**Fecha de actualización**: 22 de octubre de 2025
**Versión**: 2.0
