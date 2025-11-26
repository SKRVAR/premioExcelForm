# Cambios: Enlace a FAQ desde Formulario

## Descripción
Se ha añadido un enlace directo desde el campo de carga de documento de vínculo UNCP en el formulario hacia la sección de Preguntas Frecuentes (FAQ) en la página principal, específicamente a la pregunta sobre los tipos de documentos aceptados.

## Archivos Modificados

### 1. `index.html`
- **ID Agregado**: Se añadió el ID `faq-vinculo` al elemento `<details>` correspondiente a la pregunta "¿Qué tipo de vínculo con la UNCP se acepta?".
- **Script de Navegación**: Se agregó un script al final del archivo que detecta si la URL contiene el hash `#faq-vinculo`. Si es así:
    - Activa la pestaña de FAQ.
    - Despliega automáticamente la respuesta (atributo `open`).
    - Realiza un scroll suave hacia la pregunta.
    - Aplica un efecto visual temporal (anillo amarillo) para resaltar la pregunta.

### 2. `form_google_apps_script.html`
- **Enlace en Etiqueta**: Se modificó la generación dinámica del campo de carga de PDF (función `generarListaAutores`) para incluir un enlace `(¿Qué documentos se aceptan?)` junto a la etiqueta "Documento de vínculo UNCP (PDF) (Opcional)".
- **Comportamiento**: El enlace abre `index.html#faq-vinculo` en una nueva pestaña (`target="_blank"`), lo que activa el script mencionado anteriormente.

## Resultado
Ahora, cuando un postulante tenga dudas sobre qué documento subir para acreditar su vínculo, puede hacer clic en el enlace de ayuda, el cual abrirá la página principal, navegará a la sección de FAQ y le mostrará la respuesta desplegada automáticamente.
