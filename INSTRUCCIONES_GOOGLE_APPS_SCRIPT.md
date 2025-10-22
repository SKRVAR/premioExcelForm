# 📚 Guía Completa: Implementar Formulario con Google Apps Script

## 🎯 ¿Qué vas a lograr?

✅ Formulario web personalizado que guarda datos automáticamente  
✅ Archivos PDF almacenados en Google Drive  
✅ Datos en Google Sheets (como una base de datos)  
✅ Email automático de confirmación  
✅ **100% GRATIS** - Sin costos de hosting ni base de datos  

---

## 📋 Paso 1: Configurar Google Apps Script

### 1.1. Crear el Proyecto

1. Ve a [https://script.google.com/](https://script.google.com/)
2. Haz clic en **"Nuevo proyecto"**
3. Renombra el proyecto a: `Premio Excelencia UNCP Backend`

### 1.2. Pegar el Código

1. En el editor, borra todo el código por defecto
2. Abre el archivo `google-apps-script/Code.gs` de este proyecto
3. Copia todo el contenido y pégalo en el editor de Google Apps Script
4. Guarda el proyecto (Ctrl + S o File > Save)

---

## ⚙️ Paso 2: Inicializar el Sistema

### 2.1. Ejecutar función de inicialización

1. En el menú superior, selecciona la función: **`inicializarProyecto`**
2. Haz clic en el botón **"Ejecutar"** (▶️)
3. Se te pedirá autorizar los permisos:
   - Haz clic en **"Revisar permisos"**
   - Selecciona tu cuenta de Google
   - Haz clic en **"Avanzado"**
   - Haz clic en **"Ir a [nombre del proyecto] (no seguro)"**
   - Haz clic en **"Permitir"**

### 2.2. Verificar la ejecución

1. Ve a **"Ver" > "Registros"** (o Ctrl + Enter)
2. Deberías ver algo como:

```
✅ Proyecto inicializado correctamente
📁 ID de carpeta: 1abc...xyz
📊 ID de hoja: 1def...uvw
🔗 URL de hoja: https://docs.google.com/spreadsheets/d/...
```

3. **GUARDA ESTOS DATOS** - Los necesitarás después

---

## 🌐 Paso 3: Publicar como Web App

### 3.1. Implementar

1. Haz clic en **"Implementar"** > **"Nueva implementación"**
2. Haz clic en el ícono de engranaje ⚙️ junto a "Seleccionar tipo"
3. Selecciona **"Aplicación web"**
4. Configura:
   - **Descripción**: `Formulario Premio Excelencia v1`
   - **Ejecutar como**: `Yo (tu email)`
   - **Quién tiene acceso**: `Cualquier persona`
5. Haz clic en **"Implementar"**
6. **COPIA LA URL** que aparece (será algo como):
   ```
   https://script.google.com/macros/s/ABC123.../exec
   ```

---

## 🔗 Paso 4: Conectar el Formulario HTML

### 4.1. Editar el archivo HTML

1. Abre el archivo `form_google_apps_script.html`
2. Busca la línea (aproximadamente línea 28):
   ```javascript
   const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/TU_SCRIPT_ID_AQUI/exec';
   ```
3. Reemplaza `TU_SCRIPT_ID_AQUI` con la URL que copiaste en el Paso 3.1
4. Guarda el archivo

### 4.2. Probar localmente

1. Abre el archivo `form_google_apps_script.html` en tu navegador
2. Intenta buscar un DOI (por ejemplo: `10.1038/nature12373`)
3. Completa el formulario
4. Sube un PDF de prueba
5. Envía el formulario

---

## ✅ Paso 5: Verificar que Funciona

### 5.1. Verificar Google Sheets

1. Ve a [Google Drive](https://drive.google.com/)
2. Busca la carpeta **"Premio Excelencia UNCP - Postulaciones 2025"**
3. Abre la hoja de cálculo **"Postulaciones Premio Excelencia 2025"**
4. Deberías ver tu postulación de prueba

### 5.2. Verificar Google Drive

1. En la misma carpeta, deberías ver el PDF que subiste
2. Haz clic derecho > "Obtener enlace" para verificar que sea accesible

### 5.3. Verificar Email

1. Revisa tu bandeja de entrada
2. Deberías tener un email de confirmación

---

## 🚀 Paso 6: Publicar tu Formulario

Tienes varias opciones:

### Opción 1: GitHub Pages (Gratis)

1. Sube `form_google_apps_script.html` a un repositorio de GitHub
2. Activa GitHub Pages en la configuración del repositorio
3. Tu formulario estará en: `https://tu-usuario.github.io/tu-repo/form_google_apps_script.html`

### Opción 2: Netlify/Vercel (Gratis)

1. Crea una cuenta en [Netlify](https://www.netlify.com/) o [Vercel](https://vercel.com/)
2. Arrastra y suelta el archivo HTML
3. ¡Listo! Te darán una URL pública

### Opción 3: Google Sites

1. Crea un nuevo sitio en [Google Sites](https://sites.google.com/)
2. Inserta un elemento **"Insertar código"**
3. Pega todo el contenido del HTML
4. Publica el sitio

---

## 📊 Panel de Administración

### Ver todas las postulaciones

1. Abre tu Google Sheet
2. Todas las postulaciones aparecerán automáticamente
3. Puedes:
   - Filtrar por facultad
   - Exportar a Excel
   - Crear gráficos
   - Compartir con el comité evaluador

### Actualizar estado de postulación

En el Google Sheet, simplemente edita la columna **"Estado"**:
- `Pendiente`
- `En revisión`
- `Aceptada`
- `Rechazada`

### Descargar archivos PDF

Cada fila tiene un enlace en la columna **"URL PDF"**. Haz clic para:
- Ver el PDF en el navegador
- Descargarlo
- Compartirlo

---

## 🔧 Solución de Problemas

### ❌ Error: "No se pudo enviar el formulario"

**Solución:**
1. Verifica que la URL del script esté correcta
2. Asegúrate de que la implementación esté como "Cualquier persona"
3. Revisa los registros en Google Apps Script (Ver > Registros)

### ❌ Error: "El archivo no se subió"

**Solución:**
1. Verifica que el archivo sea menor a 10 MB
2. Asegúrate de que sea un PDF válido
3. Revisa los permisos de la carpeta de Drive

### ❌ No llega el email de confirmación

**Solución:**
1. Revisa la carpeta de SPAM
2. Verifica que `MailApp.sendEmail` no esté comentado en el código
3. Comprueba que el email del formulario sea válido

### ❌ Error de CORS

**Solución:**
1. Google Apps Script maneja CORS automáticamente
2. Si usas un dominio local, prueba abriendo el HTML directamente (doble clic)
3. O usa una extensión de navegador para deshabilitar CORS temporalmente

---

## 📈 Límites y Cuotas de Google

Google Apps Script tiene límites generosos en la versión gratuita:

| Recurso | Límite Gratuito |
|---------|-----------------|
| Envíos por día | 20,000 |
| Almacenamiento Drive | 15 GB |
| Emails por día | 100 |
| Tiempo de ejecución | 6 min/ejecución |

Para la mayoría de convocatorias universitarias, estos límites son más que suficientes.

---

## 🎨 Personalización

### Cambiar colores

Edita las clases de Tailwind en el HTML:
```html
<!-- Azul a Verde -->
bg-blue-600 → bg-green-600
text-blue-600 → text-green-600
```

### Agregar campos al formulario

1. Agrega el campo en el HTML
2. Actualiza el objeto `formData` en JavaScript
3. Agrega la columna en `inicializarProyecto()` en Code.gs
4. Agrega el campo en `rowData` en la función `handleFormSubmission()`

### Cambiar el email de confirmación

Edita la función `enviarEmailConfirmacion()` en Code.gs

---

## 🆚 Comparación con Firebase

| Característica | Google Apps Script | Firebase |
|----------------|-------------------|----------|
| **Costo** | ✅ Siempre gratis | ⚠️ Requiere tarjeta |
| **Configuración** | ✅ 10 minutos | ⚠️ 30+ minutos |
| **Ver datos** | ✅ Google Sheets (fácil) | ⚠️ Consola compleja |
| **Exportar** | ✅ Botón "Descargar Excel" | ⚠️ Requiere código |
| **Archivos** | ✅ Google Drive | ✅ Firebase Storage |
| **Límites** | ✅ Muy generosos | ⚠️ Más restrictivos gratis |

---

## 📞 Soporte

Si tienes problemas:

1. Revisa los **Registros** en Google Apps Script
2. Abre la **Consola del navegador** (F12) y busca errores
3. Verifica que todos los pasos se completaron correctamente
4. Intenta crear una nueva implementación del Web App

---

## ✨ Funcionalidades Adicionales (Opcionales)

### Notificar al administrador

Agrega esto en `handleFormSubmission()`:

```javascript
// Después de guardar en Sheets
MailApp.sendEmail({
  to: 'admin@uncp.edu.pe',
  subject: 'Nueva postulación recibida',
  body: `Nueva postulación de ${data.nombres} ${data.apellidos}`
});
```

### Generar PDF automático con los datos

Usa `DocumentApp` para crear un PDF resumen

### Integrar con Google Calendar

Crea eventos automáticos para revisiones

---

## 🎉 ¡Listo!

Ahora tienes un sistema completo de formularios sin necesidad de:
- ❌ Servidores propios
- ❌ Bases de datos pagas
- ❌ Conocimientos avanzados de backend
- ❌ Costos de hosting

Todo funciona con las herramientas gratuitas de Google. 🚀
