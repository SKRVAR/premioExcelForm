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
└── README.md                      # Este archivo
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
