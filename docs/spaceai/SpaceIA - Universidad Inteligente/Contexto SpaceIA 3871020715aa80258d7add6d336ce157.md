# Contexto: SpaceIA

## Plataforma Comercial y Administrativa de Lattice Systems

---

# Descripción General

SpaceIA es una solución tecnológica desarrollada por **Lattice Systems** que integra Inteligencia Artificial (IA), Internet de las Cosas (IoT), Automatización y Sistemas Web para mejorar la experiencia universitaria mediante orientación inteligente, control de acceso, asistencia automatizada y monitoreo en tiempo real.

El objetivo principal es modernizar la operación de instituciones educativas mediante un ecosistema conectado que permita optimizar procesos, mejorar la atención a estudiantes y automatizar servicios internos.

---

# Empresa

## Lattice Systems

Lattice Systems es una empresa especializada en el desarrollo de soluciones tecnológicas, software a medida, automatizaciones e integraciones inteligentes para organizaciones que buscan acelerar su transformación digital.

### Misión

Brindar soluciones digitales y tecnológicas personalizadas que impulsen el crecimiento de nuestros clientes mediante software, automatizaciones y sistemas eficientes.

### Visión

Ser una empresa referente en el desarrollo de soluciones tecnológicas innovadoras, escalables y de alto impacto.

### Valores

- Innovación
- Calidad
- Transparencia
- Orientación al cliente
- Trabajo en equipo
- Compromiso

---

# Producto Principal

## SpaceIA

SpaceIA es un ecosistema universitario inteligente compuesto por múltiples módulos interconectados.

### Componentes del Ecosistema

### 1. Aplicación Móvil

Permite:

- Inicio de sesión
- Consulta de horarios
- Visualización de mapas del campus
- Notificaciones institucionales
- Generación de QR dinámico

### 2. Control de Acceso Inteligente

Permite:

- Validación de identidad mediante QR
- Registro de entradas y salidas
- Apertura automática de accesos
- Comunicación IoT mediante MQTT y HTTP

### 3. Kiosco Inteligente (SIDE)

Permite:

- Atención automatizada
- Consultas mediante voz y texto
- Información institucional
- Asistencia basada en IA con arquitectura RAG

### 4. Robot Autónomo de Guiado

Permite:

- Guiado físico de usuarios
- Navegación autónoma
- Detección de obstáculos
- Mapeo inteligente del campus

---

# Objetivo del Proyecto Web

Desarrollar una plataforma web comercial y administrativa para la comercialización, gestión y soporte del ecosistema SpaceIA.

La plataforma permitirá:

- Promocionar SpaceIA
- Gestionar clientes
- Generar cotizaciones
- Administrar productos
- Gestionar documentación
- Gestionar proveedores
- Gestionar compras
- Dar seguimiento a clientes

---

# Arquitectura de Información

## Objetivos

- Comercializar SpaceIA.
- Captar nuevos clientes.
- Gestionar implementaciones.
- Automatizar procesos administrativos.
- Centralizar información comercial.

## Audiencia

### Primaria

- Universidades públicas
- Universidades privadas
- Instituciones educativas

### Secundaria

- Centros de capacitación
- Instituciones gubernamentales
- Campus corporativos

---

# Mapa del Sitio

```
Inicio
│
├── Nosotros
├── SpaceIA
│   ├── App Móvil
│   ├── Control de Acceso
│   ├── Kiosco IA
│   └── Robot Autónomo
│
├── Casos de Uso
├── FAQ
├── Cotización
├── Contacto
└── Login
```

---

# Requerimientos Funcionales

## Sitio Público

### Inicio

- Presentación de la empresa
- Presentación del producto

### Nosotros

- Historia
- Misión
- Visión
- Valores

### SpaceIA

- Descripción del ecosistema
- Características
- Beneficios
- Videos
- Imágenes

### Casos de Uso

- Escenarios de implementación
- Beneficios obtenidos

### FAQ

- Preguntas frecuentes

### Contacto

- Información de contacto
- Formulario de contacto

### Cotizador

- Generación de cotizaciones automáticas

### Login

- Acceso para clientes
- Acceso para administradores

---

# Portal del Cliente

