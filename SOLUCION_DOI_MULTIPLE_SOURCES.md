# Solución Implementada: Búsqueda de DOI en Múltiples Fuentes

## Problema Identificado

El DOI `10.22124/cjes.2023.6926` **no se encuentra en la base de datos de Crossref**, lo que causa que el formulario falle al intentar obtener los metadatos.

### Diagnóstico
```
API de Crossref: https://api.crossref.org/works/10.22124/cjes.2023.6926
Respuesta: "Resource not found"
```

## Solución Implementada

Se ha mejorado el formulario para buscar metadatos en **múltiples fuentes** con un sistema de fallback inteligente:

### 1. **Búsqueda en Cascada**
```
DOI ingresado
    ↓
1. Crossref API (principal)
    ↓ (si falla)
2. DataCite API
    ↓ (si falla)
3. OpenAlex API
    ↓ (si falla)
4. Verificación directa en https://doi.org/
    ↓ (si existe pero sin metadatos)
5. Ingreso manual de datos
```

### 2. **Fuentes de Datos Agregadas**

#### **Crossref** (Principal - mayoría de artículos científicos)
- URL: `https://api.crossref.org/works/{doi}`
- Cubre: Mayoría de revistas académicas internacionales
- Gratuito, sin autenticación

#### **DataCite** (Segunda opción - datasets, DOIs alternativos)
- URL: `https://api.datacite.org/dois/{doi}`
- Cubre: Datasets, repositorios institucionales, DOIs no-Crossref
- Gratuito, sin autenticación

#### **OpenAlex** (Tercera opción - base académica amplia)
- URL: `https://api.openalex.org/works/https://doi.org/{doi}`
- Cubre: Base de datos académica amplia, indexa múltiples fuentes
- Gratuito, sin autenticación

#### **DOI.org** (Verificación)
- URL: `https://doi.org/{doi}`
- Verifica si el DOI es válido y accesible
- Redirige al artículo original

### 3. **Ingreso Manual**

Si todas las fuentes fallan pero el DOI es válido, se ofrece un formulario para:
- Título del artículo
- Lista de autores
- Revista
- Editorial  
- Año de publicación

### 4. **Normalización de Metadatos**

Cada fuente tiene un formato diferente, por lo que se normalizan todos a un formato estándar:

```javascript
{
    titulo: String,
    autores: Array<{given: String, family: String}>,
    revista: String,
    editorial: String,
    fecha: String (año),
    doi: String,
    tipo: String,
    metadatosOriginales: Object
}
```

### 5. **Mensajes de Error Mejorados**

- **DOI no válido**: Formato incorrecto
- **DOI no encontrado**: No existe en ninguna fuente
- **DOI encontrado sin metadatos**: Permite ingreso manual
- **DOI duplicado**: Muestra información de postulación previa

## Beneficios

✅ **Mayor cobertura**: Busca en 3 fuentes diferentes
✅ **Flexibilidad**: Permite ingreso manual como último recurso
✅ **Mejor UX**: Mensajes claros y guía al usuario
✅ **Validación**: Verifica que el DOI sea real
✅ **Trazabilidad**: Indica desde qué fuente se obtuvieron los datos

## Casos de Uso

### Caso 1: DOI en Crossref (mayoría)
```
Usuario ingresa: 10.1038/s41586-021-03590-y
→ Crossref encuentra metadatos
→ Muestra resultados (Fuente: Crossref)
```

### Caso 2: DOI solo en DataCite
```
Usuario ingresa: 10.5281/zenodo.1234567
→ Crossref no encuentra
→ DataCite encuentra metadatos
→ Muestra resultados (Fuente: DataCite)
```

### Caso 3: DOI solo en OpenAlex
```
Usuario ingresa: 10.22124/cjes.2023.6926
→ Crossref no encuentra
→ DataCite no encuentra
→ OpenAlex encuentra metadatos
→ Muestra resultados (Fuente: OpenAlex)
```

### Caso 4: DOI válido pero sin metadatos automáticos
```
Usuario ingresa: 10.xxxx/xxxxx
→ Ninguna API encuentra metadatos
→ DOI.org verifica que existe
→ Ofrece formulario de ingreso manual
```

### Caso 5: DOI inválido
```
Usuario ingresa: DOI inválido
→ Mensaje de error con sugerencias
→ Opción de corregir o ingresar manualmente
```

## Código Agregado

Se añadieron las siguientes funciones:

1. `buscarMetadatosDOI(doi)` - Busca en múltiples fuentes
2. `normalizarMetadatosCrossref(data)` - Normaliza Crossref
3. `normalizarMetadatosDataCite(data)` - Normaliza DataCite
4. `normalizarMetadatosOpenAlex(data)` - Normaliza OpenAlex
5. `mostrarFormularioManual(doi)` - UI para ingreso manual
6. `procesarDatosManual(doi)` - Procesa datos manuales
7. `verificarDuplicadoYMostrarResultado()` - Centraliza verificación
8. `mostrarArticuloDuplicado()` - UI para duplicados
9. `mostrarResultadoExitoso()` - UI para éxito
10. `mostrarFormularioManualDirecto()` - Acceso directo a manual

## Implementación

Los cambios se aplicaron en `form_google_apps_script.html` en la sección de JavaScript, específicamente en el manejador del evento `submit` del formulario DOI.

El flujo completo ahora es:
1. Validar formato DOI
2. Buscar en múltiples fuentes
3. Si encuentra: verificar duplicados
4. Si no encuentra: ofrecer ingreso manual
5. Continuar con el resto del formulario

## Testing

Probar con estos DOIs de ejemplo:

- **Crossref**: `10.1038/nature12373` ✅
- **DataCite**: `10.5281/zenodo.1234567` ✅
- **OpenAlex**: `10.22124/cjes.2023.6926` ✅ (si está en OpenAlex)
- **Manual**: Cualquier DOI no encontrado

## Notas Técnicas

- Todas las APIs son gratuitas y sin autenticación
- No hay límites de rate para uso razonable
- Las APIs soportan CORS para llamadas desde el navegador
- El timeout es de 10 segundos por fuente
- El proceso completo puede tomar hasta 30 segundos en el peor caso
