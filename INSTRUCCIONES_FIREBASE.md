# 📋 Instrucciones de Configuración de Firebase

## Guía completa para desplegar tu formulario de postulación

---

## 🎯 Paso 1: Crear Proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en **"Agregar proyecto"**
3. Nombre del proyecto: `premio-excelencia-uncp` (o el que prefieras)
4. **Deshabilita Google Analytics** (no es necesario para este proyecto)
5. Haz clic en **"Crear proyecto"**
6. Espera a que se complete la creación (~30 segundos)

---

## 🔑 Paso 2: Obtener Configuración de Firebase

1. En el proyecto recién creado, haz clic en el ícono de **engranaje ⚙️** (arriba izquierda)
2. Selecciona **"Configuración del proyecto"**
3. En la sección **"Tus apps"**, haz clic en el ícono **`</>`** (Web)
4. Registra la app:
   - **Sobrenombre**: "Formulario Postulación"
   - **NO marques** "También configura Firebase Hosting"
   - Haz clic en **"Registrar app"**
5. Verás un código similar a este:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "premio-excelencia-uncp.firebaseapp.com",
  projectId: "premio-excelencia-uncp",
  storageBucket: "premio-excelencia-uncp.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123..."
};
```

6. **COPIA** este objeto `firebaseConfig` completo

---

## 📝 Paso 3: Configurar los Archivos HTML

### En `form.html`:

1. Abre el archivo `form.html`
2. Busca la línea que dice:
```javascript
const firebaseConfig = {
    apiKey: "TU_API_KEY_AQUI",
    // ...
```
3. **REEMPLAZA** todo el objeto con el que copiaste de Firebase
4. Guarda el archivo

### En `admin.html`:

1. Abre el archivo `admin.html`
2. Busca la misma sección de configuración
3. **PEGA** el mismo objeto `firebaseConfig`
4. Guarda el archivo

> ⚠️ **Importante**: Ambos archivos deben tener EXACTAMENTE la misma configuración

---

## 🗄️ Paso 4: Activar Firestore Database

1. En la consola de Firebase, ve al menú lateral
2. Haz clic en **"Firestore Database"**
3. Haz clic en **"Crear base de datos"**
4. Selecciona **"Comenzar en modo de prueba"**
5. **Ubicación**: **us-central1** 
   > ⚠️ **IMPORTANTE**: NO uses `southamerica-east1` porque esa región no soporta Firebase Storage gratuito. 
   > 
   > `us-central1` tiene buena latencia hacia Perú y sí incluye Storage gratuito.
6. Haz clic en **"Habilitar"**

### Configurar Reglas de Firestore

1. Una vez creada la base de datos, ve a la pestaña **"Reglas"**
2. **REEMPLAZA** el contenido con esto:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir que cualquiera cree postulaciones
    match /postulaciones/{postulacion} {
      allow create: if true;
      // Solo administradores autenticados pueden leer, actualizar o eliminar
      allow read, update, delete: if request.auth != null;
    }
  }
}
```

3. Haz clic en **"Publicar"**

> ✅ Esto permite que cualquiera postule, pero solo tú (autenticado) puedas ver las postulaciones

---

## 📦 Paso 5: Activar Firebase Storage

1. En el menú lateral, haz clic en **"Storage"**
2. Haz clic en **"Comenzar"**
3. Acepta las **reglas predeterminadas**
4. Selecciona la misma ubicación que Firestore
5. Haz clic en **"Listo"**

### Configurar Reglas de Storage

1. Ve a la pestaña **"Reglas"**
2. **REEMPLAZA** el contenido con esto:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Permitir subir PDFs en la carpeta postulaciones
    match /postulaciones/{fileName} {
      allow write: if request.resource.size < 10 * 1024 * 1024 
                   && request.resource.contentType == 'application/pdf';
      // Solo administradores pueden leer los PDFs
      allow read: if request.auth != null;
    }
  }
}
```

3. Haz clic en **"Publicar"**

> 🔒 Esto permite subir PDFs de máximo 10 MB, pero solo tú puedes descargarlos

---

## 👤 Paso 6: Crear Usuario Administrador

1. En el menú lateral, haz clic en **"Authentication"**
2. Haz clic en **"Comenzar"**
3. En la pestaña **"Sign-in method"**, haz clic en **"Correo electrónico/contraseña"**
4. **Activa** el primer switch (Correo electrónico/contraseña)
5. **NO actives** "Vínculo de correo electrónico"
6. Haz clic en **"Guardar"**

### Agregar tu usuario:

1. Ve a la pestaña **"Users"**
2. Haz clic en **"Agregar usuario"**
3. **Email**: tu-email@uncp.edu.pe (tu correo institucional)
4. **Contraseña**: Elige una contraseña segura (mínimo 6 caracteres)
5. Haz clic en **"Agregar usuario"**

> ✅ Este será el usuario con el que accedas al panel de administración

---

## 🌐 Paso 7: Desplegar en GitHub Pages

### 7.1. Crear Repositorio en GitHub

1. Ve a [GitHub](https://github.com/)
2. Haz clic en **"New repository"** (botón verde)
3. Nombre del repositorio: `premio-excelencia-uncp`
4. **Público** (para usar GitHub Pages gratis)
5. **NO inicialices** con README
6. Haz clic en **"Create repository"**

### 7.2. Subir tus archivos

Opción A - Usando la interfaz web de GitHub:

1. En tu repositorio vacío, haz clic en **"uploading an existing file"**
2. Arrastra los archivos:
   - `form.html`
   - `admin.html`
   - `INSTRUCCIONES_FIREBASE.md`
   - `README.md`
3. Haz clic en **"Commit changes"**

Opción B - Usando Git (desde PowerShell):

```powershell
# Navega a tu carpeta
cd "C:\Users\dioni\OneDrive - Universidad Nacional del Centro del Perú (1)\UNCP\IGI\2025\semCient2025\prmioExcelncia\forms"

