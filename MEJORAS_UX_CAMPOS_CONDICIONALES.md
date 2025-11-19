# 🎨 MEJORAS DE UX: Campos Condicionales por Afiliación

## 📋 Resumen de Mejoras

Se ha implementado una **interfaz inteligente** que muestra campos adicionales solo cuando son relevantes según la afiliación declarada.

### ✅ **COMPORTAMIENTO MEJORADO:**

#### **🔹 Afiliación EXTERNA:**
- ✅ Solo se muestra el campo "Afiliación declarada en el artículo"
- ✅ Aparece mensaje informativo: "Autor externo: No se requiere información adicional"
- ✅ Campos de vínculo laboral y corresponsal permanecen **ocultos**
- ✅ No se solicita PDF

#### **🔹 Afiliación UNCP:**
- ✅ Se muestran **todos los campos adicionales**:
  - Campo "Vínculo laboral vigente" (obligatorio)
  - Checkbox "Autor corresponsal" (opcional)
  - Campo PDF (solo si vínculo laboral = UNCP)

---

## 🔧 Cambios Técnicos Implementados

### **1. Nueva Función: `toggleCamposUNCP()`**

```javascript
window.toggleCamposUNCP = function(index) {
    const afiliacionDeclarada = document.getElementById(`afiliacionDeclarada_${index}`).value;
    const camposUNCP = document.getElementById(`camposUNCP_${index}`);
    const mensajeExterno = document.getElementById(`mensajeExterno_${index}`);
    
    if (afiliacionDeclarada === 'UNCP') {
        // Mostrar campos adicionales
        camposUNCP.classList.remove('hidden');
        mensajeExterno.classList.add('hidden');
        vinculoLaboral.required = true;
        
    } else if (afiliacionDeclarada === 'EXTERNO') {
        // Ocultar campos y limpiar valores
        camposUNCP.classList.add('hidden');
        mensajeExterno.classList.remove('hidden');
        // Limpiar todos los campos
        vinculoLaboral.value = '';
        autorCorresponsal.checked = false;
        pdfInput.value = '';
    }
};
```

### **2. Estructura HTML Mejorada**

```html
<!-- Campo principal siempre visible -->
<select id="afiliacionDeclarada_${index}" onchange="toggleCamposUNCP(${index})">
    <option value="UNCP">UNCP</option>
    <option value="EXTERNO">Externo</option>
</select>

<!-- Contenedor condicional para campos UNCP -->
<div id="camposUNCP_${index}" class="hidden space-y-4">
    <!-- Vínculo laboral -->
    <select id="vinculoLaboral_${index}">...</select>
    <!-- Autor corresponsal -->
    <input type="checkbox" id="autorCorresponsal_${index}">
    <!-- Campo PDF -->
    <div id="pdfContainer_${index}" class="hidden">...</div>
</div>

<!-- Mensaje informativo para externos -->
<div id="mensajeExterno_${index}" class="hidden">
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p>ℹ️ Autor externo: No se requiere información adicional</p>
    </div>
</div>
```

### **3. Validaciones Actualizadas**

```javascript
// Solo validar campos adicionales si afiliación = UNCP
if (afiliacionDeclarada === 'UNCP') {
    const vinculoLaboral = document.getElementById(`vinculoLaboral_${i}`).value;
    if (!vinculoLaboral) {
        alert(`Seleccione vínculo laboral para autor ${i + 1}`);
        return;
    }
    // Validar PDF solo si vínculo = UNCP
    if (vinculoLaboral === 'UNCP') {
        // Validar archivo PDF...
    }
}
```

### **4. Recopilación Inteligente de Datos**

```javascript
// Procesar según tipo de afiliación
if (afiliacionDeclarada === 'UNCP') {
    // Recopilar todos los campos
    autorData.vinculoLaboral = vinculoLaboral;
    autorData.esAutorCorresponsal = esAutorCorresponsal;
    // PDF si corresponde...
} else {
    // Valores predeterminados para externos
    autorData.vinculoLaboral = 'EXTERNO';
    autorData.esAutorCorresponsal = false;
}
```

