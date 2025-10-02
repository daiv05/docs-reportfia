# Módulo de Reportes (Gestión de Incidencias)

## Tabla de Contenidos
- [Creación y Visualización de Reportes](#creacion-y-visualizacion-de-reportes)
- [Asignación y Gestión Administrativa](#asignacion-y-gestion-administrativa)
- [Seguimiento y Actualización de Estados](#seguimiento-y-actualizacion-de-estados)
- [Flujos de Trabajo y Notificaciones](#flujos-de-trabajo-y-notificaciones)

---

## Creación y Visualización de Reportes

### HU-REP-001: Crear Reporte de Incidencia
**Como** usuario del sistema (estudiante o empleado)  
**Quiero** crear un reporte de incidencia con evidencias  
**Para** notificar problemas que requieren atención técnica

#### Criterios de Aceptación:
- El usuario debe tener permiso `REPORTES_CREAR`
- **Campos obligatorios:**
  - Tipo de incidencia (debe existir y estar activo)
  - Descripción (máximo 255 caracteres, solo alfanuméricos y signos permitidos)
- **Campos opcionales:**
  - Local/ubicación (debe existir si se especifica)
  - Hasta 5 evidencias fotográficas (PNG, JPG, JPEG, máximo 10MB cada una)
- **Validación de duplicados:**
  - Se buscan reportes similares en las últimas 48 horas
  - Criterios: mismo tipo de incidencia, descripción y local
  - Solo se consideran reportes no finalizados
  - Si se detecta duplicado, se debe confirmar explícitamente el envío
- **Proceso de guardado:**
  - Se registra fecha y hora automáticamente
  - Las evidencias se almacenan con nombres aleatorios (40 caracteres)
  - Se genera entrada en `reportes` y `reporte_evidencias`
- Respuesta exitosa redirige a "Mis Reportes"
- Se registra auditoría de la creación

### HU-REP-002: Ver Listado General de Reportes
**Como** administrador o gestor  
**Quiero** visualizar todos los reportes del sistema con filtros avanzados  
**Para** supervisar la operación y gestionar asignaciones

#### Criterios de Aceptación:
- El usuario debe tener permiso `REPORTES_VER_LISTADO_GENERAL`
- **Filtros disponibles:**
  - Por período: hoy, últimos 7 días, 30 días, mes, año
  - Por estado: no procede, no asignado, asignado, en proceso, en pausa, completado, finalizado, incompleto
  - Por tipo de incidencia (solo tipos activos)
- Los filtros se pueden combinar y mantienen estado en la URL
- Paginación con 15 registros por página
- Se muestran datos básicos: fecha, descripción, estado, tipo, usuario reportante
- Cada reporte muestra acciones disponibles según permisos y estado

### HU-REP-003: Ver Mis Reportes Creados
**Como** usuario que crea reportes  
**Quiero** ver únicamente los reportes que he creado  
**Para** dar seguimiento a mis solicitudes

#### Criterios de Aceptación:
- El usuario debe tener permiso `REPORTES_CREAR`
- Solo se muestran reportes donde `id_usuario_reporta` coincide con el usuario actual
- Mismos filtros que el listado general
- Paginación y ordenamiento consistente
- Acceso directo al detalle de cada reporte propio

### HU-REP-004: Ver Mis Asignaciones
**Como** empleado o supervisor  
**Quiero** ver los reportes asignados a mí  
**Para** gestionar mi carga de trabajo

#### Criterios de Aceptación:
- El usuario debe tener permiso `REPORTES_VER_ASIGNACIONES`
- Se muestran reportes donde el usuario es:
  - Supervisor del reporte (en `acciones_reportes.id_usuario_supervisor`)
  - Empleado asignado (en `empleados_acciones` a través de `empleados_puestos`)
- Mismos filtros que otros listados
- Se prioriza por estados que requieren acción del usuario

### HU-REP-005: Ver Detalle Completo del Reporte
**Como** usuario involucrado en un reporte  
**Quiero** ver toda la información y historial del reporte  
**Para** comprender el contexto y estado actual

#### Criterios de Aceptación:
- **Control de acceso:**
  - Estudiantes: solo pueden ver reportes propios
  - Empleados/supervisores: pueden ver reportes asignados
  - Administradores: pueden ver cualquier reporte
- **Información mostrada:**
  - Datos básicos: fecha, hora, descripción, usuario reportante, local, tipo
  - Estado actual y tiempo de resolución calculado
  - Historial completo de estados con fechas, comentarios y evidencias
  - Empleados asignados y supervisor
  - Bienes asociados (si aplica)
  - Recursos utilizados por acción
  - Evidencias adjuntas
- **Acciones disponibles según rol y estado:**
  - Asignar (solo administradores en reportes no asignados)
  - Marcar como "No Procede" (solo administradores)
  - Actualizar estado (empleados asignados y supervisores)

---

## Asignación y Gestión Administrativa

### HU-REP-006: Asignar Reporte a Equipo de Trabajo
**Como** administrador del sistema  
**Quiero** asignar reportes a equipos específicos con supervisor  
**Para** garantizar atención oportuna y responsabilidad clara

#### Criterios de Aceptación:
- El usuario debe tener permiso `REPORTES_ASIGNAR`
- Solo se pueden asignar reportes no asignados previamente
- **Campos obligatorios para asignación:**
  - Entidad responsable (debe existir y estar activa)
  - Empleados asignados (mínimo uno, deben existir en empleados_puestos)
  - Supervisor (debe existir en empleados_puestos)
  - Categoría de reporte (debe existir y estar activa)
- **Campos opcionales:**
  - Comentarios administrativos
  - Bienes asociados (pueden ser múltiples)
- **Proceso transaccional:**
  - Se crea registro en `acciones_reportes`
  - Se crea historial inicial en `historial_acciones_reportes` con estado ASIGNADO
  - Se registran empleados en `empleados_acciones`
  - Se asocian bienes en `reporte_bienes` (si se especifican)
- **Notificaciones automáticas:**
  - Email a todos los empleados asignados
  - Email diferenciado al supervisor
  - Plantillas específicas según rol
- Respuesta exitosa redirige al detalle del reporte

### HU-REP-007: Marcar Reporte como No Procede
**Como** administrador del sistema  
**Quiero** marcar reportes como "No Procede" con justificación  
**Para** gestionar reportes que no requieren acción técnica

#### Criterios de Aceptación:
- El usuario debe tener permiso `REPORTES_ASIGNAR`
- Solo aplicable a reportes no asignados
- **Validaciones:**
  - Justificación obligatoria (solo caracteres alfanuméricos y signos de puntuación)
  - Mínimo 1 caracter de justificación
- El campo `no_procede` se invierte (true/false)
- Se guarda justificación en `descripcion_no_procede`
- Se registra auditoría del cambio
- Respuesta redirige al detalle con mensaje de confirmación

### HU-REP-008: Verificar Duplicidad de Reportes
**Como** sistema  
**Quiero** detectar automáticamente reportes duplicados  
**Para** evitar trabajo redundante y mejorar eficiencia

#### Criterios de Aceptación:
- Se ejecuta automáticamente al crear reportes (cuando forzar_envio = 0)
- **Criterios de duplicidad:**
  - Mismo tipo de incidencia
  - Misma descripción exacta
  - Mismo local (si aplica)
  - Creado en las últimas 48 horas
  - No debe estar finalizado
- Endpoint AJAX `/reportes/verificar-duplicidad` para validación en tiempo real
- Respuesta JSON con campo `duplicado: boolean`
- Si se detecta duplicado, se requiere confirmación explícita del usuario

---

## Seguimiento y Actualización de Estados

### HU-REP-009: Actualizar Estado del Reporte
**Como** empleado asignado o supervisor  
**Quiero** actualizar el estado del reporte con evidencias y recursos  
**Para** documentar el progreso y consumo de materiales

#### Criterios de Aceptación:
- El usuario debe tener permiso `REPORTES_ACTUALIZAR_ESTADO`
- **Control de acceso por rol:**
  - Empleados asignados: pueden actualizar a cualquier estado excepto FINALIZADO/INCOMPLETO
  - Supervisores: pueden actualizar a cualquier estado incluyendo FINALIZADO/INCOMPLETO
  - Solo usuarios relacionados al reporte pueden actualizar
- **Estados disponibles:** ASIGNADO(1), EN_PROCESO(2), EN_PAUSA(3), COMPLETADO(4), FINALIZADO(5), INCOMPLETO(6)
- **Campos obligatorios:**
  - Estado nuevo (debe ser válido según flujo)
  - Comentario de la acción (máximo 255 caracteres, caracteres permitidos validados)
- **Campos opcionales:**
  - Evidencia fotográfica (PNG, JPG, JPEG, máximo 10MB)
  - Recursos utilizados (estructura JSON con cantidad, fondo, recurso, unidad de medida)
- **Validaciones de recursos:**
  - Cantidad máxima 100 por recurso
  - Todos los IDs deben existir en sus respectivas tablas
  - Estructura de array válida
- **Proceso transaccional:**
  - Se crea nuevo registro en `historial_acciones_reportes`
  - Si hay evidencia, se almacena con nombre aleatorio
  - Se registran recursos en `recursos_reportes`
  - Si estado es FINALIZADO, se registra fecha/hora de finalización
- **Flujo de notificaciones específico por estado:**
  - COMPLETADO: notifica al supervisor para revisión
  - FINALIZADO/INCOMPLETO: notifica a empleados asignados

### HU-REP-010: Gestión de Recursos en Reportes
**Como** empleado técnico  
**Quiero** registrar los recursos utilizados en cada acción  
**Para** llevar control de inventario y costos

#### Criterios de Aceptación:
- Integrado en la actualización de estados
- **Estructura de datos por recurso:**
  - Cantidad utilizada (entero, máximo 100)
  - Recurso específico (debe existir y estar activo)
  - Fondo de financiamiento (debe existir y estar activo)  
  - Unidad de medida (debe existir y estar activa)
  - Comentario heredado de la acción
- Se almacena en tabla `recursos_reportes` vinculado al historial
- Validaciones individuales por cada recurso en el array
- Endpoint `/reportes/buscar-recursos` para autocompletado con filtros por nombre

### HU-REP-011: Ver Informe Completo de Reporte
**Como** supervisor o administrador  
**Quiero** generar un informe detallado del reporte  
**Para** evaluar desempeño y tomar decisiones

#### Criterios de Aceptación:
- El usuario debe tener permiso `REPORTES_ASIGNAR` o `REPORTES_REVISION_SOLUCION`
- **Información del informe:**
  - Datos básicos del reporte y tiempos
  - Duración total calculada (desde asignación hasta finalización)
  - Empleados participantes y supervisor asignado
  - Entidad responsable
  - Lista de recursos utilizados con costos
  - Historial completo de acciones
  - Comentarios del supervisor
  - Evidencias por cada acción
- **Cálculos automáticos:**
  - Tiempo de resolución en formato legible
  - Estado "En progreso" si no está finalizado
  - Agregación de recursos por tipo y fondo
- Vista específica para impresión o exportación

---

## Flujos de Trabajo y Notificaciones

### HU-REP-012: Sistema de Notificaciones por Email
**Como** sistema  
**Quiero** enviar notificaciones automáticas por email  
**Para** mantener informados a los involucrados sobre cambios de estado

#### Criterios de Aceptación:
- **Tipos de notificaciones:**
  - Asignación inicial: a empleados asignados y supervisor (plantillas diferenciadas)
  - Completado por empleado: solo al supervisor
  - Finalizado por supervisor: a todos los empleados asignados
  - Incompleto por supervisor: a todos los empleados asignados
- **Información incluida en emails:**
  - Datos del reporte (ID, descripción, fecha)
  - Acción realizada y por quién
  - Enlaces directos al detalle (si aplica)
  - Información específica según rol del destinatario
- Se usa la clase `ReporteMailable` con plantillas Blade específicas
- Los emails son transaccionales y críticos para el flujo de trabajo

### HU-REP-013: Control de Estados y Transiciones
**Como** sistema  
**Quiero** controlar las transiciones válidas entre estados  
**Para** mantener integridad en el flujo de trabajo

#### Criterios de Aceptación:
- **Estados definidos en EstadosEnum:**
  - ASIGNADO (1): Estado inicial tras asignación
  - EN_PROCESO (2): Trabajo en progreso
  - EN_PAUSA (3): Trabajo temporalmente detenido
  - COMPLETADO (4): Trabajo terminado, pendiente revisión
  - FINALIZADO (5): Aprobado y cerrado por supervisor
  - INCOMPLETO (6): Rechazado por supervisor, requiere más trabajo
- **Transiciones controladas:**
  - Solo supervisores pueden marcar como FINALIZADO/INCOMPLETO
  - Solo empleados asignados pueden marcar otros estados
  - Estados finales no permiten regresión
- El controlador `EstadoController` determina estados permitidos según contexto
- Se valida la transición antes de permitir el cambio

### HU-REP-014: Filtrado Avanzado y Búsquedas
**Como** usuario del sistema  
**Quiero** filtrar reportes por múltiples criterios  
**Para** encontrar rápidamente la información relevante

#### Criterios de Aceptación:
- **Filtros temporales:**
  - Hoy: reportes de la fecha actual
  - 7 días: última semana
  - 30 días: último mes
  - Mes: último mes natural
  - Año: último año natural
- **Filtros por estado:**
  - No procede: reportes marcados como no procedentes
  - No asignado: reportes sin asignación y que proceden
  - Estados específicos: según el último estado en el historial
- **Filtro por tipo de incidencia:**
  - Solo tipos activos
  - Búsqueda por ID específico
- Los filtros se combinan con AND lógico
- Se mantiene estado en la URL para navegación
- Validación de valores permitidos en cada filtro

### HU-REP-015: Cálculo Automático de Métricas
**Como** sistema  
**Quiero** calcular automáticamente métricas del reporte  
**Para** proporcionar información de desempeño

#### Criterios de Aceptación:
- **Tiempo de resolución calculado:**
  - Desde fecha de asignación hasta finalización
  - Si no está finalizado: tiempo transcurrido hasta ahora
  - Formato legible: "X meses, Y días, Z horas, W minutos"
- **Estado actual:**
  - Se obtiene del último registro en historial_acciones_reportes
  - Se incluye información del estado y empleado que lo estableció
- **Relación del usuario:**
  - Indica si el usuario actual es creador, supervisor o empleado asignado
  - Se usa para mostrar acciones disponibles en la interfaz
- Los cálculos se realizan en tiempo real mediante atributos del modelo
- Se optimizan las consultas para evitar N+1 queries