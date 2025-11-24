// ============================================
// FUNCIONES PARA BÚSQUEDA DE DOI EN MÚLTIPLES FUENTES
// ============================================

/**
 * Busca metadatos del DOI en múltiples fuentes: Crossref, DataCite, OpenAlex
 * @param {string} doi - El DOI a buscar
 * @returns {Promise<Object>} Resultado con metadatos o indicación de fallo
 */
async function buscarMetadatosDOI(doi) {
    // 1. Intentar con Crossref
    try {
        const crossrefUrl = `https://api.crossref.org/works/${doi}`;
        const response = await fetch(crossrefUrl);
        
        if (response.ok) {
            const data = await response.json();
            if (data.message) {
                return {
                    success: true,
                    source: 'Crossref',
                    metadata: normalizarMetadatosCrossref(data.message)
                };
            }
        }
    } catch (error) {
        console.log('Crossref falló:', error.message);
    }
    
    // 2. Intentar con DataCite
    try {
        const dataciteUrl = `https://api.datacite.org/dois/${doi}`;
        const response = await fetch(dataciteUrl);
        
        if (response.ok) {
            const data = await response.json();
            if (data.data) {
                return {
                    success: true,
                    source: 'DataCite',
                    metadata: normalizarMetadatosDataCite(data.data)
                };
            }
        }
    } catch (error) {
        console.log('DataCite falló:', error.message);
    }
    
    // 3. Intentar con OpenAlex
    try {
        const openAlexUrl = `https://api.openalex.org/works/https://doi.org/${doi}`;
        const response = await fetch(openAlexUrl);
        
        if (response.ok) {
            const data = await response.json();
            if (data.id) {
                return {
                    success: true,
                    source: 'OpenAlex',
                    metadata: normalizarMetadatosOpenAlex(data)
                };
            }
        }
    } catch (error) {
        console.log('OpenAlex falló:', error.message);
    }
    
    // 4. Verificar si el DOI es accesible vía doi.org (sin hacer HEAD request para evitar CORS)
    return {
        success: false,
        doiExists: false,
        message: 'No se pudo encontrar el DOI en ninguna fuente (Crossref, DataCite, OpenAlex)'
    };
}

/**
 * Normaliza metadatos de Crossref al formato estándar
 */
function normalizarMetadatosCrossref(data) {
    return {
        titulo: data.title ? data.title[0] : '',
        autores: data.author || [],
        revista: data['container-title'] ? data['container-title'][0] : '',
        editorial: data.publisher || '',
        fecha: extraerAnioPublicacion(data),
        doi: data.DOI,
        tipo: data.type || '',
        metadatosOriginales: data
    };
}

/**
 * Normaliza metadatos de DataCite al formato estándar
 */
function normalizarMetadatosDataCite(data) {
    const attrs = data.attributes || {};
    
    // Convertir autores de DataCite al formato Crossref
    const autores = (attrs.creators || []).map(creator => ({
        given: creator.givenName || '',
        family: creator.familyName || creator.name || '',
        affiliation: creator.affiliation || []
    }));
    
    return {
        titulo: attrs.titles && attrs.titles[0] ? attrs.titles[0].title : '',
        autores: autores,
        revista: attrs.container && attrs.container.title ? attrs.container.title : '',
        editorial: attrs.publisher || '',
        fecha: attrs.publicationYear || (attrs.published ? new Date(attrs.published).getFullYear() : ''),
        doi: attrs.doi,
        tipo: attrs.types && attrs.types.resourceTypeGeneral ? attrs.types.resourceTypeGeneral : '',
        metadatosOriginales: data
    };
}

/**
 * Normaliza metadatos de OpenAlex al formato estándar
 */
