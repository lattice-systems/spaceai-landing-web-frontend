# FASE 1 – DESCUBRIMIENTO Y ARQUITECTURA

## Proyecto

### SpaceIA – Universidad Inteligente

**Empresa:** Lattice Systems

---

# 1. Definición del Proyecto

## Descripción General

SpaceIA es una plataforma inteligente desarrollada por Lattice Systems que integra Inteligencia Artificial, Internet de las Cosas (IoT) y sistemas web para optimizar la orientación, el control de acceso, la atención de servicios escolares y la gestión de información dentro de instituciones educativas.

Su objetivo es impulsar la transformación digital de universidades mediante un ecosistema tecnológico capaz de mejorar la experiencia de estudiantes, docentes, personal administrativo y visitantes.

---

# 2. Alcance del Proyecto

## Funcionalidades Incluidas

### Sitio Web Comercial

- Página de inicio
- Información de la empresa
- Información del producto SpaceIA
- Casos de uso
- Preguntas frecuentes
- Formulario de contacto
- Sistema de cotización

### Portal del Cliente

- Inicio de sesión
- Perfil de usuario
- Historial de compras
- Documentación y manuales
- Opiniones y valoraciones

### Portal Administrativo

- Dashboard general
- Gestión de usuarios
- Gestión de clientes
- Gestión de productos
- Gestión de cotizaciones
- Gestión de proveedores
- Gestión de compras
- Gestión de comentarios

### Backend

- API REST
- Autenticación JWT
- Gestión de roles y permisos
- Administración de recursos del sistema

---

## Funcionalidades Fuera del Alcance

- Facturación electrónica SAT
- Procesamiento de pagos en línea
- Aplicación móvil
- Desarrollo del robot autónomo
- Desarrollo del kiosco físico
- Desarrollo del torniquete IoT
- Integración directa con sistemas institucionales externos

---

# 3. Actores del Sistema

## Visitante

Usuario que accede al sitio sin autenticación.

### Puede:

- Consultar información del producto.
- Explorar funcionalidades.
- Solicitar cotizaciones.
- Contactar a la empresa.

---

## Cliente

Institución que adquirió una solución de SpaceIA.

### Puede:

- Iniciar sesión.
- Consultar documentación.
- Actualizar información personal.
- Revisar historial de compras.
- Emitir opiniones sobre productos y servicios.

---

## Administrador

Personal autorizado de Lattice Systems.

### Puede:

- Administrar usuarios.
- Administrar clientes.
- Administrar productos.
- Gestionar cotizaciones.
- Gestionar compras.
- Gestionar proveedores.
- Moderar comentarios.

---

# 4. Arquitectura de Información

## Mapa General del Sitio

Inicio

├── Nosotros

├── SpaceIA

│ ├── Aplicación Móvil

│ ├── Control de Acceso Inteligente

│ ├── Kiosco Inteligente

│ └── Robot Autónomo

├── Casos de Uso

├── FAQ

├── Contacto

├── Cotización

└── Login

---

# 5. Módulos del Sistema

## Sitio Comercial

### Home

Presentación general de SpaceIA.

### Nosotros

Información institucional de Lattice Systems.

### SpaceIA

Descripción detallada de la solución.

### Casos de Uso

Escenarios de implementación y beneficios.

### FAQ

Preguntas frecuentes.

### Contacto

Formulario y datos de contacto.

### Cotizador

Generación automática de cotizaciones.

---

## Portal Cliente

### Dashboard

Resumen general.

### Perfil

Gestión de información personal.

### Documentación

Acceso a manuales y recursos.

### Compras

Historial de adquisiciones.

### Opiniones

Valoración de productos y servicios.

---

## Portal Administrador

### Dashboard

Indicadores y métricas.

### Usuarios

CRUD de usuarios.

### Clientes

CRUD de clientes.

### Productos

CRUD de productos.

### Cotizaciones

CRUD de cotizaciones.

### Proveedores

CRUD de proveedores.

### Compras

CRUD de compras.

### Comentarios

Moderación y seguimiento.

---

# 6. Casos de Uso Principales

## CU-01 Solicitar Cotización

### Actor

Visitante

### Flujo

1. Accede al módulo de cotización.
2. Selecciona los módulos deseados.
3. Completa la información solicitada.
4. El sistema calcula el costo.
5. Se genera la cotización.
6. Se almacena la solicitud.

---

## CU-02 Iniciar Sesión

### Actor

Cliente o Administrador

### Flujo

1. Ingresa correo electrónico.
2. Ingresa contraseña.
3. El sistema valida credenciales.
4. Se genera token JWT.
5. Se concede acceso al sistema.

---

## CU-03 Administrar Productos

### Actor

Administrador

### Flujo

1. Crear producto.
2. Editar producto.
3. Consultar producto.
4. Eliminar producto.

---

## CU-04 Administrar Clientes

### Actor

Administrador

### Flujo

1. Registrar cliente.
2. Asignar acceso.
3. Gestionar información.
4. Consultar historial.

---

# 7. Requerimientos Funcionales

### RF-01

Permitir solicitar cotizaciones.

### RF-02

Permitir autenticación mediante usuario y contraseña.

### RF-03

Permitir la gestión de productos.

### RF-04

Permitir la gestión de usuarios.

### RF-05

Permitir la gestión de proveedores.

### RF-06

Permitir la gestión de compras.

### RF-07

Permitir la gestión de documentación.

### RF-08

Permitir la administración de clientes.

### RF-09

Permitir la gestión de comentarios y opiniones.

---

# 8. Requerimientos No Funcionales

### RNF-01

Sistema responsive para dispositivos móviles y escritorio.

### RNF-02

Disponibilidad mínima del 99%.

### RNF-03

Tiempo de respuesta inferior a tres segundos.

### RNF-04

Arquitectura escalable.

### RNF-05

Interfaz intuitiva y accesible.

---

# 9. Requerimientos de Seguridad

### RS-01

Autenticación mediante JWT.

### RS-02

Contraseñas almacenadas con hash seguro.

### RS-03

Control de acceso basado en roles.

### RS-04

Comunicación mediante HTTPS.

### RS-05

Protección de endpoints mediante autorización.

---

# 10. Arquitectura Tecnológica

## Frontend

- Angular
- TypeScript
- Tailwind CSS

## Backend

- ASP.NET Core Web API

## Base de Datos

- PostgreSQL

## Infraestructura

- Docker
- Nginx
- VPS DigitalOcean

## Integraciones

- MQTT
- OpenAI API
- REST APIs

---

# 11. MVP (Producto Mínimo Viable)

## Módulos Obligatorios

### Público

- Home
- SpaceIA
- Contacto
- Cotizador

### Cliente

- Login
- Perfil
- Documentación

### Administrador

- Usuarios
- Productos
- Cotizaciones

### Backend

- JWT
- CRUD Usuarios
- CRUD Productos
- CRUD Cotizaciones

---

# Estado

Fase Actual: Descubrimiento y Arquitectura

Próxima Fase: Diseño de Base de Datos y Modelo Entidad-Relación.