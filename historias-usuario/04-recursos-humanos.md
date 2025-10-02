# Módulo de Recursos Humanos

## Tabla de Contenidos
- [Gestión de Entidades Organizacionales](#gestion-de-entidades-organizacionales)
- [Gestión de Puestos de Trabajo](#gestion-de-puestos-de-trabajo)
- [Gestión de Empleados y Asignaciones](#gestion-de-empleados-y-asignaciones)
- [Integración con Sistema de Reportes](#integracion-con-sistema-de-reportes)

---

## Gestión de Entidades Organizacionales

### HU-RHU-001: Crear Entidad Organizacional
**Como** administrador de recursos humanos  
**Quiero** crear entidades organizacionales con estructura jerárquica  
**Para** reflejar la organización institucional en el sistema

#### Criterios de Aceptación:
- El usuario debe tener permiso `ENTIDADES_CREAR`
- **Validaciones obligatorias:**
  - Nombre: único, máximo 50 caracteres, solo alfanuméricos y espacios
  - Descripción: obligatoria, máximo 250 caracteres
  - Estado activo: obligatorio (booleano)
  - Entidad padre: opcional, debe existir si se especifica
- **Gestión de jerarquía automática:**
  - Si no tiene padre: jerarquía = 0 (nivel raíz)
  - Si tiene padre: jerarquía = jerarquía del padre + 1
- Se registra auditoría de la creación
- Respuesta exitosa redirige al listado con confirmación

### HU-RHU-002: Listar y Filtrar Entidades
**Como** administrador de recursos humanos  
**Quiero** visualizar todas las entidades con filtros  
**Para** gestionar la estructura organizacional

#### Criterios de Aceptación:
- El usuario debe tener permiso `ENTIDADES_VER`
- **Filtro disponible:**
  - Por nombre: búsqueda parcial, máximo 50 caracteres, alfanuméricos y espacios
- Paginación con 15 registros por página
- Se muestra información básica y estructura jerárquica
- **Vista jerárquica:** se incluye lista de entidades con formato "Padre --> Hijo"
- Solo entidades activas aparecen en selectores

### HU-RHU-003: Editar Entidad Existente
**Como** administrador de recursos humanos  
**Quiero** modificar entidades organizacionales  
**Para** mantener actualizada la estructura

#### Criterios de Aceptación:
- El usuario debe tener permiso `ENTIDADES_EDITAR`
- **Validaciones:** mismas que en creación pero excluyendo ID actual para unicidad
- **Validaciones especiales de jerarquía:**
  - No puede seleccionarse a sí misma como padre
  - No puede seleccionar un descendiente como padre
  - Se valida que no se creen ciclos en la jerarquía
- **Recálculo automático de jerarquía:**
  - Se actualiza el nivel jerárquico según el nuevo padre
  - Se mantiene integridad estructural
- Respuesta exitosa redirige al listado

### HU-RHU-004: Cambiar Estado de Entidad
**Como** administrador de recursos humanos  
**Quiero** activar/desactivar entidades  
**Para** controlar su disponibilidad sin eliminarlas

#### Criterios de Aceptación:
- El usuario debe tener permiso `ENTIDADES_EDITAR`
- Se invierte el estado actual (activo/inactivo)
- Cambio inmediato sin confirmación
- Se registra auditoría del cambio

### HU-RHU-005: Gestionar Jerarquía Organizacional
**Como** sistema  
**Quiero** mantener la integridad de la estructura jerárquica  
**Para** evitar inconsistencias organizacionales

#### Criterios de Aceptación:
- **Algoritmo de validación de descendientes:**
  - Se recorre la cadena jerárquica hacia arriba
  - Se verifica que el nuevo padre no sea descendiente de la entidad actual
  - Se previenen ciclos infinitos
- **Cálculo automático de niveles:**
  - Nivel 0: entidades raíz sin padre
  - Nivel N+1: entidades cuyo padre está en nivel N
- **Vista jerárquica recursiva:**
  - Se construye árbol con nombres completos "Padre --> Hijo --> Nieto"
  - Se mantiene ordenamiento por ID para consistencia

---

## Gestión de Puestos de Trabajo

### HU-RHU-006: Crear Puesto de Trabajo
**Como** administrador de recursos humanos  
**Quiero** crear puestos de trabajo asociados a entidades  
**Para** definir la estructura de roles institucional

#### Criterios de Aceptación:
- El usuario debe tener permiso `PUESTOS_CREAR`
- **Validaciones obligatorias:**
  - Nombre: máximo 50 caracteres, solo alfanuméricos y espacios
  - Entidad: debe existir y estar activa
  - Estado activo: obligatorio (booleano)
- **Validación de unicidad:**
  - No puede existir otro puesto con el mismo nombre en la misma entidad
  - Se valida antes de guardar
- Se registra auditoría de la creación
- Respuesta exitosa redirige al listado

### HU-RHU-007: Listar y Filtrar Puestos
**Como** administrador de recursos humanos  
**Quiero** visualizar todos los puestos con filtros avanzados  
**Para** gestionar la estructura de roles

#### Criterios de Aceptación:
- El usuario debe tener permiso `PUESTOS_VER`
- **Filtros disponibles:**
  - Por entidad: selector de entidades activas
  - Por nombre: búsqueda parcial, máximo 50 caracteres, alfanuméricos y espacios
- Paginación con 15 registros por página
- Se muestran: nombre, entidad asociada, estado, fechas, acciones
- Los filtros se pueden combinar y mantienen estado en la URL

### HU-RHU-008: Editar Puesto Existente
**Como** administrador de recursos humanos  
**Quiero** modificar puestos de trabajo  
**Para** mantener actualizada la estructura de roles

#### Criterios de Aceptación:
- El usuario debe tener permiso `PUESTOS_EDITAR`
- **Validaciones:** mismas que en creación
- **Validación de unicidad:** excluye el ID actual de la validación
- Se pueden modificar todos los campos (nombre, entidad, estado)
- Respuesta exitosa redirige al listado
- Se registra auditoría del cambio

### HU-RHU-009: Cambiar Estado de Puesto
**Como** administrador de recursos humanos  
**Quiero** activar/desactivar puestos  
**Para** controlar su disponibilidad para asignaciones

#### Criterios de Aceptación:
- El usuario debe tener permiso `PUESTOS_EDITAR`
- Se usa el método `toggleActivo()` estándar
- Cambio inmediato reflejado en listado
- Puestos inactivos no aparecen en selectores de asignación

---

## Gestión de Empleados y Asignaciones

### HU-RHU-010: Asignar Empleado a Puesto
**Como** administrador de recursos humanos  
**Quiero** asignar empleados a puestos específicos  
**Para** definir responsabilidades laborales

#### Criterios de Aceptación:
- El usuario debe tener permiso `ASIGNAR_PUESTOS_EMPLEADOS`
- **Validaciones obligatorias:**
  - Empleado: debe existir en tabla users y estar activo
  - Puesto: debe existir en tabla puestos y estar activo
  - Estado: obligatorio (booleano)
- **Validación de duplicados:**
  - No puede existir la misma asignación empleado-puesto
  - Si existe, mensaje de advertencia específico
- **Proceso transaccional:** rollback si hay errores
- Respuesta exitosa con mensaje de confirmación

### HU-RHU-011: Listar y Filtrar Empleados-Puestos
**Como** administrador de recursos humanos  
**Quiero** visualizar todas las asignaciones con filtros múltiples  
**Para** gestionar el personal y sus responsabilidades

#### Criterios de Aceptación:
- El usuario debe tener permiso `VER_PUESTOS_EMPLEADOS`
- **Filtros avanzados disponibles:**
  - Por entidad: selector de entidades activas
  - Por puesto: selector de puestos activos agrupados por entidad
  - Por empleado: búsqueda por nombre completo, máximo 100 caracteres, solo letras y espacios
  - Por rol del usuario: selector de roles activos
- **Datos mostrados:**
  - Información personal del empleado (nombre, carnet, email)
  - Puesto asignado y entidad
  - Roles del usuario en el sistema
  - Estado de la asignación
- Paginación con 15 registros por página
- **Optimización de consultas:** uso de `with()` para cargar relaciones

### HU-RHU-012: Actualizar Estado de Asignación
**Como** administrador de recursos humanos  
**Quiero** cambiar el estado de asignaciones empleado-puesto  
**Para** controlar asignaciones activas e inactivas

#### Criterios de Aceptación:
- El usuario debe tener permiso `EDITAR_PUESTOS_EMPLEADOS`
- Solo se puede cambiar el campo `activo` (booleano)
- Validación de existencia de la asignación
- **Manejo de errores:** try-catch con mensajes específicos
- Respuesta exitosa redirige al listado

### HU-RHU-013: Ver Detalle de Empleado-Puesto
**Como** administrador de recursos humanos  
**Quiero** ver el detalle completo de una asignación  
**Para** revisar información y actividad del empleado

#### Criterios de Aceptación:
- El usuario debe tener permiso `VER_PUESTOS_EMPLEADOS`
- **Información mostrada:**
  - Datos del empleado (personal y de sistema)
  - Información del puesto y entidad
  - Historial de reportes en los que ha participado
  - Acciones realizadas en reportes
- Se cargan todas las relaciones necesarias con una consulta optimizada

### HU-RHU-014: Importar Empleados desde Excel
**Como** administrador de recursos humanos  
**Quiero** importar empleados masivamente con validación avanzada  
**Para** agilizar la carga de personal

#### Criterios de Aceptación:
- El usuario debe tener permiso `ASIGNAR_PUESTOS_EMPLEADOS`
- **Archivo válido:** formatos xlsx, xls, csv
- Se usa la clase `EmpleadoImport` personalizada
- **Proceso de validación completa:**
  - Si hay errores, no se guarda nada (rollback completo)
  - Se muestran errores específicos por fila
  - Se diferencia entre errores de validación y otros errores
- **Flujo de importación exitosa:**
  - Se crean usuarios y asignaciones en transacción
  - Se envían credenciales por email automáticamente
  - Se registra log detallado de la operación
- **Manejo de errores de notificación:**
  - Si falla envío de credenciales, se registra el error pero no se cancela la importación
  - Se informa al usuario sobre problemas de notificación
- **Retroalimentación completa:**
  - Cantidad de empleados importados
  - Errores específicos por fila
  - Estado del envío de credenciales

---

## Integración con Sistema de Reportes

### HU-RHU-015: Obtener Empleados por Entidad para Reportes
**Como** administrador de reportes  
**Quiero** obtener empleados disponibles por entidad jerárquica  
**Para** asignar reportes al personal apropiado

#### Criterios de Aceptación:
- El usuario debe tener permiso `REPORTES_CREAR`
- **Endpoint AJAX:** `/recursos-humanos/empleados-por-unidad/{id_unidad}`
- **Filtros automáticos aplicados:**
  - Solo empleados con asignaciones activas
  - Solo usuarios activos en el sistema
  - Solo usuarios con rol que tenga permiso `REPORTES_ACTUALIZAR_ESTADO`
- **Búsqueda jerárquica:**
  - Se incluyen empleados de la entidad especificada
  - Se incluyen empleados de entidades hijas (recursivo)
  - Se usa consulta SQL recursiva para obtener jerarquía completa
- **Respuesta JSON estructurada:**
  - ID de empleado-puesto, datos personales, puesto, email
  - Formato ready-to-use para componentes de UI
- **Manejo de errores:** respuesta vacía si hay problemas

### HU-RHU-016: Obtener Lista de Supervisores
**Como** administrador de reportes  
**Quiero** obtener empleados que pueden supervisar reportes  
**Para** asignar supervisión apropiada

#### Criterios de Aceptación:
- **Filtros específicos para supervisores:**
  - Solo empleados con asignaciones activas
  - Solo usuarios activos
  - Solo usuarios con rol que tenga permiso `REPORTES_REVISION_SOLUCION`
- **Respuesta consistente:** mismo formato que empleados por entidad
- Se usa para asignar supervisores en reportes
- **Manejo de errores:** lista vacía si no hay supervisores disponibles

### HU-RHU-017: Consulta Jerárquica Recursiva
**Como** sistema  
**Quiero** obtener entidades con sus hijas usando consulta recursiva  
**Para** manejar estructuras organizacionales complejas

#### Criterios de Aceptación:
- **Query SQL recursiva (CTE):**
  - Inicia con la entidad especificada
  - Recursivamente incluye entidades hijas
  - Evita bucles infinitos
- **Método estático reutilizable:** `obtenerEntidadesConHijos($idEntidad)`
- Se usa en múltiples funcionalidades que requieren jerarquía
- **Compatibilidad:** funciona con MySQL 8.0+ que soporta CTEs

### HU-RHU-018: Validación de Permisos por Roles
**Como** sistema  
**Quiero** validar que usuarios tengan permisos específicos vía roles  
**Para** controlar acceso granular a funcionalidades

#### Criterios de Aceptación:
- **Integración con Spatie Permission:**
  - Se consultan roles que tengan permisos específicos
  - Se filtran usuarios por pertenencia a estos roles
- **Permisos validados:**
  - `REPORTES_ACTUALIZAR_ESTADO`: para empleados técnicos
  - `REPORTES_REVISION_SOLUCION`: para supervisores
- **Performance optimizada:** consultas eficientes que evitan N+1 queries
- Se usa en tiempo real para determinar disponibilidad de empleados

### HU-RHU-019: Formateo de Datos para Componentes UI
**Como** sistema  
**Quiero** formatear datos de empleados para componentes de interfaz  
**Para** facilitar integración con frontend

#### Criterios de Aceptación:
- **Formato estándar para picklist/select:**
  - ID numérico para identificación
  - Nombre completo legible
  - Información adicional (email, puesto) para contexto
- **Mapeo consistente:** se usa `collect()->map()` para transformaciones
- **Datos incluidos:**
  - ID de empleado-puesto (para asignaciones)
  - Nombre completo del empleado
  - Puesto y correo electrónico
  - Información adicional según contexto
- **Respuesta JSON optimizada:** solo campos necesarios para reducir payload

### HU-RHU-020: Logging y Auditoría de RHU
**Como** sistema  
**Quiero** registrar todas las operaciones críticas de RHU  
**Para** mantener trazabilidad y cumplimiento

#### Criterios de Aceptación:
- **Auditoría automática:** trait `Auditable` en modelos críticos
- **Logging específico para importaciones:**
  - Detalles del archivo importado
  - Cantidad de registros procesados
  - Errores específicos con contexto
  - Información de usuario que realizó la operación
- **Niveles de log apropiados:**
  - INFO: operaciones exitosas
  - ERROR: fallos de validación y errores de sistema
  - WARNING: situaciones que requieren atención
- **Información contextual:** usuario, timestamp, datos relevantes
- Se integra con sistema centralizado de auditoría