---

## 🎯 Flujo de Usuario Mejorado

### **Escenario 1: Autor Externo**
1. **Paso 1:** Selecciona "Externo" en afiliación declarada
2. **Resultado:** ✅ Formulario completo para ese autor
   - Mensaje: "Autor externo: No se requiere información adicional"
   - No se muestran campos adicionales
   - Usuario puede continuar al siguiente autor

### **Escenario 2: Autor UNCP**
1. **Paso 1:** Selecciona "UNCP" en afiliación declarada
2. **Paso 2:** ✅ Aparecen campos adicionales:
   - Campo "Vínculo laboral vigente" (obligatorio)
   - Checkbox "Autor corresponsal" (opcional)
3. **Paso 3:** Si selecciona vínculo UNCP → aparece campo PDF
4. **Resultado:** Formulario completo con todos los datos necesarios

---

## 🚀 Beneficios de la Mejora

### **📱 Experiencia de Usuario:**
- ✅ **Interfaz más limpia:** Solo campos relevantes
- ✅ **Menos confusión:** No se muestran campos innecesarios
- ✅ **Proceso más rápido:** Autores externos completan en 1 paso
- ✅ **Guía visual:** Mensajes informativos claros

### **🔧 Beneficios Técnicos:**
- ✅ **Validaciones inteligentes:** Solo valida campos visibles
- ✅ **Datos consistentes:** Valores predeterminados para externos
- ✅ **Menos errores:** Campos ocultos no pueden generar errores
- ✅ **Mantenimiento fácil:** Lógica centralizada en funciones

### **📊 Beneficios de Datos:**
- ✅ **Registro completo:** Todos los casos están cubiertos
- ✅ **Compatibilidad:** Misma estructura de datos en el backend
- ✅ **Claridad:** Distinción clara entre tipos de autores

---

## 📱 Estados de la Interfaz

### **Estado Inicial (Sin Selección)**
```
┌─ Autor 1: Juan Pérez ─────────────────┐
│ Afiliación declarada: [Seleccione...] │
└───────────────────────────────────────┘
```

### **Estado: Afiliación Externa**
```
┌─ Autor 1: Juan Pérez ─────────────────┐
│ Afiliación declarada: [Externo]       │
│ ℹ️ Autor externo: No se requiere      │
│    información adicional              │
└───────────────────────────────────────┘
```

### **Estado: Afiliación UNCP**
```
┌─ Autor 1: Juan Pérez ─────────────────┐
│ Afiliación declarada: [UNCP]          │
│ ┌─────────────────────────────────────┐ │
│ │ Vínculo laboral: [Seleccione...]    │ │
│ │ □ Es autor corresponsal             │ │
│ │ [Campo PDF oculto hasta elegir UNCP]│ │
│ └─────────────────────────────────────┘ │
└───────────────────────────────────────┘
```

---

## ⚡ Optimizaciones Implementadas

### **🔄 Limpieza Automática:**
- Al cambiar de UNCP → Externo: se limpian todos los campos
- Al cambiar de Externo → UNCP: campos listos para completar
- Sin datos residuales de selecciones anteriores

### **🎯 Validaciones Contextuales:**
- Solo valida campos visibles y requeridos
- Mensajes de error específicos por contexto
- No valida campos ocultos

### **💾 Manejo de Datos:**
- Valores predeterminados consistentes para externos
- Estructura de datos uniforme en el backend
- Compatibilidad total con versiones anteriores

---

## 🔧 Archivos Modificados

- ✅ `form_google_apps_script.html` - Frontend con lógica condicional
- ✅ Backend (`Code.gs`) - Sin cambios, compatible con la nueva estructura

La mejora es **puramente frontend** y no requiere cambios en el backend, manteniendo compatibilidad total.