# Inicializa Git
git init

# Agrega los archivos
git add form.html admin.html INSTRUCCIONES_FIREBASE.md README.md

# Commit
git commit -m "Implementación inicial del formulario de postulación"

# Conecta con GitHub (reemplaza TU_USUARIO)
git remote add origin https://github.com/TU_USUARIO/premio-excelencia-uncp.git

# Sube los archivos
git branch -M main
git push -u origin main
```

### 7.3. Activar GitHub Pages

1. En tu repositorio, ve a **Settings** (arriba derecha)
2. En el menú lateral, haz clic en **"Pages"**
3. En **"Source"**, selecciona **"Deploy from a branch"**
4. En **"Branch"**, selecciona:
   - **Branch**: `main`
   - **Folder**: `/ (root)`
5. Haz clic en **"Save"**
6. Espera 2-3 minutos

> ✅ Tu sitio estará disponible en: `https://TU_USUARIO.github.io/premio-excelencia-uncp/`

---

## 🎉 Paso 8: Probar el Sistema

### Formulario de Postulación:

1. Abre: `https://TU_USUARIO.github.io/premio-excelencia-uncp/form.html`
2. Ingresa un DOI de prueba: `10.1038/nature12373`
3. Haz clic en "Obtener Metadatos"
4. Llena el formulario
5. Sube un PDF de prueba
6. Envía la postulación

### Panel de Administración:

1. Abre: `https://TU_USUARIO.github.io/premio-excelencia-uncp/admin.html`
2. Ingresa con el email y contraseña que creaste en el Paso 6
3. Verás la postulación de prueba
4. Prueba cambiar el estado
5. Descarga el PDF
6. Exporta a CSV

---

## 🔒 Paso 9: Mejorar la Seguridad (Opcional pero Recomendado)

### Restringir dominios autorizados:

