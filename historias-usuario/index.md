# Historias de Usuario - Sistema ReportFIA

## Descripción del Sistema

**ReportFIA** es un sistema integral de gestión de incidencias y mantenimiento desarrollado en Laravel, diseñado para la Facultad de Ingeniería y Arquitectura de la Universidad de El Salvador. El sistema permite la creación, asignación, seguimiento y resolución de reportes de incidencias, con un enfoque en la gestión eficiente de recursos y personal técnico.

### Características Principales

- **Sistema de Reportes:** Creación y seguimiento completo de incidencias
- **Gestión de Personal:** Administración de empleados, puestos y asignaciones
- **Control de Inventario:** Gestión de recursos, bienes patrimoniales y consumibles
- **Auditoría Completa:** Registro detallado de todas las operaciones del sistema
- **Análisis y Métricas:** Dashboard estadístico para toma de decisiones
- **Seguridad Avanzada:** Sistema de roles, permisos y autenticación de dos factores
- **PWA Ready:** Aplicación web progresiva con capacidades offline

---

## Módulos del Sistema

### [01. Autenticación y Seguridad](01-autenticacion-seguridad.md)
**16 Historias de Usuario**

Gestión completa de usuarios, roles, permisos y seguridad del sistema.

**Funcionalidades principales:**
- Gestión de usuarios (estudiantes y empleados)
- Sistema de roles y permisos granulares
- Autenticación de dos factores
- Control de dispositivos
- Auditoría de seguridad
- Notificaciones de seguridad

**Tecnologías:** Spatie Permission, Laravel Device Tracking, Laravel Sanctum, Owen-it Auditing

---

### [02. Reportes (Gestión de Incidencias)](02-reportes.md)
**15 Historias de Usuario**

Núcleo del sistema para gestión completa del ciclo de vida de reportes de incidencias.

**Funcionalidades principales:**
- Creación de reportes con evidencias
- Sistema de asignación a equipos técnicos
- Flujo de estados controlado
- Gestión de recursos utilizados
- Detección de duplicados
- Notificaciones automáticas por email

**Estados del flujo:** ASIGNADO → EN_PROCESO → EN_PAUSA → COMPLETADO → FINALIZADO/INCOMPLETO

---

### [03. Mantenimientos (Catálogos del Sistema)](03-mantenimientos.md)  
**36 Historias de Usuario**

Gestión de todos los catálogos maestros necesarios para el funcionamiento del sistema.

**Catálogos incluidos:**
- **Escuelas:** Estructura académica institucional
- **Locales:** Ubicaciones físicas de la institución  
- **Recursos:** Materiales de bodega para mantenimiento
- **Bienes:** Inventario patrimonial institucional
- **Tipos de Incidencias:** Clasificación de reportes
- **Categorías de Reportes:** Clasificación administrativa
- **Fondos:** Fuentes de financiamiento
- **Unidades de Medida:** Cuantificación de recursos

**Funcionalidades transversales:** Importación masiva desde Excel, validaciones consistentes, control de estados activos

---

### [04. Recursos Humanos](04-recursos-humanos.md)
**20 Historias de Usuario**

Gestión completa de la estructura organizacional, puestos de trabajo y asignaciones de personal.

**Funcionalidades principales:**
- **Entidades Organizacionales:** Estructura jerárquica de la facultad
- **Puestos de Trabajo:** Definición de roles institucionales
- **Empleados-Puestos:** Asignaciones de personal a funciones
- **Importación de Empleados:** Carga masiva con envío automático de credenciales
- **Integración con Reportes:** APIs para asignación de trabajo técnico

**Características especiales:** Consultas jerárquicas recursivas, validación de permisos por roles, formateo para componentes UI

---

### [05. Bitácora y Auditoría](05-bitacora-auditoria.md)
**13 Historias de Usuario**

Sistema completo de auditoría y trazabilidad para cumplimiento regulatorio y análisis forense.

