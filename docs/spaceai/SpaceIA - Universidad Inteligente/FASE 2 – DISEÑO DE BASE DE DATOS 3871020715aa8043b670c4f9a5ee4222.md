# FASE 2 – DISEÑO DE BASE DE DATOS

## Proyecto

### SpaceIA – Universidad Inteligente

**Empresa:** Lattice Systems

---

# 1. Objetivo de la Fase

Diseñar la estructura de base de datos que permitirá almacenar, organizar y consultar la información necesaria para el funcionamiento de la plataforma comercial y administrativa de SpaceIA.

Esta fase servirá como base para el desarrollo del Backend en ASP.NET Core, la construcción de APIs REST y la integración con el Frontend en Angular.

---

# 2. Tipo de Base de Datos

Para este proyecto se propone utilizar una base de datos relacional.

## Sistema Gestor Propuesto

**PostgreSQL**

---

# 3. Information Modules

## Security

- Users
- Roles
- Permissions

## Sales

- Clients
- Quotes
- QuoteItems

## Products

- Products
- ProductModules
- Documents

## Procurement

- Providers
- Purchases
- PurchaseItems

## Customer Interaction

- ContactMessages
- Reviews
- SupportTickets

---

# 4. Main Entities

## 4.1 Roles

Almacena los tipos de usuarios del sistema.

### Fields

- id
- name
- description
- createdAt

### Examples

- Admin
- Client

---

## 4.2 Users

Almacena las cuentas de acceso al sistema.

### Fields

- id
- firstName
- lastName
- email
- passwordHash
- phone
- roleId
- isActive
- createdAt
- updatedAt

### Relationships

- One user belongs to one role.
- One client can be associated with one user.

---

## 4.3 Clients

Representa a las instituciones que solicitan o adquieren SpaceIA.

### Fields

- id
- userId
- institutionName
- contactPerson
- contactEmail
- phone
- address
- institutionType
- studentCount
- status
- createdAt

### Relationships

- One client can have many quotes.
- One client can have many purchases.
- One client can create many reviews.

---

## 4.4 Products

Representa los productos o soluciones que ofrece Lattice Systems.

### Fields

- id
- name
- description
- basePrice
- isActive
- createdAt
- updatedAt

### Example

- SpaceIA – Smart University

---

## 4.5 ProductModules

Representa los componentes que forman parte de SpaceIA.

### Fields

- id
- productId
- name
- description
- price
- isActive

### Examples

- Mobile App
- Smart Access Control
- AI Kiosk
- Autonomous Robot
- Training
- Technical Support

### Relationships

- One product can have many product modules.

---

## 4.6 Quotes

Almacena las solicitudes de cotización generadas por visitantes o clientes.

### Fields

- id
- clientId
- requesterName
- requesterEmail
- phone
- institutionName
- studentCount
- buildingCount
- accessPointCount
- kioskCount
- robotCount
- subtotal
- total
- status
- createdAt

### Suggested Status

- Pending
- UnderReview
- Approved
- Rejected

### Relationships

- One quote belongs to one client.
- One quote has many quote items.

---

## 4.7 QuoteItems

Almacena los módulos seleccionados dentro de una cotización.

### Fields

- id
- quoteId
- productModuleId
- quantity
- unitPrice
- subtotal

### Relationships

- One quote item belongs to one quote.
- One quote item belongs to one product module.

---

## 4.8 Providers

Almacena los proveedores relacionados con hardware, software o servicios.

### Fields

- id
- name
- contactPerson
- email
- phone
- address
- providerType
- isActive
- createdAt

### Examples

- Raspberry Pi Provider
- Sensor Provider
- Hosting Provider
- Electronic Components Provider

---

## 4.9 Purchases

Registra compras realizadas a proveedores.

### Fields

- id
- providerId
- purchaseDate
- total
- status
- notes

### Suggested Status

- Pending
- Paid
- Cancelled
- Received

### Relationships

- One purchase belongs to one provider.
- One purchase has many purchase items.

---

## 4.10 PurchaseItems

Registra los productos o materiales adquiridos en una compra.

### Fields

- id
- purchaseId
- materialName
- description
- quantity
- unitCost
- subtotal

### Relationships

- One purchase item belongs to one purchase.

---