function normalizarMetadatosOpenAlex(data) {
    // Convertir autores de OpenAlex al formato Crossref
    const autores = (data.authorships || []).map(authorship => {
        const author = authorship.author || {};
        const displayName = author.display_name || '';
        const nameParts = displayName.split(' ');
        
        return {
            given: nameParts.slice(0, -1).join(' '),
            family: nameParts[nameParts.length - 1] || '',
            affiliation: authorship.institutions ? authorship.institutions.map(inst => ({
                name: inst.display_name
            })) : []
        };
    });
    
    const primaryLocation = data.primary_location || {};
    const source = primaryLocation.source || {};
    
    return {
        titulo: data.title || '',
        autores: autores,
        revista: source.display_name || '',
        editorial: source.host_organization_name || '',
        fecha: data.publication_year || '',
        doi: data.doi ? data.doi.replace('https://doi.org/', '') : '',
        tipo: data.type || '',
        metadatosOriginales: data
    };
}

/**
 * Extrae el año de publicación de metadatos Crossref
 */
function extraerAnioPublicacion(metadata) {
    if (metadata.published && metadata.published['date-parts'] && metadata.published['date-parts'][0]) {
        return metadata.published['date-parts'][0][0];
    } else if (metadata.issued && metadata.issued['date-parts'] && metadata.issued['date-parts'][0]) {
        return metadata.issued['date-parts'][0][0];
    } else if (metadata['published-online'] && metadata['published-online']['date-parts'] && metadata['published-online']['date-parts'][0]) {
        return metadata['published-online']['date-parts'][0][0];
    }
    return '';
}

/**
 * Muestra formulario para ingreso manual de metadatos
 */
function mostrarFormularioManual(doi) {
    return `
        <div class="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-lg mb-4">
            <div class="flex gap-2 mb-3">
                <svg class="w-6 h-6 text-amber-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                </svg>
                <div class="flex-grow">
                    <h3 class="font-bold text-amber-900 mb-1">No se pudieron obtener metadatos automáticamente</h3>
                    <p class="text-sm text-amber-800 mb-2">El DOI no se encontró en Crossref, DataCite ni OpenAlex. Por favor, ingrese manualmente los datos de la publicación:</p>
                </div>
            </div>
        </div>
        
        <form id="formManual" class="space-y-3 bg-white border-2 border-gray-300 rounded-lg p-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">DOI *</label>
                <input type="text" id="manualDOI" value="${doi}" readonly class="w-full px-3 py-2 text-sm border border-gray-300 rounded bg-gray-50">
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Título del Artículo *</label>
                <textarea id="manualTitulo" required rows="2" class="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-amber-500" placeholder="Título completo del artículo"></textarea>
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Autores (uno por línea) *</label>
                <textarea id="manualAutores" required rows="4" class="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-amber-500" placeholder="Nombre Apellido&#10;Otro Autor&#10;..."></textarea>
                <p class="text-xs text-gray-500 mt-1">Ingrese cada autor en una línea separada</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Revista *</label>
                    <input type="text" id="manualRevista" required class="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-amber-500" placeholder="Nombre de la revista">
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Editorial *</label>
                    <input type="text" id="manualEditorial" required class="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-amber-500" placeholder="Nombre de la editorial">
                </div>
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Año de Publicación *</label>
                <input type="number" id="manualAnio" required min="1900" max="2100" class="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-amber-500" placeholder="2024">
            </div>
            
            <div class="flex gap-2 pt-2">
                <button type="button" onclick="location.reload()" class="flex-1 bg-gray-700 text-white font-medium px-4 py-2 text-sm rounded hover:bg-gray-800 transition">
                    Buscar otro DOI
                </button>
                <button type="submit" class="flex-1 btn-gold text-white font-semibold px-4 py-2 text-sm rounded">
                    Usar estos datos
                </button>
            </div>
        </form>
    `;
}

/**
 * Procesa los datos manuales ingresados
 */