**Funcionalidades principales:**
- Consulta de eventos de auditoría con filtros avanzados
- Filtros por modelo, evento, usuario y fechas
- Análisis de patrones de actividad
- Rastreo de cambios críticos
- Optimización para grandes volúmenes de datos
- Seguridad e integridad de logs

**Integración:** Owen-it Laravel Auditing, registro automático de todos los modelos críticos

---

### [06. Estadísticas y Métricas](06-estadisticas.md)
**16 Historias de Usuario**

Dashboard completo de análisis y métricas para toma de decisiones basada en datos.

**Análisis incluidos:**
- **Reportes:** Distribución por estados, tiempos de resolución
- **Recursos:** Más/menos utilizados, distribución por fondos
- **Empleados:** Carga de trabajo, análisis de eficiencia
- **Visualizaciones:** Gráficos interactivos con Chart.js
- **Exportación:** Múltiples formatos para análisis externo

**Métricas avanzadas:** Cálculo de eficiencia con exclusión de tiempo en pausa, comparaciones temporales, alertas basadas en umbrales

---

## Resumen Técnico

### Arquitectura
- **Framework:** Laravel 10.x
- **Frontend:** Blade Templates + TailwindCSS + Chart.js
- **Base de Datos:** MySQL con migraciones versionadas
- **PWA:** Laravel PWA con capacidades offline

### Librerías Principales
- **Spatie Permission:** Roles y permisos granulares
- **Owen-it Auditing:** Sistema de auditoría completo
- **Laravel Device Tracking:** Control de dispositivos
- **Maatwebsite Excel:** Importación/exportación de archivos
- **Laravel Sanctum:** API tokens y autenticación
- **Jenssegers Agent:** Detección de dispositivos y navegadores

### Características de Seguridad
- Autenticación de dos factores
- Control de acceso basado en roles (RBAC)
- Validación de usuarios activos por middleware
- Auditoría completa de operaciones críticas
- Encriptación de contraseñas con bcrypt
- Protección CSRF en todas las operaciones

### Características de UX
- Interfaz responsive con TailwindCSS
- Notificaciones en tiempo real con Notyf
- Paginación consistente en todo el sistema
- Filtros avanzados con estado en URL
- Loaders y feedback visual
- PWA con experiencia nativa

---

## Métricas del Proyecto

### Historias de Usuario por Módulo
- **Autenticación y Seguridad:** 16 HU
- **Reportes:** 15 HU  
- **Mantenimientos:** 36 HU
- **Recursos Humanos:** 20 HU
- **Bitácora y Auditoría:** 13 HU
- **Estadísticas:** 16 HU

**Total: 116 Historias de Usuario**

### Complejidad del Sistema
- **Modelos de datos:** ~25 modelos principales
- **Controladores:** ~15 controladores especializados
- **Roles de usuario:** 6 roles base + roles personalizables
- **Permisos granulares:** ~50 permisos específicos
- **Estados de reportes:** 6 estados con transiciones controladas
- **Tipos de usuarios:** 2 (estudiantes y empleados)

---

## Roadmap de Implementación

### Fase 1: Core del Sistema
1. Autenticación y Seguridad
2. Catálogos básicos (Mantenimientos)
3. Recursos Humanos base

### Fase 2: Funcionalidad Principal  
1. Sistema de Reportes completo
2. Flujos de trabajo y notificaciones
3. Gestión de recursos y bienes

### Fase 3: Analytics y Auditoría
1. Sistema de bitácora completo
2. Dashboard de estadísticas
3. Métricas avanzadas de eficiencia

### Fase 4: Optimización y PWA
1. Optimización de performance
2. Características PWA completas
3. Alertas y notificaciones avanzadas

---

## Contacto y Documentación

Para más información sobre la implementación específica de cada historia de usuario, consulte los archivos individuales de cada módulo. Cada historia incluye criterios de aceptación detallados, validaciones específicas y consideraciones técnicas.

**Desarrollado para:** Facultad de Ingeniería y Arquitectura, Universidad de El Salvador  
**Tecnología base:** Laravel 10.x + MySQL + TailwindCSS  
**Tipo de aplicación:** Progressive Web Application (PWA)