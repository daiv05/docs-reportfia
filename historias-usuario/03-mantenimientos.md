# Módulo de Mantenimientos (Catálogos del Sistema)

## Tabla de Contenidos
- [Gestión de Escuelas](#gestion-de-escuelas)
- [Gestión de Locales](#gestion-de-locales)
- [Gestión de Recursos](#gestion-de-recursos)
- [Gestión de Bienes](#gestion-de-bienes)
- [Gestión de Tipos de Incidencias](#gestion-de-tipos-de-incidencias)
- [Gestión de Categorías de Reportes](#gestion-de-categorias-de-reportes)
- [Gestión de Fondos](#gestion-de-fondos)
- [Gestión de Unidades de Medida](#gestion-de-unidades-de-medida)

---

## Gestión de Escuelas

### HU-MNT-001: Crear Escuela
**Como** administrador del sistema  
**Quiero** crear nuevas escuelas académicas  
**Para** organizar la estructura educativa institucional

#### Criterios de Aceptación:
- El usuario debe tener permiso `ESCUELAS_CREAR`
- **Validaciones obligatorias:**
  - Nombre: obligatorio, máximo 50 caracteres, solo letras, números y espacios
  - Facultad: debe existir en la tabla facultades y estar activa
  - Estado activo: obligatorio (booleano)
- **Proceso de guardado:**
  - Se aplica el Request personalizado `StoreEscuelaRequest`
  - Se registra auditoría automática por el trait `Auditable`
- Respuesta exitosa redirige al listado con mensaje de confirmación
- Errores específicos por cada campo de validación

### HU-MNT-002: Listar y Filtrar Escuelas
**Como** administrador del sistema  
**Quiero** visualizar todas las escuelas con filtros  
**Para** gestionar eficientemente la estructura académica

#### Criterios de Aceptación:
- El usuario debe tener permiso `ESCUELAS_VER`
- **Filtro disponible:**
  - Por nombre: búsqueda parcial, máximo 50 caracteres, solo alfanuméricos y espacios
- Paginación con 15 registros por página
- Se muestran datos: nombre, facultad asociada, estado activo, acciones
- Se cargan facultades activas para información contextual
- Los filtros mantienen estado en la URL

### HU-MNT-003: Editar Escuela Existente
**Como** administrador del sistema  
**Quiero** modificar la información de una escuela  
**Para** mantener actualizada la estructura académica

#### Criterios de Aceptación:
- El usuario debe tener permiso `ESCUELAS_EDITAR`
- Se aplica el Request personalizado `UpdateEscuelaRequest`
- Mismas validaciones que en creación
- Se actualiza toda la información de la escuela
- Respuesta exitosa redirige al listado
- Se registra auditoría del cambio

### HU-MNT-004: Cambiar Estado de Escuela
**Como** administrador del sistema  
**Quiero** activar/desactivar escuelas  
**Para** controlar su disponibilidad sin eliminarlas

#### Criterios de Aceptación:
- El usuario debe tener permiso `ESCUELAS_EDITAR`
- Se invierte el estado actual (activo/inactivo)
- No requiere confirmación adicional
- El cambio es inmediato y se refleja en el listado
- Se registra auditoría del cambio de estado

---

## Gestión de Locales

### HU-MNT-005: Crear Local
**Como** administrador del sistema  
**Quiero** registrar nuevos locales físicos  
**Para** identificar ubicaciones específicas en la institución

#### Criterios de Aceptación:
- El usuario debe tener permiso `LOCALES_CREAR`
- Se aplica el Request personalizado `StoreLocalRequest`
- **Validaciones:** nombre, facultad asociada, estado activo
- Respuesta exitosa redirige al listado
- Se registra auditoría de la creación

### HU-MNT-006: Listar y Filtrar Locales
**Como** administrador del sistema  
**Quiero** visualizar todos los locales con filtros  
**Para** gestionar las ubicaciones físicas

#### Criterios de Aceptación:
- El usuario debe tener permiso `LOCALES_VER`
- **Filtro disponible:**
  - Por nombre: búsqueda parcial, máximo 50 caracteres, alfanuméricos, espacios y guiones
- Paginación con 15 registros por página
- Se muestran: nombre, facultad asociada, estado, acciones
- Se cargan facultades activas para referencia

### HU-MNT-007: Editar Local Existente
**Como** administrador del sistema  
**Quiero** modificar la información de un local  
**Para** mantener actualizado el catálogo de ubicaciones

#### Criterios de Aceptación:
- El usuario debe tener permiso `LOCALES_EDITAR`
- **Validaciones:**
  - Nombre: obligatorio, máximo 30 caracteres, solo alfanuméricos
  - Facultad: debe existir y estar activa
  - Estado activo: obligatorio
- **Validación de unicidad:**
  - No debe existir otro local con el mismo nombre en la misma facultad
  - Se excluye el registro actual de la validación
- Si hay duplicado, mensaje de advertencia específico
- Respuesta exitosa redirige al listado

### HU-MNT-008: Importar Locales desde Excel
**Como** administrador del sistema  
**Quiero** importar locales masivamente desde archivo Excel  
**Para** agilizar la carga de datos

#### Criterios de Aceptación:
- El usuario debe tener permiso `LOCALES_CREAR`
- **Archivo válido:**
  - Formatos: xlsx, xls, csv
  - Se usa la clase `LocalImport` para procesamiento
- **Proceso transaccional:**
  - Se inicia transacción de base de datos
  - Si hay error, se hace rollback completo
  - Si es exitoso, se confirma toda la operación
- **Retroalimentación:**
  - Mensaje de éxito con cantidad importada
  - Mensaje de error con detalles específicos
- Se registra auditoría de la importación

### HU-MNT-009: Cambiar Estado de Local
**Como** administrador del sistema  
**Quiero** activar/desactivar locales  
**Para** controlar su disponibilidad

#### Criterios de Aceptación:
- El usuario debe tener permiso `LOCALES_EDITAR`
- Se invierte el estado actual
- Cambio inmediato sin confirmación
- Se registra auditoría del cambio

---

## Gestión de Recursos

### HU-MNT-010: Crear Recurso de Bodega
**Como** administrador del sistema  
**Quiero** registrar nuevos recursos de bodega  
**Para** controlar materiales disponibles para mantenimiento

#### Criterios de Aceptación:
- El usuario debe tener permiso `RECURSOS_CREAR`
- **Validaciones:**
  - Nombre: obligatorio, máximo 50 caracteres, único, solo letras, números y espacios
  - Estado activo: opcional (booleano)
- Se registra auditoría de la creación
- Respuesta exitosa redirige al listado con confirmación

### HU-MNT-011: Listar y Filtrar Recursos
**Como** administrador del sistema  
**Quiero** visualizar todos los recursos con filtros  
**Para** gestionar el inventario de materiales

#### Criterios de Aceptación:
- El usuario debe tener permiso `RECURSOS_VER`
- **Filtro disponible:**
  - Por nombre: búsqueda parcial, máximo 100 caracteres, alfanuméricos, espacios y guiones
- Paginación con 15 registros por página
- Se muestran: nombre, estado, fechas, acciones disponibles

### HU-MNT-012: Editar Recurso Existente
**Como** administrador del sistema  
**Quiero** modificar la información de un recurso  
**Para** mantener actualizado el catálogo de materiales

#### Criterios de Aceptación:
- El usuario debe tener permiso `RECURSOS_EDITAR`
- **Validaciones:**
  - Nombre: obligatorio, máximo 50 caracteres, único (excluyendo registro actual), alfanuméricos, espacios y guiones
  - Estado activo: opcional
- Respuesta exitosa redirige al listado
- Se registra auditoría del cambio

### HU-MNT-013: Importar Recursos desde Excel
**Como** administrador del sistema  
**Quiero** importar recursos masivamente desde archivo Excel  
**Para** agilizar la carga de inventario

#### Criterios de Aceptación:
- El usuario debe tener permiso `RECURSOS_CREAR`
- **Archivo válido:** formatos xlsx, xls, csv
- Se usa la clase `RecursoImport` personalizada
- **Proceso transaccional:** rollback completo si hay errores
- **Retroalimentación detallada:**
  - Cantidad de registros agregados
  - Cantidad de duplicados detectados
  - Mensaje de error específico si falla
- Se registra auditoría de la importación

---

## Gestión de Bienes

### HU-MNT-014: Crear Bien Patrimonial
**Como** administrador del sistema  
**Quiero** registrar nuevos bienes patrimoniales  
**Para** controlar el inventario institucional

#### Criterios de Aceptación:
- El usuario debe tener permiso `BIENES_CREAR`
- **Validaciones obligatorias:**
  - Nombre: máximo 50 caracteres, único, alfanuméricos, espacios y guiones
  - Código: obligatorio, máximo 50 caracteres, alfanuméricos, espacios y guiones
  - Estado del bien: debe existir en tabla `estados_bienes`
- **Validaciones opcionales:**
  - Comentarios: máximo 250 caracteres
  - Marca, modelo, serie: máximo 100 caracteres cada uno, alfanuméricos, espacios y guiones
  - Estado activo: booleano
- Respuesta exitosa redirige al listado con confirmación
- Se registra auditoría de la creación

### HU-MNT-015: Listar y Filtrar Bienes
**Como** administrador del sistema  
**Quiero** visualizar todos los bienes con filtros avanzados  
**Para** gestionar el inventario patrimonial

#### Criterios de Aceptación:
- El usuario debe tener permiso `BIENES_VER`
- **Filtros disponibles:**
  - Por nombre: búsqueda parcial, máximo 150 caracteres
  - Por código: búsqueda parcial, máximo 50 caracteres  
  - Por estado del bien: lista de estados activos
- Todos los filtros usan regex alfanumérico con espacios y guiones
- Paginación con 15 registros por página
- Se muestran: nombre, código, estado, marca, modelo, acciones
- Se cargan estados de bienes activos para filtro

### HU-MNT-016: Editar Bien Existente
**Como** administrador del sistema  
**Quiero** modificar la información de un bien  
**Para** mantener actualizado el inventario patrimonial

#### Criterios de Aceptación:
- El usuario debe tener permiso `BIENES_EDITAR`
- **Validaciones:** mismas que en creación pero excluyendo ID actual para unicidad
- Todos los campos se pueden actualizar
- Respuesta exitosa redirige al listado
- Se registra auditoría del cambio

### HU-MNT-017: Búsqueda AJAX de Bienes
**Como** usuario del sistema  
**Quiero** buscar bienes rápidamente por nombre o código  
**Para** asociarlos a reportes de manera eficiente

#### Criterios de Aceptación:
- El usuario debe tener permiso `BIENES_VER` o `REPORTES_CREAR`
- **Endpoint:** GET `/mantenimientos/bienes/filtro`
- **Filtros automáticos:**
  - Solo bienes activos
  - Solo bienes con estado "ACTIVO" (según `EstadosBienEnum::ACTIVO`)
- **Parámetros opcionales:**
  - `search`: búsqueda en nombre o código (alfanumérico con espacios y guiones)
  - `page`: número de página (mínimo 1)
- **Respuesta JSON:**
  - Array de bienes con información básica
  - Metadatos de paginación (página actual, última página, total, por página)
- Paginación con 15 resultados por página
- Validación de errores devuelve código 400

### HU-MNT-018: Ver Detalle de Bien con Reportes
**Como** administrador del sistema  
**Quiero** ver el detalle completo de un bien y sus reportes asociados  
**Para** evaluar su historial y estado

#### Criterios de Aceptación:
- El usuario debe tener permiso `BIENES_VER`
- Se muestra información completa del bien con estado
- Se listan todos los reportes relacionados con el bien
- Los reportes se paginan con 15 por página
- Se incluye información de estado actual de cada reporte

### HU-MNT-019: Importar Bienes desde Excel (Avanzado)
**Como** administrador del sistema  
**Quiero** importar bienes con validación previa y corrección de errores  
**Para** garantizar calidad en la carga masiva de datos

#### Criterios de Aceptación:
- El usuario debe tener permiso `BIENES_CREAR`
- **Proceso en dos fases:**
  1. **Validación:** se detectan registros con errores
  2. **Corrección:** se permite editar datos erróneos antes de guardar
- **Archivo válido:** xlsx, xls, csv con estructura predefinida
- **Detección de encabezados:** se eliminan automáticamente si están presentes
- **Gestión de errores:**
  - Registros válidos se importan inmediatamente
  - Registros con errores se almacenan en sesión para corrección
  - Se puede eliminar registros erróneos individualmente
- **Vista de corrección:** formulario dinámico para editar registros problemáticos
- **Guardado final:** proceso transaccional con rollback en caso de error
- Se asigna automáticamente estado "ACTIVO" a bienes importados

### HU-MNT-020: Gestionar Sesión de Importación
**Como** administrador del sistema  
**Quiero** gestionar registros pendientes de importación  
**Para** controlar el proceso de carga masiva

#### Criterios de Aceptación:
- Los datos erróneos se almacenan en `session('excelData')`
- **Funcionalidades:**
  - Eliminar registros individuales por índice
  - Limpiar sesión completa si no quedan registros
  - Reindexar array después de eliminaciones
- Retroalimentación inmediata de cambios
- Redirección automática tras cada acción

---

## Gestión de Tipos de Incidencias

### HU-MNT-021: Crear Tipo de Incidencia
**Como** administrador del sistema  
**Quiero** crear nuevos tipos de incidencia  
**Para** clasificar apropiadamente los reportes

#### Criterios de Aceptación:
- El usuario debe tener permiso `TIPOS_INCIDENCIAS_CREAR`
- **Validaciones obligatorias:**
  - Nombre: máximo 100 caracteres, único, alfanuméricos, espacios, guiones, comas y paréntesis
  - Descripción: obligatoria, máximo 500 caracteres, alfanuméricos, espacios, signos básicos
  - Estado activo: opcional (booleano)
- **Caracteres permitidos específicos:** incluye signos de puntuación comunes
- Respuesta exitosa redirige al listado con confirmación
- Se registra auditoría de la creación

### HU-MNT-022: Listar y Filtrar Tipos de Incidencias
**Como** administrador del sistema  
**Quiero** visualizar todos los tipos de incidencia con filtros  
**Para** gestionar la clasificación de reportes

#### Criterios de Aceptación:
- El usuario debe tener permiso `TIPOS_INCIDENCIAS_VER`
- **Filtro disponible:**
  - Por nombre: búsqueda parcial, máximo 100 caracteres, alfanuméricos, espacios, guiones, comas y paréntesis
- Ordenamiento por nombre ascendente
- Paginación con 15 registros por página
- Se muestran: nombre, descripción, estado, fechas, acciones

### HU-MNT-023: Editar Tipo de Incidencia
**Como** administrador del sistema  
**Quiero** modificar tipos de incidencia existentes  
**Para** mantener actualizada la clasificación

#### Criterios de Aceptación:
- El usuario debe tener permiso `TIPOS_INCIDENCIAS_ACTUALIZAR`
- **Validaciones:** mismas que en creación pero excluyendo ID actual para unicidad
- Se permite cambiar nombre, descripción y estado
- Respuesta exitosa redirige al listado
- Se registra auditoría del cambio

### HU-MNT-024: Búsqueda AJAX de Tipos de Incidencias
**Como** usuario creador de reportes  
**Quiero** buscar tipos de incidencia rápidamente  
**Para** clasificar correctamente mis reportes

#### Criterios de Aceptación:
- El usuario debe tener permiso `REPORTES_CREAR`
- **Endpoint:** GET `/mantenimientos/tipos-incidencias/search/ajax`
- **Filtros automáticos:** solo tipos activos
- **Parámetros opcionales:**
  - `q`: término de búsqueda en nombre (máximo 100 caracteres, alfanuméricos básicos)
- **Respuesta JSON:**
  - Máximo 10 resultados
  - Campos: id, nombre, descripción
  - Ordenados por nombre
- Validación de caracteres permitidos en búsqueda

---

## Gestión de Categorías de Reportes

### HU-MNT-025: Crear Categoría de Reporte
**Como** administrador del sistema  
**Quiero** crear categorías para clasificar reportes administrativamente  
**Para** organizar el flujo de trabajo

#### Criterios de Aceptación:
- El usuario debe tener permiso `CATEGORIAS_REPORTES_CREAR`
- Validaciones básicas de nombre único y estado activo
- Se registra auditoría de la creación
- Respuesta exitosa redirige al listado

### HU-MNT-026: Listar Categorías de Reportes
**Como** administrador del sistema  
**Quiero** visualizar todas las categorías de reportes  
**Para** gestionar la clasificación administrativa

#### Criterios de Aceptación:
- El usuario debe tener permiso `CATEGORIAS_REPORTES_VER`
- Listado paginado con información básica
- Acciones de edición disponibles según permisos

### HU-MNT-027: Editar Categoría de Reporte
**Como** administrador del sistema  
**Quiero** modificar categorías existentes  
**Para** mantener actualizada la clasificación administrativa

#### Criterios de Aceptación:
- El usuario debe tener permiso `CATEGORIAS_REPORTES_EDITAR`
- Validaciones de unicidad y formato
- Se registra auditoría del cambio

---

## Gestión de Fondos

### HU-MNT-028: Crear Fondo de Financiamiento
**Como** administrador del sistema  
**Quiero** registrar fondos de financiamiento  
**Para** controlar el origen de recursos en reportes

#### Criterios de Aceptación:
- El usuario debe tener permiso `FONDOS_CREAR`
- Validaciones básicas de nombre único y estado activo
- Se registra auditoría de la creación
- Respuesta exitosa redirige al listado

### HU-MNT-029: Listar Fondos de Financiamiento
**Como** administrador del sistema  
**Quiero** visualizar todos los fondos disponibles  
**Para** gestionar las fuentes de financiamiento

#### Criterios de Aceptación:
- El usuario debe tener permiso `FONDOS_VER`
- Listado paginado con información de fondos activos
- Filtros básicos por nombre y estado

### HU-MNT-030: Editar Fondo de Financiamiento
**Como** administrador del sistema  
**Quiero** modificar fondos existentes  
**Para** mantener actualizada la información financiera

#### Criterios de Aceptación:
- El usuario debe tener permiso `FONDOS_EDITAR`
- Validaciones de unicidad y formato
- Se registra auditoría del cambio

---

## Gestión de Unidades de Medida

### HU-MNT-031: Crear Unidad de Medida
**Como** administrador del sistema  
**Quiero** registrar unidades de medida  
**Para** cuantificar recursos en reportes

#### Criterios de Aceptación:
- El usuario debe tener permiso `UNIDADES_MEDIDA_CREAR`
- Validaciones básicas de nombre único y estado activo
- Se registra auditoría de la creación
- Respuesta exitosa redirige al listado

### HU-MNT-032: Listar Unidades de Medida
**Como** administrador del sistema  
**Quiero** visualizar todas las unidades de medida  
**Para** gestionar las formas de cuantificación

#### Criterios de Aceptación:
- El usuario debe tener permiso `UNIDADES_MEDIDA_VER`
- Listado paginado con información básica
- Solo se muestran unidades activas en formularios

### HU-MNT-033: Editar Unidad de Medida
**Como** administrador del sistema  
**Quiero** modificar unidades de medida existentes  
**Para** mantener actualizado el catálogo de medidas

#### Criterios de Aceptación:
- El usuario debe tener permiso `UNIDADES_MEDIDA_EDITAR`
- Validaciones de unicidad y formato
- Se registra auditoría del cambio

---

## Funcionalidades Transversales

### HU-MNT-034: Descargar Plantillas de Importación
**Como** administrador del sistema  
**Quiero** descargar plantillas Excel para importación  
**Para** facilitar la carga masiva de datos

#### Criterios de Aceptación:
- El usuario debe tener permisos específicos de creación en cada módulo
- **Endpoint:** `/descargar/archivo/{seccion}`
- **Permisos requeridos:** `BIENES_CREAR|RECURSOS_CREAR|LOCALES_CREAR|ASIGNAR_PUESTOS_EMPLEADOS`
- Plantillas predefinidas por sección
- Archivos Excel con formato y cabeceras correctas
- Descarga inmediata con headers apropiados

### HU-MNT-035: Validaciones Consistentes
**Como** sistema  
**Quiero** aplicar validaciones consistentes en todos los catálogos  
**Para** mantener integridad y calidad de datos

#### Criterios de Aceptación:
- **Caracteres permitidos estándar:** alfanuméricos, acentos españoles, espacios, puntos, guiones
- **Longitudes máximas:** nombres 50-100 caracteres, descripciones 250-500 caracteres
- **Unicidad:** validada por tabla con exclusión de ID actual en ediciones
- **Estados booleanos:** activo/inactivo para control de disponibilidad
- **Mensajes de error:** específicos por campo y en español
- **Auditoría:** registrada automáticamente en todas las operaciones críticas

### HU-MNT-036: Control de Estados Activos
**Como** sistema  
**Quiero** controlar la disponibilidad de registros mediante estados  
**Para** mantener datos históricos sin afectar operaciones actuales

#### Criterios de Aceptación:
- Todos los catálogos manejan campo `activo` (booleano)
- **Filtros automáticos:** solo registros activos en listas de selección
- **Toggle de estado:** cambio rápido sin formularios adicionales
- **Preservación de datos:** no se eliminan registros, solo se desactivan
- **Impacto en operaciones:** registros inactivos no aparecen en formularios nuevos
- **Auditoría:** cambios de estado se registran automáticamente