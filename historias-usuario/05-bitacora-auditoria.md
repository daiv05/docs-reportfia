# Módulo de Bitácora y Auditoría

## Tabla de Contenidos
- [Consulta de Eventos de Auditoría](#consulta-de-eventos-de-auditoria)
- [Filtros y Búsquedas Avanzadas](#filtros-y-busquedas-avanzadas)
- [Análisis y Seguimiento](#analisis-y-seguimiento)

---

## Consulta de Eventos de Auditoría

### HU-BIT-001: Ver Bitácora General del Sistema
**Como** auditor o administrador del sistema  
**Quiero** visualizar todos los eventos de auditoría con filtros  
**Para** supervisar la actividad del sistema y cumplir con requisitos de seguridad

#### Criterios de Aceptación:
- El usuario debe tener permiso `BITACORA_VER`
- **Sistema de filtros obligatorio:**
  - La vista inicia sin datos hasta que se aplique al menos un filtro
  - Si no hay filtros aplicados, se muestra un paginador vacío
- **Información mostrada por evento:**
  - Tipo de modelo afectado (`auditable_type`)
  - Evento/acción realizada
  - Usuario que ejecutó la acción
  - Fecha y hora del evento
  - Datos modificados (valores antiguos y nuevos)
  - Información del request (IP, User-Agent, URL)
- Paginación con 15 registros por página
- Integración con el sistema de auditoría `owen-it/laravel-auditing`

### HU-BIT-002: Filtrar por Modelo de Datos
**Como** auditor del sistema  
**Quiero** filtrar eventos por tipo de modelo específico  
**Para** enfocar mi análisis en entidades particulares del sistema

#### Criterios de Aceptación:
- **Filtro por modelo (`auditable_type`):**
  - Se obtiene lista única de todos los modelos que han registrado eventos
  - Validación de caracteres permitidos: alfanuméricos, guiones bajos y backslashes (para namespaces)
- **Funcionalidad dependiente:**
  - Al seleccionar un modelo, se habilita el filtro de eventos
  - Se carga lista de eventos específicos para el modelo seleccionado
- **Endpoint AJAX:** `/bitacora/get-events` para obtener eventos por modelo
- Respuesta JSON con eventos únicos del modelo seleccionado

### HU-BIT-003: Filtrar por Tipo de Evento
**Como** auditor del sistema  
**Quiero** filtrar por tipos específicos de eventos  
**Para** analizar acciones particulares en el sistema

#### Criterios de Aceptación:
- **Filtro dependiente del modelo:**
  - Solo se activa cuando se ha seleccionado un modelo
  - Muestra eventos únicos para el modelo seleccionado
- **Tipos de eventos comunes:**
  - created: registros creados
  - updated: registros modificados
  - deleted: registros eliminados
  - Actualizar_roles: cambios específicos de roles
  - Y otros eventos personalizados por modelo
- Validación de caracteres alfanuméricos y guiones bajos
- Filtro se aplica sobre la consulta base de auditoría

---

## Filtros y Búsquedas Avanzadas

### HU-BIT-004: Buscar por Usuario
**Como** auditor del sistema  
**Quiero** filtrar eventos por usuario específico  
**Para** rastrear actividades de usuarios particulares

#### Criterios de Aceptación:
- **Búsqueda por nombre del usuario:**
  - Búsqueda parcial en nombre y apellido de la persona
  - Uso de LIKE para búsquedas flexibles
  - Si no se encuentran personas, se devuelve consulta vacía
- **Validación de entrada:**
  - Solo caracteres Unicode de letras y espacios
  - Búsqueda case-insensitive
- **Proceso de búsqueda:**
  1. Se buscan personas que coincidan con el término
  2. Se obtienen IDs de personas encontradas
  3. Se filtran auditorías por `user_id` correspondiente
- Se incluye lista completa de usuarios para referencia en la vista

### HU-BIT-005: Filtrar por Rango de Fechas
**Como** auditor del sistema  
**Quiero** filtrar eventos por período específico  
**Para** analizar actividades en rangos temporales definidos

#### Criterios de Aceptación:
- **Formato de fecha obligatorio:** dd/mm/yyyy
- **Validaciones de rango:**
  - Ambas fechas deben proporcionarse (inicio y fin)
  - Fecha de fin no puede ser menor que fecha de inicio
  - Si solo se proporciona una fecha, se muestra mensaje de error
- **Conversión automática:**
  - Se convierte formato dd/mm/yyyy a Y-m-d para consulta SQL
  - Se filtra usando `DATE(created_at) BETWEEN ? AND ?`
- **Mensajes de error específicos:**
  - "Debe ingresar ambas fechas" si falta alguna
  - "La fecha de fin no puede ser menor que la fecha de inicio"
- Redirección con mensaje de advertencia si hay errores de validación

---

## Análisis y Seguimiento

### HU-BIT-006: Analizar Patrones de Actividad
**Como** auditor del sistema  
**Quiero** identificar patrones en los eventos de auditoría  
**Para** detectar anomalías o comportamientos inusuales

#### Criterios de Aceptación:
- **Información contextual incluida:**
  - Dirección IP del usuario
  - User-Agent del navegador para detectar dispositivos
  - URL de la acción realizada
  - Timestamp preciso del evento
- **Datos de cambios:**
  - Valores anteriores (`old_values`)
  - Valores nuevos (`new_values`)
  - Comparación lado a lado de cambios
- Se pueden identificar patrones de:
  - Accesos desde IPs inusuales
  - Cambios masivos en períodos cortos
  - Actividades fuera de horario normal

### HU-BIT-007: Rastrear Cambios Críticos
**Como** administrador del sistema  
**Quiero** identificar rápidamente cambios en datos críticos  
**Para** mantener seguridad y integridad del sistema

#### Criterios de Aceptación:
- **Eventos críticos auditados:**
  - Cambios en usuarios y roles
  - Modificaciones de permisos
  - Cambios de estado en reportes
  - Asignaciones de empleados-puestos
  - Modificaciones en configuración del sistema
- **Información detallada de cambios:**
  - Qué campos específicos cambiaron
  - Valores antes y después del cambio
  - Quién realizó el cambio
  - Desde qué IP y dispositivo
- **Modelos con auditoría activa:**
  - All models implement `Auditable` interface
  - Use `\OwenIt\Auditing\Auditable` trait
  - Automatic logging of all CRUD operations

### HU-BIT-008: Generar Reportes de Cumplimiento
**Como** auditor de cumplimiento  
**Quiero** extraer información de auditoría en formatos útiles  
**Para** generar reportes regulatorios y de cumplimiento

#### Criterios de Aceptación:
- **Información exportable:**
  - Todos los campos de auditoría disponibles
  - Filtros aplicados se reflejan en exportación
  - Formato tabular con columnas claramente definidas
- **Datos contextuales incluidos:**
  - Información del usuario (nombre completo, email)
  - Detalles del modelo afectado
  - Descripción legible del evento
  - Metadatos técnicos para verificación
- **Capacidades de filtrado avanzado:**
  - Múltiples filtros simultáneos
  - Rangos de fecha precisos
  - Filtros por tipo de operación
  - Búsqueda por usuarios específicos

### HU-BIT-009: Optimización de Consultas de Auditoría
**Como** sistema  
**Quiero** optimizar consultas de auditoría para gran volumen de datos  
**Para** mantener performance aceptable en análisis histórico

#### Criterios de Aceptación:
- **Estrategias de optimización:**
  - Índices apropiados en tabla de auditorías
  - Consultas lazy loading para relaciones
  - Paginación obligatoria para evitar sobrecarga
  - Filtros obligatorios para limitar dataset inicial
- **Gestión de memoria:**
  - No cargar datasets completos sin filtros
  - Uso de `LengthAwarePaginator` vacío como default
  - Consultas eficientes con JOINs optimizados
- **Performance monitoring:**
  - Tiempo de respuesta aceptable (<2 segundos)
  - Uso de caché donde sea apropiado
  - Logging de consultas lentas para optimización

### HU-BIT-010: Integración con Sistema de Alertas
**Como** sistema  
**Quiero** integrar auditoría con sistema de alertas  
**Para** notificar automáticamente sobre eventos críticos

#### Criterios de Aceptación:
- **Eventos que generan alertas:**
  - Múltiples intentos de login fallidos
  - Cambios críticos fuera de horario
  - Eliminaciones masivas de datos
  - Accesos desde ubicaciones inusuales
- **Información en alertas:**
  - Usuario involucrado
  - Tipo de evento
  - Timestamp del evento
  - Información contextual relevante
- **Canales de notificación:**
  - Email para administradores
  - Logs de sistema para monitoreo
  - Dashboard de alertas en tiempo real
- **Configuración flexible:**
  - Umbrales configurables
  - Tipos de eventos monitoreados
  - Destinatarios de notificaciones

---

## Funcionalidades Técnicas

### HU-BIT-011: Configuración de Auditoría por Modelo
**Como** desarrollador del sistema  
**Quiero** configurar auditoría específica por modelo  
**Para** controlar qué información se registra y cómo

#### Criterios de Aceptación:
- **Implementación estándar:**
  - Interface `Auditable` en modelos críticos
  - Trait `\OwenIt\Auditing\Auditable`
  - Configuración en `config/audit.php`
- **Información registrada automáticamente:**
  - ID del usuario que realizó la acción
  - Timestamp preciso del evento
  - Tipo de modelo afectado
  - ID del registro modificado
  - Valores antes y después del cambio
  - Información del request HTTP
- **Eventos auditados:**
  - created: cuando se crea un registro
  - updated: cuando se modifica un registro
  - deleted: cuando se elimina un registro
  - Eventos personalizados según necesidad

### HU-BIT-012: Limpieza y Mantenimiento de Auditoría
**Como** administrador del sistema  
**Quiero** gestionar el crecimiento de datos de auditoría  
**Para** mantener performance y storage bajo control

#### Criterios de Aceptación:
- **Políticas de retención:**
  - Datos críticos: retención mínima de 1 año
  - Datos operacionales: retención de 6 meses
  - Datos de desarrollo: retención de 30 días
- **Procesos de limpieza:**
  - Comandos de limpieza automatizados
  - Archivado de datos antiguos
  - Compresión de datos históricos
- **Monitoreo de crecimiento:**
  - Alertas por crecimiento acelerado
  - Reportes periódicos de uso de storage
  - Proyecciones de crecimiento futuro

### HU-BIT-013: Seguridad de Logs de Auditoría
**Como** oficial de seguridad  
**Quiero** garantizar integridad de logs de auditoría  
**Para** mantener evidencia confiable para investigaciones

#### Criterios de Aceptación:
- **Protección de integridad:**
  - Logs de auditoría no pueden ser modificados por usuarios
  - Solo inserción de nuevos registros permitida
  - Backup automático de datos críticos
- **Control de acceso:**
  - Solo usuarios con permisos específicos pueden ver auditoría
  - Logs de acceso a los propios logs de auditoría
  - Separación de privilegios para consulta vs gestión
- **Cumplimiento regulatorio:**
  - Formato de logs compatible con estándares
  - Timestamps en UTC para consistencia global
  - Trazabilidad completa de cadena de custodia