# Cambios: Opcionalidad de Documento de Vínculo UNCP

## Descripción
Se ha modificado el formulario para que la carga del documento que acredita el vínculo con la UNCP sea **opcional** en lugar de obligatoria.

## Archivos Modificados
- `form_google_apps_script.html`

## Detalles de los Cambios

1.  **Etiqueta del Campo**:
    - Se actualizó la etiqueta del campo de carga de archivo en la sección de autores.
    - De: `Documento de vínculo UNCP (PDF) *`
    - A: `Documento de vínculo UNCP (PDF) (Opcional)`

2.  **Lógica de Validación (JavaScript)**:
    - Se modificó la función `togglePdfUpload` para que el campo `input type="file"` ya no tenga el atributo `required = true` cuando se selecciona "UNCP".
    - Se actualizó la función `enviarPostulacion` para eliminar la validación que bloqueaba el envío si no se adjuntaba el archivo.
    - Se mantuvo la validación de tamaño máximo (10MB) solo si el archivo es adjuntado.

3.  **Instrucciones**:
    - Se actualizó el texto de ayuda en la Sección 3 para indicar que el PDF es opcional.
    - De: `(requiere PDF si es UNCP, ...)`
    - A: `(adjuntar PDF si es UNCP: ... - Opcional)`

## Resultado
Ahora los docentes pueden declarar su vínculo con la UNCP sin verse obligados a subir un documento probatorio en ese momento, facilitando el proceso de postulación.