function procesarDatosManual(doi) {
    const form = document.getElementById('formManual');
    
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const titulo = document.getElementById('manualTitulo').value.trim();
        const autoresTexto = document.getElementById('manualAutores').value.trim();
        const revista = document.getElementById('manualRevista').value.trim();
        const editorial = document.getElementById('manualEditorial').value.trim();
        const anio = document.getElementById('manualAnio').value.trim();
        
        // Convertir texto de autores a formato estructurado
        const autoresLineas = autoresTexto.split('\n').filter(line => line.trim());
        const autores = autoresLineas.map(linea => {
            const partes = linea.trim().split(' ');
            return {
                given: partes.slice(0, -1).join(' ') || '',
                family: partes[partes.length - 1] || linea.trim()
            };
        });
        
        // Crear objeto de metadatos normalizado
        const metadata = {
            titulo: titulo,
            autores: autores,
            revista: revista,
            editorial: editorial,
            fecha: anio,
            doi: doi,
            tipo: 'article',
            metadatosOriginales: {
                source: 'manual',
                title: [titulo],
                author: autores,
                'container-title': [revista],
                publisher: editorial,
                DOI: doi,
                published: { 'date-parts': [[parseInt(anio)]] }
            }
        };
        
        metadatosPublicacion = metadata.metadatosOriginales;
        autoresArticulo = autores;
        
        verificarDuplicadoYMostrarResultado(doi, titulo, metadata, 'Ingreso Manual');
    });
}

/**
 * Verifica si el DOI está duplicado y muestra el resultado
 */
async function verificarDuplicadoYMostrarResultado(doi, titulo, metadata, fuente) {
    const resultadoDiv = document.getElementById('resultado');
    
    resultadoDiv.innerHTML = `
        <div class="text-center text-gray-500 p-5 border-2 border-dashed border-gray-200 rounded-lg animate-pulse">
            <p class="text-sm">Verificando disponibilidad del artículo...</p>
        </div>`;
    
    try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify({
                action: 'checkDuplicate',
                doi: doi,
                titulo: titulo
            }),
            headers: {
                'Content-Type': 'text/plain;charset=utf-8',
            }
        });
        
        const checkResult = await response.json();
        
        if (checkResult.data && checkResult.data.isDuplicate) {
            mostrarArticuloDuplicado(checkResult.data.postulacionPrevia);
        } else {
            mostrarResultadoExitoso(metadata, fuente);
        }
    } catch (error) {
        console.error('Error al verificar duplicado:', error);
        alert('Error al verificar disponibilidad del artículo. Por favor intente nuevamente.');
    }
}

/**
 * Muestra mensaje de artículo duplicado
 */