## 4.11 Documents

Almacena manuales, guías, archivos técnicos o recursos para clientes.

### Fields

- id
- productId
- title
- description
- fileUrl
- documentType
- isVisibleToClients
- createdAt

### Examples

- User Manual
- Installation Guide
- Technical Document
- Video Tutorial

---

## 4.12 ContactMessages

Almacena mensajes enviados desde el sitio web público.

### Fields

- id
- name
- email
- message
- status
- createdAt

### Suggested Status

- Pending
- Reviewed
- Archived

---

## 4.13 Reviews

Almacena valoraciones realizadas por clientes sobre productos adquiridos.

### Fields

- id
- clientId
- productId
- rating
- comment
- isApproved
- createdAt

### Relationships

- One review belongs to one client.
- One review belongs to one product.

---

## 4.14 SupportTickets

Registra solicitudes de soporte realizadas por clientes.

### Fields

- id
- clientId
- subject
- description
- priority
- status
- createdAt
- updatedAt

### Suggested Priorities

- Low
- Medium
- High
- Critical

### Suggested Status

- Open
- InProgress
- Resolved
- Closed

---

# 5. Main Relationships

## Role – User

```
Roles 1 ─── N Users
```

## User – Client

```
Users 1 ─── 1 Clients
```

## Client – Quote

```
Clients 1 ─── N Quotes
```

## Quote – QuoteItem

```
Quotes 1 ─── N QuoteItems
```

## Product – ProductModule

```
Products 1 ─── N ProductModules
```

## ProductModule – QuoteItem

```
ProductModules 1 ─── N QuoteItems
```

## Provider – Purchase

```
Providers 1 ─── N Purchases
```

## Purchase – PurchaseItem

```
Purchases 1 ─── N PurchaseItems
```

## Product – Document

```
Products 1 ─── N Documents
```

## Client – Review

```
Clients 1 ─── N Reviews
```

## Product – Review

```
Products 1 ─── N Reviews
```

## Client – SupportTicket

```
Clients 1 ─── N SupportTickets
```

---

# 6. Resumed Relational Model

```
Roles
- id PK
- name
- description
- createdAt

Users
- id PK
- roleId FK
- firstName
- lastName
- email
- passwordHash
- phone
- isActive
- createdAt
- updatedAt

Clients
- id PK
- userId FK
- institutionName
- contactPerson
- contactEmail
- phone
- address
- institutionType
- studentCount
- status
- createdAt

Products
- id PK
- name
- description
- basePrice
- isActive
- createdAt
- updatedAt

ProductModules
- id PK
- productId FK
- name
- description
- price
- isActive

Quotes
- id PK
- clientId FK
- requesterName
- requesterEmail
- phone
- institutionName
- studentCount
- buildingCount
- accessPointCount
- kioskCount
- robotCount
- subtotal
- total
- status
- createdAt

QuoteItems
- id PK
- quoteId FK
- productModuleId FK
- quantity
- unitPrice
- subtotal

Providers
- id PK
- name
- contactPerson
- email
- phone
- address
- providerType
- isActive
- createdAt

Purchases
- id PK
- providerId FK
- purchaseDate
- total
- status
- notes

PurchaseItems
- id PK
- purchaseId FK
- materialName
- description
- quantity
- unitCost
- subtotal

Documents
- id PK
- productId FK
- title
- description
- fileUrl
- documentType
- isVisibleToClients
- createdAt

ContactMessages
- id PK
- name
- email
- message
- status
- createdAt

Reviews
- id PK
- clientId FK
- productId FK
- rating
- comment
- isApproved
- createdAt

SupportTickets
- id PK
- clientId FK
- subject
- description
- priority
- status
- createdAt
- updatedAt
```

---

# 7. Business Rules

## Quotes

- Una cotización puede ser generada por un visitante o por un cliente registrado.
- El total se calcula a partir de los módulos seleccionados.
- Cada módulo puede tener una cantidad diferente.
- El administrador puede cambiar el estado de la cotización.

## Users

- Todo usuario debe tener un rol asignado.
- El correo electrónico debe ser único.
- Las contraseñas no deben almacenarse en texto plano.

## Clients

- Un cliente puede acceder al portal solo si tiene un usuario activo.
- Un cliente puede consultar documentación asociada a productos adquiridos.