## Funcionalidades

### Perfil

- Actualización de datos
- Cambio de contraseña

### Mis Productos

- Productos adquiridos
- Estado de implementación

### Documentación

- Manuales
- Guías
- Videos

### Historial de Compras

- Consultar adquisiciones realizadas

### Opiniones

- Valoración de productos

### Soporte

- Apertura de tickets
- Seguimiento de incidencias

---

# Portal Administrativo

## Dashboard

Visualización de métricas generales:

- Clientes
- Cotizaciones
- Ventas
- Productos
- Tickets

---

## Administración de Usuarios

CRUD completo:

- Administradores
- Clientes

---

## Administración de Productos

CRUD completo:

- Productos
- Servicios
- Módulos de SpaceIA

---

## Administración de Cotizaciones

- Crear cotización
- Consultar cotización
- Aprobar cotización
- Rechazar cotización

---

## Administración de Proveedores

CRUD completo de proveedores.

---

## Administración de Compras

- Registro de compras
- Seguimiento de compras

---

## Administración de Comentarios

- Moderación
- Aprobación
- Rechazo

---

## Administración de Documentación

- Manuales
- Videos
- Archivos PDF

---

# Sistema de Cotización

SpaceIA se comercializa mediante módulos.

## Módulos Disponibles

- Aplicación móvil
- Control de acceso inteligente
- Kiosco SIDE
- Robot autónomo
- Capacitación
- Soporte técnico

## Datos Solicitados

- Nombre de institución
- Número de alumnos
- Número de edificios
- Número de accesos
- Número de kioscos
- Número de robots
- Servicios adicionales

## Resultado

Generación automática de cotización con desglose de costos.

---

# Requerimientos No Funcionales

## Rendimiento

- Tiempo de respuesta menor a 3 segundos.

## Disponibilidad

- Disponibilidad mínima del 99%.

## Escalabilidad

- Arquitectura preparada para crecimiento.

## Usabilidad

- Interfaz intuitiva.
- Diseño responsive.

## Mantenibilidad

- Código modular.
- Arquitectura limpia.

---

# Requerimientos de Seguridad

## Autenticación

- JWT

## Autorización

- Roles y permisos

## Protección de Contraseñas

- Hash BCrypt

## Comunicación Segura

- HTTPS

## Protección de API

- Tokens de acceso

---

# Arquitectura Tecnológica

## Frontend

- Angular 20+
- TypeScript
- Tailwind CSS
- Angular Material

## Backend

