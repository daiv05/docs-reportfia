# Módulo de Estadísticas y Métricas

## Tabla de Contenidos
- [Dashboard de Estadísticas Generales](#dashboard-de-estadisticas-generales)
- [Métricas de Reportes](#metricas-de-reportes)
- [Análisis de Recursos](#analisis-de-recursos)
- [Evaluación de Desempeño de Empleados](#evaluacion-de-desempeno-de-empleados)
- [Visualización y Gráficos](#visualizacion-y-graficos)

---

## Dashboard de Estadísticas Generales

### HU-EST-001: Ver Dashboard de Estadísticas Generales
**Como** usuario con permisos de análisis  
**Quiero** ver un dashboard completo de estadísticas del sistema  
**Para** tomar decisiones informadas basadas en datos

#### Criterios de Aceptación:
- El usuario debe tener permiso `ESTADISTICAS_VER`
- **Filtros temporales disponibles:**
  - Hoy: datos del día actual
  - 7 días: última semana
  - 30 días: último mes
  - Mes: último mes natural
  - Año: último año natural
- **Estadísticas presentadas:**
  - Reportes por estado con gráfico de barras
  - Recursos más utilizados con gráfico circular
  - Recursos menos utilizados con gráfico circular
  - Distribución de recursos por fondos con porcentajes
  - Empleados con más asignaciones (top 5)
  - Empleados con menos asignaciones (bottom 5)
- Todos los filtros se aplican consistentemente a todas las secciones
- Integración con Chart.js para visualizaciones interactivas

### HU-EST-002: Filtros Temporales Dinámicos
**Como** analista del sistema  
**Quiero** aplicar filtros temporales que afecten todas las estadísticas  
**Para** analizar tendencias en diferentes períodos

#### Criterios de Aceptación:
- **Implementación consistente:** el mismo filtro se aplica a todas las consultas
- **Períodos soportados:**
  - hoy: `whereDate('fecha_campo', today())`
  - 7_dias: `where('fecha_campo', '>=', now()->subDays(7))`
  - 30_dias: `where('fecha_campo', '>=', now()->subDays(30))`
  - mes: `where('fecha_campo', '>=', now()->subMonth())`
  - anio: `where('fecha_campo', '>=', now()->subYear())`
- Los filtros se mantienen en la URL para navegación consistente
- Recálculo automático de todas las métricas al cambiar filtro

---

## Métricas de Reportes

### HU-EST-003: Estadísticas de Reportes por Estado
**Como** gestor operativo  
**Quiero** ver la distribución de reportes por estado  
**Para** identificar cuellos de botella en el proceso

#### Criterios de Aceptación:
- **Estados incluidos en el análisis:**
  - Todos los estados activos del enum EstadosEnum
  - "NO ASIGNADO": reportes sin asignación (`accionesReporte` null)
  - "NO PROCEDE": reportes marcados como no procedentes
- **Cálculo de distribución:**
  - Se cuentan reportes que no proceden directamente
  - Para reportes válidos, se obtiene el estado más reciente del historial
  - Se usa el último registro de `historial_acciones_reportes` ordenado por fecha
- **Visualización:**
  - Gráfico de barras con colores distintivos
  - Etiquetas claras para cada estado
  - Conteo numérico visible
- Se aplican filtros temporales a la fecha de creación del reporte

### HU-EST-004: Análisis de Tiempo de Resolución
**Como** gerente de operaciones  
**Quiero** analizar los tiempos de resolución de reportes  
**Para** optimizar procesos y recursos

#### Criterios de Aceptación:
- **Métricas calculadas:**
  - Tiempo promedio de resolución por categoría
  - Reportes finalizados vs en proceso
  - Tendencias temporales de resolución
- **Datos incluidos:**
  - Solo reportes con estado FINALIZADO
  - Cálculo desde fecha de asignación hasta finalización
  - Exclusión de tiempo en pausa para métricas reales
- Se usa el atributo calculado `tiempo_resolucion` del modelo Reporte
- Integración con categorías de reportes para análisis segmentado

---

## Análisis de Recursos

### HU-EST-005: Recursos Más Utilizados
**Como** administrador de inventario  
**Quiero** identificar los recursos más utilizados  
**Para** optimizar compras y disponibilidad

#### Criterios de Aceptación:
- **Datos analizados:**
  - Solo recursos activos
  - Agregación por ID de recurso
  - Suma total de cantidades utilizadas
- **Información mostrada:**
  - Nombre del recurso
  - Cantidad total utilizada
  - Fondos de financiamiento utilizados
  - Unidades de medida asociadas
- **Procesamiento de datos:**
  - JOIN entre `recursos`, `recursos_reportes`, `fondos`, `unidades_medida`
  - Agrupación por recurso con eliminación de duplicados
  - Ordenamiento descendente por cantidad
- **Visualización:** gráfico circular (pie) con top 8 recursos
- Se incluyen arrays únicos de fondos y unidades de medida por recurso

### HU-EST-006: Recursos Menos Utilizados
**Como** administrador de inventario  
**Quiero** identificar recursos subutilizados  
**Para** revisar necesidad de inventario y optimizar almacenamiento

#### Criterios de Aceptación:
- **Misma lógica que recursos más utilizados** pero con ordenamiento ascendente
- **Propósito específico:**
  - Identificar recursos con baja rotación
  - Evaluar necesidad de mantener stock
  - Optimizar espacio de almacenamiento
- **Visualización:** gráfico circular con colores distintivos (tonos rojos/grises)
- Top 8 recursos con menor utilización
- Misma información detallada que recursos más utilizados

### HU-EST-007: Distribución de Recursos por Fondos
**Como** administrador financiero  
**Quiero** ver cómo se distribuye el uso de recursos por fuentes de financiamiento  
**Para** controlar presupuestos y asignaciones

#### Criterios de Aceptación:
- **Análisis financiero:**
  - JOIN entre `recursos_reportes` y `fondos`
  - Agrupación por nombre de fondo
  - Conteo de recursos utilizados por fondo
- **Cálculos de porcentajes:**
  - Total de recursos utilizados como base 100%
  - Porcentaje de participación por fondo
  - Redondeo a 2 decimales para precisión
- **Visualización:**
  - Gráfico circular con porcentajes
  - Etiquetas con nombres de fondos
  - Colores distintivos por fondo
- Se aplican filtros temporales a la fecha de uso del recurso

---

## Evaluación de Desempeño de Empleados

### HU-EST-008: Empleados con Más Asignaciones
**Como** supervisor de equipos  
**Quiero** identificar empleados con mayor carga de trabajo  
**Para** distribuir equitativamente las asignaciones

#### Criterios de Aceptación:
- **Datos analizados:**
  - Solo empleados con asignaciones activas
  - JOIN entre `empleados_acciones`, `empleados_puestos`, `users`, `personas`
  - Conteo de asignaciones por empleado
- **Información mostrada:**
  - Nombre completo del empleado
  - Número total de asignaciones
  - Agrupación por nombre completo para evitar duplicados
- **Visualización:**
  - Gráfico de barras horizontal
  - Top 5 empleados con más asignaciones
  - Colores distintivos y agradables
- Se incluyen empleados con 0 asignaciones usando UNION con empleados sin acciones

### HU-EST-009: Análisis de Eficiencia de Empleados
**Como** gerente de recursos humanos  
**Quiero** calcular índices de eficiencia por empleado  
**Para** evaluar desempeño y identificar necesidades de capacitación

#### Criterios de Aceptación:
- El usuario debe tener permiso `ESTADISTICAS_VER`
- **Filtros avanzados disponibles:**
  - Rango de fechas (formato dd/mm/yyyy)
  - Entidad organizacional
  - Nombre del empleado (búsqueda parcial)
  - Ordenamiento por múltiples campos
  - Dirección de ordenamiento (ASC/DESC)
- **Métricas calculadas por empleado:**
  - Total de reportes finalizados
  - Horas trabajadas (tiempo real sin pausas)
  - Horas en pausa (tiempo acumulado en estado EN_PAUSA)
  - Índice de eficiencia (duración estimada / duración real)
- **Cálculo de eficiencia:**
  - Solo reportes con estado FINALIZADO
  - Comparación contra tiempo promedio por categoría
  - Exclusión de tiempo en pausa del cálculo
  - Promedio ponderado para empleados con múltiples reportes
- **Visualización:**
  - Tabla paginada con 10 empleados por página
  - Gráfico de barras para eficiencia de página actual
  - Ordenamiento configurable por cualquier métrica

### HU-EST-010: Cálculo Complejo de Métricas de Eficiencia
**Como** sistema  
**Quiero** calcular métricas precisas de eficiencia  
**Para** proporcionar análisis confiable de desempeño

#### Criterios de Aceptación:
- **Proceso de cálculo detallado:**
  1. Filtrar usuarios con reportes FINALIZADOS en período especificado
  2. Consolidar reportes por usuario eliminando duplicados
  3. Agrupar reportes por categoría para cada empleado
  4. Calcular tiempo en pausa por reporte analizando historial de estados
  5. Obtener duración real entre fecha/hora inicio y finalización
  6. Comparar contra tiempo estimado según categoría del reporte
- **Unidades de tiempo soportadas:**
  - minutos: factor 1
  - horas: factor 60
  - días: factor 1440 (60 * 24)
  - meses: factor 43200 (60 * 24 * 30)
- **Fórmula de eficiencia:** `(duración_estimada / (duración_real - minutos_en_pausa))`
- **Agregación final:** promedio de eficiencia por empleado
- Manejo de casos edge: división por cero, reportes sin historial, datos faltantes

---

## Visualización y Gráficos

### HU-EST-011: Integración con Chart.js
**Como** sistema  
**Quiero** generar visualizaciones interactivas usando Chart.js  
**Para** facilitar interpretación de datos

#### Criterios de Aceptación:
- **Tipos de gráficos implementados:**
  - bar: gráficos de barras para comparaciones
  - pie: gráficos circulares para distribuciones
  - Configuración responsive para diferentes tamaños de pantalla
- **Estructura de datos estandarizada:**
  - type: tipo de gráfico
  - labels: etiquetas para ejes/segmentos
  - datasets: datos con backgroundColor personalizado
- **Paletas de colores temáticas:**
  - Colores profesionales para diferentes contextos
  - Consistencia visual entre gráficos relacionados
  - Accesibilidad cromática para diferentes usuarios
- Integración seamless con el frontend Laravel/Blade

### HU-EST-012: Optimización de Consultas Estadísticas
**Como** sistema  
**Quiero** optimizar consultas complejas de estadísticas  
**Para** mantener performance aceptable con grandes volúmenes de datos

#### Criterios de Aceptación:
- **Estrategias de optimización:**
  - Uso de índices apropiados en campos de fecha
  - JOINs optimizados para evitar N+1 queries
  - Agregaciones a nivel de base de datos vs aplicación
  - Caching de consultas pesadas cuando sea apropiado
- **Gestión de memoria:**
  - Uso de collections de Laravel para manipulación eficiente
  - Paginación en consultas que retornan muchos registros
  - Lazy loading para relaciones no críticas
- **Monitoreo de performance:**
  - Queries lentas identificadas y optimizadas
  - Métricas de tiempo de respuesta por dashboard
  - Alertas para degradación de performance

### HU-EST-013: Exportación de Datos Estadísticos
**Como** analista de datos  
**Quiero** exportar estadísticas en formatos utilizables  
**Para** realizar análisis externos y reportes ejecutivos

#### Criterios de Aceptación:
- **Formatos de exportación:**
  - CSV para análisis en hojas de cálculo
  - JSON para integración con otros sistemas
  - PDF para reportes ejecutivos
- **Datos incluidos:**
  - Todas las métricas visibles en dashboard
  - Metadatos de filtros aplicados
  - Timestamp de generación del reporte
- **Funcionalidades:**
  - Respeto de filtros temporales aplicados
  - Nombres de archivo descriptivos con fecha
  - Headers apropiados para descarga automática
- Mantenimiento de formato y precisión de datos originales

---

## Funcionalidades Avanzadas

### HU-EST-014: Comparación Temporal de Métricas
**Como** analista de tendencias  
**Quiero** comparar métricas entre diferentes períodos  
**Para** identificar tendencias y patrones estacionales

#### Criterios de Aceptación:
- **Comparaciones soportadas:**
  - Período actual vs período anterior
  - Mismo período año anterior
  - Tendencias semanales/mensuales
- **Visualización de tendencias:**
  - Gráficos de líneas para evolución temporal
  - Indicadores de crecimiento/decrecimiento
  - Porcentajes de cambio destacados
- **Métricas comparables:**
  - Número de reportes por estado
  - Utilización de recursos
  - Eficiencia promedio de empleados
  - Distribución por fondos

### HU-EST-015: Alertas Basadas en Métricas
**Como** supervisor operativo  
**Quiero** recibir alertas cuando métricas excedan umbrales  
**Para** tomar acciones correctivas oportunas

#### Criterios de Aceptación:
- **Umbrales configurables:**
  - Número máximo de reportes pendientes
  - Tiempo promedio de resolución por categoría
  - Eficiencia mínima esperada por empleado
  - Utilización anormal de recursos
- **Tipos de alertas:**
  - Email para supervisores
  - Notificaciones en dashboard
  - Logs de sistema para auditoría
- **Configuración flexible:**
  - Umbrales personalizables por rol
  - Frecuencia de evaluación configurable
  - Escalación automática para alertas críticas

### HU-EST-016: Dashboard Personalizable
**Como** usuario del sistema  
**Quiero** personalizar mi vista de estadísticas  
**Para** enfocarme en métricas relevantes a mi rol

#### Criterios de Aceptación:
- **Personalización soportada:**
  - Orden de widgets en dashboard
  - Visibilidad de secciones específicas
  - Filtros por defecto según preferencias
- **Persistencia de configuración:**
  - Preferencias guardadas por usuario
  - Restauración automática al iniciar sesión
  - Opción de resetear a configuración por defecto
- **Roles predefinidos:**
  - Configuraciones sugeridas por tipo de usuario
  - Permisos respetados en personalización
  - Templates para diferentes departamentos