## Products

- SpaceIA puede dividirse en diferentes módulos.
- Cada módulo puede tener precio independiente.
- Los módulos pueden activarse o desactivarse.

## Purchases

- Cada compra debe estar asociada a un proveedor.
- El total de compra se calcula con base en sus detalles.
- Una compra puede estar pendiente, pagada, cancelada o recibida.

## Reviews

- Solo clientes registrados pueden emitir opiniones.
- Las opiniones pueden ser aprobadas o rechazadas por un administrador.

---

# 8. Initial Data Dictionary

## Table: Roles

| Field | Type | Description |
| --- | --- | --- |
| id | UUID | Unique identifier |
| name | VARCHAR | Role name |
| description | TEXT | Role description |
| createdAt | TIMESTAMP | Creation date |

---

## Table: Users

| Field | Type | Description |
| --- | --- | --- |
| id | UUID | Unique identifier |
| roleId | UUID | Assigned role |
| firstName | VARCHAR | User first name |
| lastName | VARCHAR | User last name |
| email | VARCHAR | Email address |
| passwordHash | TEXT | Encrypted password |
| phone | VARCHAR | Phone number |
| isActive | BOOLEAN | User status |
| createdAt | TIMESTAMP | Creation date |
| updatedAt | TIMESTAMP | Last update date |

---

## Table: Clients

| Field | Type | Description |
| --- | --- | --- |
| id | UUID | Unique identifier |
| userId | UUID | Associated user |
| institutionName | VARCHAR | Institution name |
| contactPerson | VARCHAR | Main contact person |
| contactEmail | VARCHAR | Contact email |
| phone | VARCHAR | Phone number |
| address | TEXT | Address |
| institutionType | VARCHAR | Institution type |
| studentCount | INTEGER | Number of students |
| status | VARCHAR | Client status |
| createdAt | TIMESTAMP | Registration date |

---

## Table: Products

| Field | Type | Description |
| --- | --- | --- |
| id | UUID | Unique identifier |
| name | VARCHAR | Product name |
| description | TEXT | Product description |
| basePrice | DECIMAL | Base price |
| isActive | BOOLEAN | Product status |
| createdAt | TIMESTAMP | Creation date |
| updatedAt | TIMESTAMP | Last update date |

---

## Table: Quotes

| Field | Type | Description |
| --- | --- | --- |
| id | UUID | Unique identifier |
| clientId | UUID | Associated client |
| requesterName | VARCHAR | Requester name |
| requesterEmail | VARCHAR | Requester email |
| phone | VARCHAR | Phone number |
| institutionName | VARCHAR | Institution name |
| studentCount | INTEGER | Number of students |
| buildingCount | INTEGER | Number of buildings |
| accessPointCount | INTEGER | Number of access points |
| kioskCount | INTEGER | Number of kiosks |
| robotCount | INTEGER | Number of robots |
| subtotal | DECIMAL | Quote subtotal |
| total | DECIMAL | Quote total |
| status | VARCHAR | Quote status |
| createdAt | TIMESTAMP | Creation date |

---

# 9. Simplified Conceptual Diagram

```
[Roles]
   |
   | 1:N
   v
[Users]
   |
   | 1:1
   v
[Clients]
   |
   | 1:N
   v
[Quotes]
   |
   | 1:N
   v
[QuoteItems]
   ^
   | N:1
   |
[ProductModules]
   ^
   | N:1
   |
[Products]

[Providers]
   |
   | 1:N
   v
[Purchases]
   |
   | 1:N
   v
[PurchaseItems]

[Products]
   |
   | 1:N
   v
[Documents]

[Clients]
   |
   | 1:N
   v
[Reviews]

[Clients]
   |
   | 1:N
   v
[SupportTickets]
```

---

# 10. Phase 2 Deliverables

Al finalizar esta fase se deberán tener los siguientes entregables:

- Conceptual data model.
- Relational model.
- Data dictionary.
- Business rules.
- Main relationships.
- Base for ASP.NET Core entities.
- Base for REST API endpoint design.

---

# Estado

Fase Actual: Diseño de Base de Datos

Fase Anterior: Descubrimiento y Arquitectura

Próxima Fase: Diseño de API REST