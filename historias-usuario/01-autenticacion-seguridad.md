# Módulo de Autenticación y Seguridad

## Tabla de Contenidos
- [Gestión de Usuarios](#gestion-de-usuarios)
- [Gestión de Roles](#gestion-de-roles)
- [Autenticación y Perfil](#autenticacion-y-perfil)
- [Seguridad y Control de Acceso](#seguridad-y-control-de-acceso)

---

## Gestión de Usuarios

### HU-AUTH-001: Crear Usuario del Sistema
**Como** administrador del sistema  
**Quiero** crear nuevos usuarios (estudiantes y empleados)  
**Para** darles acceso controlado a las funcionalidades del sistema

#### Criterios de Aceptación:
- El usuario debe tener permiso `USUARIOS_CREAR`
- Se pueden crear dos tipos de usuarios: estudiantes y empleados
- **Para estudiantes:**
  - El correo debe ser institucional (@ues.edu.sv)
  - Debe asignarse a una escuela existente y activa
  - Se asigna automáticamente el rol "USUARIO" si no se especifican otros roles
- **Para empleados:**
  - Debe asignarse a un puesto existente y activo
  - Se crea automáticamente un registro en `EmpleadoPuesto`
- **Validaciones generales:**
  - Nombre y apellido: solo letras y espacios, máximo 100 caracteres
  - Carnet: único, 3-20 caracteres, formato alfanumérico válido
  - Email: único, formato válido
  - Teléfono: formato internacional opcional
  - Fecha de nacimiento: formato dd/mm/yyyy opcional
- Se genera una contraseña temporal de 16 caracteres aleatorios
- Se envía notificación por email con las credenciales de acceso
- Se registra auditoría de la creación del usuario
- Respuesta exitosa redirige al listado de usuarios
- Errores muestran mensajes específicos por campo

### HU-AUTH-002: Listar y Filtrar Usuarios
**Como** administrador del sistema  
**Quiero** visualizar todos los usuarios del sistema con filtros  
**Para** gestionar eficientemente los accesos y permisos

#### Criterios de Aceptación:
- El usuario debe tener permiso `USUARIOS_VER`
- Se muestra información básica: nombre completo, email, roles, estado
- **Filtros disponibles:**
  - Por nombre completo (búsqueda parcial, solo letras y espacios)
  - Por email (búsqueda parcial, validación de formato)
  - Por rol específico
- Los filtros se pueden combinar y mantienen estado en la URL
- Paginación con 15 registros por página (valor de `GeneralEnum::PAGINACION`)
- Solo se muestran roles activos en el filtro de roles
- Los datos se cargan con relaciones optimizadas (roles, persona)

### HU-AUTH-003: Ver Detalle de Usuario
**Como** administrador del sistema  
**Quiero** ver la información completa de un usuario específico  
**Para** revisar su configuración y actividad

#### Criterios de Aceptación:
- El usuario debe tener permiso `USUARIOS_VER`
- Se muestra información personal completa (nombre, apellido, fecha nacimiento, teléfono)
- Se muestra información del sistema (carnet, email, estado)
- Se muestran los roles asignados
- **Para empleados:** se muestran puestos asignados con entidad
- Se muestra historial de reportes creados
- Se muestran acciones realizadas en reportes asignados
- Los datos se cargan con todas las relaciones necesarias

### HU-AUTH-004: Editar Usuario Existente
**Como** administrador del sistema  
**Quiero** modificar la información de un usuario  
**Para** mantener actualizada la información y permisos

#### Criterios de Aceptación:
- El usuario debe tener permiso `USUARIOS_EDITAR`
- Se pueden editar campos de información personal (nombre, apellido)
- Se pueden editar campos del sistema (email, carnet, estado activo)
- **Para estudiantes:** se puede cambiar la escuela asignada
- Se pueden modificar los roles asignados
- **Validaciones:** mismas que en creación pero excluyendo el ID actual para unicidad
- Se registra auditoría específica para cambios de roles
- Se actualiza tanto la tabla `users` como `personas`
- No se permite cambiar el tipo de usuario (estudiante/empleado)
- Respuesta exitosa redirige al listado con mensaje de confirmación

---

## Gestión de Roles

### HU-AUTH-005: Crear Rol del Sistema
**Como** administrador del sistema  
**Quiero** crear nuevos roles con permisos específicos  
**Para** controlar granularmente el acceso a funcionalidades

#### Criterios de Aceptación:
- El usuario debe tener permiso `ROLES_CREAR`
- **Validaciones del nombre:**
  - Obligatorio y único en el sistema
  - Máximo 30 caracteres
  - Solo letras, números, espacios y caracteres especiales (áéíóúñÁÉÍÓÚÑüÜ)
  - Se convierte automáticamente a mayúsculas
- Se puede asignar estado activo/inactivo
- **Gestión de permisos:**
  - Los permisos se envían como string de IDs separados por comas
  - Solo se asignan permisos válidos existentes en la base de datos
  - Si no se envían permisos, se crea el rol sin permisos
- Respuesta exitosa redirige al listado de roles
- Se registra auditoría de la creación

### HU-AUTH-006: Listar Roles del Sistema
**Como** administrador del sistema  
**Quiero** visualizar todos los roles existentes  
**Para** gestionar la estructura de permisos

#### Criterios de Aceptación:
- El usuario debe tener permiso `ROLES_VER`
- Se muestran todos los roles con paginación (15 por página)
- Se muestra: nombre, estado (activo/inactivo), fecha de creación
- Se incluyen acciones para ver, editar (si corresponde)
- No hay filtros específicos implementados

### HU-AUTH-007: Ver Detalle de Rol
**Como** administrador del sistema  
**Quiero** ver los permisos específicos de un rol  
**Para** entender su alcance funcional

#### Criterios de Aceptación:
- El usuario debe tener permiso `ROLES_VER`
- Se muestra información básica del rol (nombre, estado)
- Se listan todos los permisos asignados con paginación (7 por página)
- Los permisos se cargan con relación optimizada

### HU-AUTH-008: Editar Rol Existente
**Como** administrador del sistema  
**Quiero** modificar roles y sus permisos  
**Para** ajustar el control de acceso según necesidades

#### Criterios de Aceptación:
- El usuario debe tener permiso `ROLES_EDITAR`
- **Restricciones de roles base:**
  - Rol ID 1: No se puede editar en absoluto
  - Roles ID 1-5: Solo se pueden editar permisos, no nombre ni estado
  - Otros roles: edición completa
- **Validaciones:** mismas que en creación pero excluyendo ID actual
- Se pueden modificar permisos mediante string de IDs separados por comas
- Se realiza sincronización completa de permisos (elimina no enviados, agrega nuevos)
- Respuesta exitosa redirige al listado
- Mensaje de error específico para roles base no editables

---

## Autenticación y Perfil

### HU-AUTH-009: Gestionar Perfil Personal
**Como** usuario autenticado  
**Quiero** actualizar mi información personal  
**Para** mantener mis datos actualizados en el sistema

#### Criterios de Aceptación:
- Cualquier usuario autenticado puede editar su perfil
- **Campos editables:**
  - Información personal: nombre, apellido, fecha nacimiento, teléfono
  - Información del sistema: carnet, email
- **Validaciones específicas:**
  - Fecha nacimiento: formato dd/mm/yyyy, se convierte a Y-m-d internamente
  - Teléfono: se limpia dejando solo números, opcional
  - Email: si cambia, se resetea `email_verified_at`
- Se actualiza la tabla `users` y `personas` en transacción
- Respuesta exitosa muestra mensaje de confirmación
- Se mantiene la sesión activa tras la actualización

### HU-AUTH-010: Autenticación de Dos Factores
**Como** usuario del sistema  
**Quiero** verificar mi dispositivo mediante código 2FA  
**Para** garantizar la seguridad de mi cuenta

#### Criterios de Aceptación:
- Se activa automáticamente si el dispositivo no está verificado
- **Generación de código:**
  - Código aleatorio de 6 dígitos
  - Vigencia de 10 minutos
  - Se elimina código anterior si existe
- Se envía por email al usuario
- El middleware `two_factor` redirige a verificación si el dispositivo no está verificado
- Una vez verificado, el dispositivo se marca como confiable
- Se integra con el sistema de device tracking

### HU-AUTH-011: Recuperar Contraseña
**Como** usuario del sistema  
**Quiero** restablecer mi contraseña mediante email  
**Para** recuperar el acceso a mi cuenta

#### Criterios de Aceptación:
- Se envía notificación personalizada con URL de recuperación
- La URL incluye token único y email del usuario
- Se usa la clase `ResetPasswordNotification` personalizada
- Se integra con el sistema estándar de Laravel para reset de passwords

---

## Seguridad y Control de Acceso

### HU-AUTH-012: Validación de Usuario Activo
**Como** sistema  
**Quiero** validar el estado del usuario en cada request  
**Para** garantizar que solo usuarios válidos accedan al sistema

#### Criterios de Aceptación:
- Se ejecuta en todas las rutas protegidas mediante middleware `validate_user`
- **Usuario ID 1 (SUPERADMIN):** siempre pasa la validación
- **Validaciones obligatorias:**
  - Usuario debe estar activo (`activo = 1`)
  - Usuario debe tener al menos un rol activo
  - **Para empleados:** debe tener al menos un puesto activo
  - **Para estudiantes:** la escuela debe estar activa
- Si alguna validación falla:
  - Se cierra la sesión automáticamente
  - Se redirige al login con mensaje específico del error
  - Se evita acceso no autorizado

### HU-AUTH-013: Control de Dispositivos
**Como** sistema  
**Quiero** trackear y verificar dispositivos de usuario  
**Para** mejorar la seguridad de acceso

#### Criterios de Aceptación:
- Se usa el paquete `laravel-device-tracking`
- Cada dispositivo debe ser verificado mediante 2FA
- Se pueden marcar dispositivos como verificados
- Se detecta y actualiza información del dispositivo automáticamente
- Se mantiene estado de verificación por dispositivo y usuario

### HU-AUTH-014: Auditoría de Acciones de Usuario
**Como** sistema  
**Quiero** registrar todas las acciones importantes  
**Para** mantener trazabilidad y seguridad

#### Criterios de Aceptación:
- Se implementa auditoría mediante el trait `Auditable` en modelos críticos
- Se registran eventos de: login, logout, cambio de password, verificación
- **Auditoría específica para cambios de roles:**
  - Se registra quién hace el cambio
  - Se guardan roles anteriores y nuevos
  - Se incluye información de request (URL, IP, User-Agent)
- Los logs se almacenan en tabla `audits`
- Se usa el paquete `owen-it/laravel-auditing`

### HU-AUTH-015: Sistema de Permisos Granular
**Como** sistema  
**Quiero** controlar acceso por permisos específicos  
**Para** implementar seguridad de nivel empresarial

#### Criterios de Aceptación:
- Se usa Spatie Permission para roles y permisos
- **Categorías de permisos definidas:**
  - REPORTES: crear, asignar, actualizar estado, ver listados, ver asignaciones, revisar soluciones
  - USUARIOS: ver, crear, editar
  - CATÁLOGOS: ver, crear, editar para escuelas, locales, recursos, bienes, etc.
  - RHU: gestión de entidades, puestos, empleados
  - SISTEMA: bitácora, estadísticas
- Cada ruta protegida declara permisos específicos mediante middleware
- Los permisos incluyen descripciones en español para la interfaz
- Se pueden agrupar permisos por categoría para mejor UX
- Respuesta de acceso denegado es consistente en todo el sistema

### HU-AUTH-016: Notificaciones de Seguridad
**Como** usuario del sistema  
**Quiero** recibir notificaciones de eventos de seguridad  
**Para** estar informado sobre el acceso a mi cuenta

#### Criterios de Aceptación:
- **Notificación de credenciales nuevas:** se envía al crear usuario con contraseña temporal
- **Notificación de código 2FA:** se envía código de verificación
- **Notificación de reset de password:** enlace personalizado para cambio
- Todas las notificaciones incluyen información corporativa
- Se usan templates personalizados para el branding institucional
- Las notificaciones son transaccionales y críticas para seguridad