function mostrarArticuloDuplicado(prev) {
    const resultadoDiv = document.getElementById('resultado');
    const fechaFormateada = new Date(prev.fecha).toLocaleDateString('es-PE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    resultadoDiv.innerHTML = `
        <div class="bg-amber-50 p-4 rounded-lg border-2 border-amber-400">
            <div class="flex items-start gap-3 mb-3">
                <svg class="w-7 h-7 text-amber-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
                <div class="flex-grow">
                    <h3 class="text-lg font-bold text-amber-900 mb-1">Artículo ya postulado</h3>
                    <p class="text-amber-800 text-sm mb-3">Este artículo ya ha sido registrado en el sistema y no puede ser postulado nuevamente.</p>
                </div>
            </div>
            
            <div class="bg-white rounded-lg p-3 border border-amber-200">
                <h4 class="font-semibold text-gray-800 mb-2 text-sm">Datos de la postulación previa:</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                        <span class="font-medium text-gray-600">Fecha de postulación:</span>
                        <p class="text-gray-800">${fechaFormateada}</p>
                    </div>
                    <div>
                        <span class="font-medium text-gray-600">Estado:</span>
                        <p class="text-gray-800"><span class="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-semibold">${prev.estado || 'Pendiente'}</span></p>
                    </div>
                    <div>
                        <span class="font-medium text-gray-600">Postulante:</span>
                        <p class="text-gray-800">${prev.nombres} ${prev.apellidos}</p>
                    </div>
                    <div>
                        <span class="font-medium text-gray-600">Email:</span>
                        <p class="text-gray-800">${prev.email}</p>
                    </div>
                    <div class="md:col-span-2">
                        <span class="font-medium text-gray-600">DOI:</span>
                        <p class="text-gray-800 break-all">${prev.doi}</p>
                    </div>
                    <div class="md:col-span-2">
                        <span class="font-medium text-gray-600">Título:</span>
                        <p class="text-gray-800">${prev.titulo}</p>
                    </div>
                    ${prev.autoresAfiliacionUNCP ? `
                    <div class="md:col-span-2">
                        <span class="font-medium text-gray-600">Autores UNCP:</span>
                        <p class="text-gray-800">${prev.autoresAfiliacionUNCP}</p>
                    </div>
                    ` : ''}
                </div>
            </div>
            
            <div class="mt-3 p-2.5 bg-teal-50 border border-teal-300 rounded-lg">
                <p class="text-xs text-gray-800">
                    <strong>Nota:</strong> Si cree que esto es un error o necesita actualizar la postulación, 
                    por favor contacte al administrador del sistema.
                </p>
            </div>
            
            <button 
                onclick="location.reload()"
                class="mt-3 w-full bg-gray-700 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-gray-800 transition text-sm"
            >
                Buscar otro artículo
            </button>
        </div>
    `;
}

/**
 * Muestra resultado exitoso con los metadatos encontrados
 */
function mostrarResultadoExitoso(metadata, fuente) {
    const resultadoDiv = document.getElementById('resultado');
    
    // Guardar datos en campos ocultos
    document.getElementById('publicacionTitulo').value = metadata.titulo;
    document.getElementById('publicacionAutores').value = JSON.stringify(metadata.autores);
    document.getElementById('publicacionDOI').value = metadata.doi;
    document.getElementById('publicacionRevista').value = metadata.revista;
    document.getElementById('publicacionEditorial').value = metadata.editorial;
    document.getElementById('publicacionFecha').value = metadata.fecha;
    document.getElementById('publicacionMetadatos').value = JSON.stringify(metadata.metadatosOriginales);

    const autoresTexto = metadata.autores.map(a => `${a.given || ''} ${a.family || ''}`.trim()).join(', ') || 'N/A';
    
    resultadoDiv.innerHTML = `
        <div class="bg-teal-50 p-4 rounded-lg border border-teal-300">
            <div class="flex items-start gap-2 mb-3">
                <svg class="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <div class="flex-grow">
                    <p class="text-xs text-teal-700 font-medium mb-1">Metadatos obtenidos desde: <span class="font-bold">${fuente}</span></p>
                </div>
            </div>
            
            <h3 class="text-base font-bold text-gray-800 mb-2">${metadata.titulo || 'Sin título'}</h3>
            <p class="text-gray-700 mb-1.5 text-sm"><strong>Autores:</strong> ${autoresTexto}</p>
            <p class="text-gray-700 mb-1.5 text-sm"><strong>Revista:</strong> ${metadata.revista || 'N/A'}</p>
            <p class="text-gray-700 mb-1.5 text-sm"><strong>Editorial:</strong> ${metadata.editorial || 'N/A'}</p>
            <p class="text-gray-700 mb-1.5 text-sm"><strong>Año:</strong> ${metadata.fecha || 'N/A'}</p>
            <p class="text-gray-700 text-sm"><strong>DOI:</strong> <a href="https://doi.org/${metadata.doi}" target="_blank" class="text-teal-700 hover:underline font-medium">${metadata.doi}</a></p>
            
            <button 
                onclick="continuarPostulacion()"
                class="mt-3 w-full btn-gold text-white font-semibold px-5 py-2.5 rounded-lg text-sm"
            >
                Continuar con la postulación
            </button>
        </div>
        <details class="mt-3 bg-white rounded-lg p-3 border">
            <summary class="cursor-pointer text-teal-700 font-medium hover:underline text-sm">Ver todos los metadatos disponibles</summary>
            <div class="mt-4">
                ${renderAllMetadataAsTable(metadata.metadatosOriginales)}
            </div>
        </details>
    `;
}

/**
 * Muestra el formulario manual directamente desde un botón
 */
window.mostrarFormularioManualDirecto = function(doi) {
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = mostrarFormularioManual(doi);
    procesarDatosManual(doi);
};
