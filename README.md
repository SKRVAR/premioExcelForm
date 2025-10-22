# 🏆 Sistema de Postulación - Premio Excelencia UNCP

Sistema web completo para la gestión de postulaciones al Premio Excelencia de la Universidad Nacional del Centro del Perú (UNCP). Permite a los investigadores postular sus publicaciones científicas y a los administradores gestionar las postulaciones de manera eficiente.

## 🌟 Características

### Para Postulantes:
- ✅ Búsqueda automática de metadatos de publicaciones mediante DOI (CrossRef API)
- ✅ Formulario intuitivo para datos del postulante
- ✅ Carga de archivos PDF (artículo completo)
- ✅ Validación de datos en tiempo real
- ✅ Confirmación de envío exitoso

### Para Administradores:
- 📊 Panel administrativo completo
- 📈 Estadísticas en tiempo real (pendientes, aprobados, rechazados)
- 🔍 Búsqueda y filtros avanzados
- 📄 Visualización de PDFs cargados
- 🔄 Cambio de estado de postulaciones
- 📥 Exportación a CSV
- 🔐 Sistema de autenticación seguro

## 🚀 Demo en Vivo

- **Formulario de Postulación**: [https://tu-usuario.github.io/premio-excelencia-uncp/form.html](https://tu-usuario.github.io/premio-excelencia-uncp/form.html)
- **Panel Administrativo**: [https://tu-usuario.github.io/premio-excelencia-uncp/admin.html](https://tu-usuario.github.io/premio-excelencia-uncp/admin.html)

## 📁 Estructura del Proyecto

```
forms/
├── form.html                      # Formulario de postulación (público)
├── admin.html                     # Panel administrativo (requiere autenticación)
├── INSTRUCCIONES_FIREBASE.md      # Guía completa de configuración
# 📋 Formulario Premio Excelencia UNCP 2025

Sistema completo de formulario web para postulaciones al Premio a la Excelencia Científica UNCP, implementado con **Google Apps Script**.

## 🌟 Características

✅ Formulario web personalizado y elegante  
✅ Búsqueda automática de metadatos DOI (CrossRef API)  
✅ Almacenamiento de archivos PDF en Google Drive  
✅ Registro de datos en Google Sheets  
✅ Email automático de confirmación  
✅ **100% Gratuito** - Sin costos de hosting ni base de datos  

## 🚀 Enlaces del Sistema

### 🎯 Para Usuarios (Postulantes):
**Formulario Principal:** [https://skrvar.github.io/premioExcelForm/form_google_apps_script.html](https://skrvar.github.io/premioExcelForm/form_google_apps_script.html)

### 📋 Para Administradores:
- **Página de Inicio:** [https://skrvar.github.io/premioExcelForm/](https://skrvar.github.io/premioExcelForm/)
- **Panel Admin:** [https://skrvar.github.io/premioExcelForm/admin.html](https://skrvar.github.io/premioExcelForm/admin.html)

### 🔧 Otras Versiones (Desarrollo):
- **Formulario Firebase:** [https://skrvar.github.io/premioExcelForm/form.html](https://skrvar.github.io/premioExcelForm/form.html)
- **Formulario Alternativo:** [https://skrvar.github.io/premioExcelForm/form_premio.html](https://skrvar.github.io/premioExcelForm/form_premio.html)

## 📦 Archivos Principales

- **`form_google_apps_script.html`** - Formulario web completo (usar este)
- **`google-apps-script/Code.gs`** - Backend de Google Apps Script
- **`INSTRUCCIONES_GOOGLE_APPS_SCRIPT.md`** - Guía completa de instalación

## ⚙️ Instalación Rápida

### 1. Configurar Google Apps Script (Backend)

1. Ve a [script.google.com](https://script.google.com/)
2. Crea un nuevo proyecto
3. Copia el contenido de `google-apps-script/Code.gs`
4. Ejecuta la función `inicializarProyecto()`
5. Publica como Web App
6. Copia la URL del Web App

### 2. Configurar el Formulario

1. Abre `form_google_apps_script.html`
2. Reemplaza `GOOGLE_SCRIPT_URL` con tu URL del Web App
3. ¡Listo para usar!

## 📖 Documentación Completa

Lee el archivo **[INSTRUCCIONES_GOOGLE_APPS_SCRIPT.md](./INSTRUCCIONES_GOOGLE_APPS_SCRIPT.md)** para instrucciones paso a paso detalladas.

## 🛠️ Tecnologías

- HTML5 + JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Diseño responsive
- [CrossRef API](https://www.crossref.org/) - Metadatos de publicaciones
- [Google Apps Script](https://developers.google.com/apps-script) - Backend
- [Google Drive](https://drive.google.com/) - Almacenamiento de archivos
- [Google Sheets](https://sheets.google.com/) - Base de datos

## 📊 Estructura de Datos

Los datos se guardan automáticamente en Google Sheets con las siguientes columnas:

| Campo | Descripción |
|-------|-------------|
| Fecha Postulación | Timestamp automático |
| Nombres | Nombre del postulante |
| Apellidos | Apellidos del postulante |
| Email | Correo institucional |
| Facultad | Facultad del postulante |
| Escuela | Escuela profesional |
| Teléfono | Número de contacto |
| DOI | Identificador de la publicación |
| Título Artículo | Título de la publicación |
| Autores | Lista de autores (JSON) |
| Revista | Nombre de la revista |
| Editorial | Editorial de la publicación |
| Fecha Publicación | Fecha de publicación |
| URL PDF | Enlace al archivo en Drive |
| Estado | Estado de la postulación |

## 🔒 Seguridad

- Los archivos se almacenan en Google Drive del administrador
- Solo personas con el enlace pueden acceder a los PDFs
- Los datos en Google Sheets son privados por defecto
- HTTPS automático en GitHub Pages

## 📝 Licencia

MIT License - Libre para uso académico y comercial

## 👥 Autor

Desarrollado para la Universidad Nacional del Centro del Perú (UNCP)

## 🆘 Soporte

Si tienes problemas:
1. Revisa las [instrucciones completas](./INSTRUCCIONES_GOOGLE_APPS_SCRIPT.md)
2. Verifica los logs en Google Apps Script
3. Abre la consola del navegador (F12) para ver errores

---

**Universidad Nacional del Centro del Perú**  
*Vicerrectorado de Investigación*
```

## 🛠️ Tecnologías Utilizadas

- **Frontend**: HTML5, Tailwind CSS, JavaScript ES6+
- **Backend**: Firebase (BaaS)
  - **Firestore**: Base de datos NoSQL
  - **Storage**: Almacenamiento de PDFs
  - **Authentication**: Autenticación de administradores
- **APIs**: CrossRef API para metadatos de publicaciones
- **Hosting**: GitHub Pages

## 📋 Requisitos Previos

1. Cuenta de Google (para Firebase)
2. Cuenta de GitHub (para hosting)
3. Navegador web moderno (Chrome, Firefox, Edge, Safari)

## ⚙️ Instalación y Configuración

### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/premio-excelencia-uncp.git
cd premio-excelencia-uncp
```

### Paso 2: Configurar Firebase

Sigue la guía completa en [`INSTRUCCIONES_FIREBASE.md`](INSTRUCCIONES_FIREBASE.md) que incluye:

1. ✅ Crear proyecto en Firebase
2. ✅ Obtener credenciales
3. ✅ Configurar Firestore Database
4. ✅ Configurar Firebase Storage
5. ✅ Crear usuario administrador
6. ✅ Desplegar en GitHub Pages

### Paso 3: Actualizar Configuración

En **ambos** archivos (`form.html` y `admin.html`), reemplaza:

```javascript
const firebaseConfig = {
    apiKey: "TU_API_KEY_AQUI",
    authDomain: "TU_PROJECT_ID.firebaseapp.com",
    projectId: "TU_PROJECT_ID",
    storageBucket: "TU_PROJECT_ID.appspot.com",
    messagingSenderId: "TU_SENDER_ID",
    appId: "TU_APP_ID"
};
```

Con tu configuración real de Firebase Console.

## 🎯 Uso

### Para Postulantes:

1. Accede a `form.html`
2. Ingresa el DOI de tu publicación (ejemplo: `10.1038/nature12373`)
3. Revisa los metadatos obtenidos automáticamente
4. Completa tus datos personales
5. Carga el PDF de tu artículo (máximo 10 MB)
6. Envía la postulación

### Para Administradores:

1. Accede a `admin.html`
2. Inicia sesión con tus credenciales
3. Visualiza todas las postulaciones
4. Usa filtros para buscar postulaciones específicas
5. Cambia el estado de las postulaciones (pendiente, revisado, aprobado, rechazado)
6. Descarga los PDFs
7. Exporta los datos a CSV

## 📊 Modelo de Datos

### Colección: `postulaciones`

```javascript
{
  // Datos del postulante
  nombres: string,
  apellidos: string,
  email: string,
  facultad: string,
  escuela: string,
  telefono: string,
  
  // Datos de la publicación
  publicacion: {
    titulo: string,
    autores: Array<object>,
    doi: string,
    revista: string,
    editorial: string,
    fecha: object,
    metadatosCompletos: object
  },
  
  // Archivo PDF
  pdfURL: string,
  pdfNombre: string,
  
  // Metadata del sistema
  fechaPostulacion: timestamp,
  estado: string // 'pendiente' | 'revisado' | 'aprobado' | 'rechazado'
}
```

## 🔒 Seguridad

### Reglas de Firestore:
- ✅ Cualquiera puede crear postulaciones
- ✅ Solo administradores autenticados pueden leer/modificar
- ✅ Validación de campos requeridos

### Reglas de Storage:
- ✅ Solo archivos PDF permitidos
- ✅ Máximo 10 MB por archivo
- ✅ Solo administradores pueden descargar

### Authentication:
- ✅ Email/Password para administradores
- ✅ Dominios autorizados configurados

## 📈 Límites y Costos

### Plan Gratuito de Firebase (Spark):

| Servicio | Límite Diario | Capacidad para 100 postulaciones |
|----------|---------------|----------------------------------|
| Firestore Lecturas | 50,000 | ✅ Suficiente (aprox. 5,000 lecturas) |
| Firestore Escrituras | 20,000 | ✅ Suficiente (100 escrituras) |
| Storage | 5 GB | ✅ Suficiente (100 PDFs × 5 MB = 500 MB) |
| Bandwidth | 1 GB/día | ✅ Suficiente |

> 💡 **Conclusión**: El plan gratuito es MÁS que suficiente para este proyecto.

## 🐛 Solución de Problemas

### El formulario no carga
- Verifica que hayas configurado correctamente `firebaseConfig`
- Abre la consola del navegador (F12) para ver errores
- Revisa que Firebase esté correctamente configurado

### No puedo subir PDFs
- Verifica que el archivo sea realmente PDF
- Verifica que no supere 10 MB
- Revisa las reglas de Storage en Firebase Console

### No puedo acceder al admin
- Verifica que hayas creado un usuario en Authentication
- Usa el email y contraseña exactos que configuraste
- Revisa las reglas de Firestore

## 🔄 Actualizaciones Futuras

- [ ] Notificaciones por email al postular
- [ ] Confirmación por email al cambiar estado
- [ ] Múltiples archivos adjuntos
- [ ] Sistema de comentarios/observaciones
- [ ] Generación de certificados PDF
- [ ] Dashboard con gráficos estadísticos

## 👥 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Contacto y Soporte

- **Institución**: Universidad Nacional del Centro del Perú (UNCP)
- **Proyecto**: Premio Excelencia
- **Año**: 2025

## 🙏 Agradecimientos

- CrossRef por su API pública de metadatos
- Firebase por su plataforma BaaS
- GitHub Pages por el hosting gratuito
- Tailwind CSS por el framework de estilos

## 📚 Recursos Adicionales

- [Documentación de Firebase](https://firebase.google.com/docs)
- [CrossRef API Documentation](https://www.crossref.org/documentation/retrieve-metadata/)
- [GitHub Pages Documentation](https://docs.github.com/es/pages)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

Desarrollado con ❤️ para la UNCP | 2025