1. En Firebase Console, ve a **Authentication** > **Settings**
2. En **"Authorized domains"**, asegúrate que solo estén:
   - `tu-usuario.github.io`
   - `localhost` (para pruebas locales)

### Cambiar reglas de Firestore a producción:

Después de un mes en modo de prueba, cambia las reglas a:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /postulaciones/{postulacion} {
      allow create: if request.resource.data.keys().hasAll(['nombres', 'email', 'publicacion']);
      allow read, update, delete: if request.auth != null;
    }
  }
}
```

---

## 📊 Monitoreo y Mantenimiento

### Ver estadísticas de uso:

1. Firebase Console > **Usage** (menú lateral)
2. Revisa:
   - Número de lecturas/escrituras en Firestore
   - Almacenamiento usado en Storage
   - Usuarios activos

### Límites del plan gratuito (Spark):

- **Firestore**: 50,000 lecturas/día + 20,000 escrituras/día
- **Storage**: 5 GB de almacenamiento + 1 GB/día de descargas
- **Authentication**: Sin límites

> ✅ Con 100 postulaciones, estarás MUY por debajo de estos límites

---

## 🆘 Solución de Problemas Comunes

### ❌ Error: "Firebase: Error (auth/invalid-api-key)"

**Solución**: Verifica que copiaste correctamente el `firebaseConfig` de Firebase Console

### ❌ Error: "Missing or insufficient permissions"

**Solución**: Revisa las reglas de Firestore en el Paso 4

### ❌ Error: "Your data location has been set in a region that does not support no-cost storage buckets"

**Problema**: Has configurado Firestore en `southamerica-east1` que no soporta Firebase Storage gratuito.

**Soluciones**:

**Opción A - Crear nuevo proyecto (Recomendada):**
1. Crea un nuevo proyecto Firebase
2. Configura Firestore en `us-central1`
3. Storage se configurará automáticamente en la misma región
4. Actualiza tu `firebaseConfig` en los archivos HTML

**Opción B - Usar bucket pagado:**
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Selecciona tu proyecto Firebase
3. Cloud Storage > Buckets > Create bucket
4. Costo estimado: ~$0.005 USD/mes para 100 PDFs de 2MB

> 💡 **Regiones que SÍ soportan Storage gratuito**: `us-central1`, `us-west1`, `us-east1`, `europe-west1`, `asia-southeast1`

### ❌ No puedo ver los PDFs en el admin

**Solución**: 
1. Verifica que iniciaste sesión en admin.html
2. Revisa las reglas de Storage en el Paso 5

### ❌ El formulario no se ve en GitHub Pages

**Solución**: 
1. Espera 5-10 minutos después de activar Pages
2. Verifica que los archivos estén en la raíz del repositorio
3. Usa `https://` no `http://`

---

## 📞 Contacto y Soporte

Si tienes problemas:

1. Revisa la consola del navegador (F12) para ver errores
2. Verifica la pestaña **"Functions"** > **"Logs"** en Firebase Console
3. Consulta la documentación oficial: [Firebase Docs](https://firebase.google.com/docs)

---

## ✅ Checklist de Verificación

- [ ] Proyecto Firebase creado
- [ ] `firebaseConfig` copiado a `form.html` y `admin.html`
- [ ] Firestore activado con reglas configuradas
- [ ] Storage activado con reglas configuradas
- [ ] Usuario administrador creado
- [ ] Repositorio GitHub creado
- [ ] Archivos subidos a GitHub
- [ ] GitHub Pages activado
- [ ] Prueba del formulario exitosa
- [ ] Prueba del panel admin exitosa

---

## 🎓 Recursos Adicionales

- [Documentación de Firebase](https://firebase.google.com/docs)
- [Guía de GitHub Pages](https://docs.github.com/es/pages)
- [CrossRef API Docs](https://www.crossref.org/documentation/retrieve-metadata/)

---

¡Listo! Tu sistema de postulaciones está completo y funcionando 🚀