- [ASP.NET](http://asp.net/) Core Web API
- Entity Framework Core
- JWT Authentication

## Base de Datos

- PostgreSQL

## Infraestructura

- Docker
- VPS DigitalOcean
- Nginx

## Integraciones

- MQTT
- OpenAI
- APIs REST
- WebSockets

---

# Modelo de Base de Datos

## Tablas Principales

### Seguridad

- Users
- Roles
- Permissions

### Comercial

- Clients
- Quotes
- QuoteDetails

### Catálogos

- Products
- ProductModules

### Operación

- Providers
- Purchases
- PurchaseDetails

### Clientes

- Reviews
- Comments
- Tickets

### Documentación

- Documents
- Categories

---

# Roles del Sistema

## Administrador

Acceso completo.

## Cliente

Acceso limitado a productos adquiridos.

---

# Tecnologías del Proyecto

Frontend:

- Angular
- TypeScript
- Tailwind

Backend:

- [ASP.NET](http://asp.net/) Core
- Entity Framework Core

Base de Datos:

- PostgreSQL

Infraestructura:

- Docker
- Linux
- Nginx

Servicios:

- MQTT
- OpenAI API

---

# Equipo

## Lattice Systems

### Cloud & DevOps

Daniel Ojeda Luna

### Backend

Emmanuel Ortiz Reyes

### Frontend

Juan Pablo Rea Cano

### Hardware IoT

Jael Neftali Vargas Grijalva

### Robótica

Haziel Orlando Gutiérrez Hernández

### IA y NLP

Emiliano Mendoza Maldonado

---

# Estado del Proyecto

Fase actual:

- Planeación
- Arquitectura
- Diseño del sistema
- Desarrollo Web Integral
- Integración con ecosistema SpaceIA

---

# SpaceIA - Universidad Inteligente

## Plataforma Comercial y Administrativa de Lattice Systems

---

# Descripción General

SpaceIA es una solución tecnológica desarrollada por **Lattice Systems** que integra Inteligencia Artificial (IA), Internet de las Cosas (IoT), Automatización y Sistemas Web para mejorar la experiencia universitaria mediante orientación inteligente, control de acceso, asistencia automatizada y monitoreo en tiempo real.

El objetivo principal es modernizar la operación de instituciones educativas mediante un ecosistema conectado que permita optimizar procesos, mejorar la atención a estudiantes y automatizar servicios internos.

---

# Empresa

## Lattice Systems

Lattice Systems es una empresa especializada en el desarrollo de soluciones tecnológicas, software a medida, automatizaciones e integraciones inteligentes para organizaciones que buscan acelerar su transformación digital.

### Misión

Brindar soluciones digitales y tecnológicas personalizadas que impulsen el crecimiento de nuestros clientes mediante software, automatizaciones y sistemas eficientes.

### Visión

Ser una empresa referente en el desarrollo de soluciones tecnológicas innovadoras, escalables y de alto impacto.

### Valores

- Innovación
- Calidad
- Transparencia
- Orientación al cliente
- Trabajo en equipo
- Compromiso

---

# Producto Principal

## SpaceIA

SpaceIA es un ecosistema universitario inteligente compuesto por múltiples módulos interconectados.

### Componentes del Ecosistema

### 1. Aplicación Móvil

Permite:

- Inicio de sesión
- Consulta de horarios
- Visualización de mapas del campus
- Notificaciones institucionales
- Generación de QR dinámico

### 2. Control de Acceso Inteligente

Permite:

- Validación de identidad mediante QR
- Registro de entradas y salidas
- Apertura automática de accesos
- Comunicación IoT mediante MQTT y HTTP

### 3. Kiosco Inteligente (SIDE)

Permite:

- Atención automatizada
- Consultas mediante voz y texto
- Información institucional
- Asistencia basada en IA con arquitectura RAG

### 4. Robot Autónomo de Guiado

Permite:

- Guiado físico de usuarios
- Navegación autónoma
- Detección de obstáculos
- Mapeo inteligente del campus

---

# Objetivo del Proyecto Web

Desarrollar una plataforma web comercial y administrativa para la comercialización, gestión y soporte del ecosistema SpaceIA.

La plataforma permitirá:

- Promocionar SpaceIA
- Gestionar clientes
- Generar cotizaciones
- Administrar productos
- Gestionar documentación
- Gestionar proveedores
- Gestionar compras
- Dar seguimiento a clientes

---

# Arquitectura de Información

## Objetivos

- Comercializar SpaceIA.
- Captar nuevos clientes.
- Gestionar implementaciones.
- Automatizar procesos administrativos.
- Centralizar información comercial.

## Audiencia

### Primaria

- Universidades públicas
- Universidades privadas
- Instituciones educativas

### Secundaria

- Centros de capacitación
- Instituciones gubernamentales
- Campus corporativos

---

# Mapa del Sitio

```
Inicio
│
├── Nosotros
├── SpaceIA
│   ├── App Móvil
│   ├── Control de Acceso
│   ├── Kiosco IA
│   └── Robot Autónomo
│
├── Casos de Uso
├── FAQ
├── Cotización
├── Contacto
└── Login
```

---

# Requerimientos Funcionales

## Sitio Público

### Inicio

- Presentación de la empresa
- Presentación del producto

### Nosotros

- Historia
- Misión
- Visión
- Valores

### SpaceIA

- Descripción del ecosistema
- Características
- Beneficios
- Videos
- Imágenes

### Casos de Uso

- Escenarios de implementación
- Beneficios obtenidos

### FAQ

- Preguntas frecuentes

### Contacto

- Información de contacto
- Formulario de contacto

### Cotizador

- Generación de cotizaciones automáticas

### Login

- Acceso para clientes
- Acceso para administradores

---

# Portal del Cliente

## Funcionalidades

### Perfil

- Actualización de datos
- Cambio de contraseña

### Mis Productos

- Productos adquiridos
- Estado de implementación

### Documentación

- Manuales
- Guías
- Videos

### Historial de Compras

- Consultar adquisiciones realizadas

### Opiniones

- Valoración de productos

### Soporte

- Apertura de tickets
- Seguimiento de incidencias

---

# Portal Administrativo

## Dashboard

Visualización de métricas generales:

- Clientes
- Cotizaciones
- Ventas
- Productos
- Tickets

---

## Administración de Usuarios

CRUD completo:

- Administradores
- Clientes

---

## Administración de Productos

CRUD completo:

- Productos
- Servicios
- Módulos de SpaceIA

---

## Administración de Cotizaciones

- Crear cotización
- Consultar cotización
- Aprobar cotización
- Rechazar cotización

---

## Administración de Proveedores

CRUD completo de proveedores.

---

## Administración de Compras

- Registro de compras
- Seguimiento de compras

---

## Administración de Comentarios

- Moderación
- Aprobación
- Rechazo

---

## Administración de Documentación

- Manuales
- Videos
- Archivos PDF

---

# Sistema de Cotización

SpaceIA se comercializa mediante módulos.

## Módulos Disponibles

- Aplicación móvil
- Control de acceso inteligente
- Kiosco SIDE
- Robot autónomo
- Capacitación
- Soporte técnico

## Datos Solicitados

- Nombre de institución
- Número de alumnos
- Número de edificios
- Número de accesos
- Número de kioscos
- Número de robots
- Servicios adicionales

## Resultado

Generación automática de cotización con desglose de costos.

---

# Requerimientos No Funcionales

## Rendimiento

- Tiempo de respuesta menor a 3 segundos.

## Disponibilidad

- Disponibilidad mínima del 99%.

## Escalabilidad

- Arquitectura preparada para crecimiento.

## Usabilidad

- Interfaz intuitiva.
- Diseño responsive.

## Mantenibilidad

- Código modular.
- Arquitectura limpia.

---

# Requerimientos de Seguridad

## Autenticación

- JWT

## Autorización

- Roles y permisos

## Protección de Contraseñas

- Hash BCrypt

## Comunicación Segura

- HTTPS

## Protección de API

- Tokens de acceso

---

# Arquitectura Tecnológica

## Frontend

- Angular 20+
- TypeScript
- Tailwind CSS
- Angular Material

## Backend

- [ASP.NET](http://asp.net/) Core Web API
- Entity Framework Core
- JWT Authentication

## Base de Datos

- PostgreSQL

## Infraestructura

- Docker
- VPS DigitalOcean
- Nginx

## Integraciones

- MQTT
- OpenAI
- APIs REST
- WebSockets

---

# Modelo de Base de Datos

## Tablas Principales

### Seguridad

- Users
- Roles
- Permissions

### Comercial

- Clients
- Quotes
- QuoteDetails

### Catálogos

- Products
- ProductModules

### Operación

- Providers
- Purchases
- PurchaseDetails

### Clientes

- Reviews
- Comments
- Tickets

### Documentación

- Documents
- Categories

---

# Roles del Sistema

## Administrador

Acceso completo.

## Cliente

Acceso limitado a productos adquiridos.

---

# Tecnologías del Proyecto

Frontend:

- Angular
- TypeScript
- Tailwind

Backend:

- [ASP.NET](http://asp.net/) Core
- Entity Framework Core

Base de Datos:

- PostgreSQL

Infraestructura:

- Docker
- Linux
- Nginx

Servicios:

- MQTT
- OpenAI API

---

# Equipo

## Lattice Systems

### Cloud & DevOps

Daniel Ojeda Luna

### Backend

Emmanuel Ortiz Reyes

### Frontend

Juan Pablo Rea Cano

### Hardware IoT

Jael Neftali Vargas Grijalva

### Robótica

Haziel Orlando Gutiérrez Hernández

### IA y NLP

Emiliano Mendoza Maldonado

---

# Estado del Proyecto

Fase actual:

- Planeación ✅
- Arquitectura
- Diseño del sistema
- Desarrollo Web Integral
- Integración con ecosistema SpaceIA

---