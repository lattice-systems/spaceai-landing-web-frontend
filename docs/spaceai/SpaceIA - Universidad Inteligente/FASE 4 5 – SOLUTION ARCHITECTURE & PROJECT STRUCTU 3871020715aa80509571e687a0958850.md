# FASE 4.5 – SOLUTION ARCHITECTURE & PROJECT STRUCTURE

## Proyecto

### SpaceIA – Universidad Inteligente

**Empresa:** Lattice Systems

---

# 1. Objetivo de la Fase

Definir la arquitectura de software, estructura de proyectos, convenciones de desarrollo y organización de módulos antes de iniciar la implementación.

Esta fase busca garantizar escalabilidad, mantenibilidad y facilidad de integración entre Backend, Frontend e Infraestructura.

---

# 2. Architectural Style

## Selected Architecture

### Modular Monolith

Se implementará un Monolito Modular para reducir complejidad operativa durante la etapa académica y permitir una futura migración a microservicios si el proyecto evoluciona.

### Benefits

- Easier deployment.
- Faster development.
- Lower infrastructure cost.
- Clear module boundaries.
- Easier maintenance.

---

# 3. Backend Architecture

## Framework

```
ASP.NET Core Web API
```

## Architectural Pattern

```
Clean Architecture
+
DDD Lite
```

Se utilizarán conceptos de:

- Domain Layer
- Application Layer
- Infrastructure Layer
- Presentation Layer

Sin implementar complejidades innecesarias para un proyecto académico.

---

# 4. Backend Solution Structure

```
SpaceIA.Backend

├── src

│   ├── SpaceIA.Api
│   │
│   ├── SpaceIA.Application
│   │
│   ├── SpaceIA.Domain
│   │
│   ├── SpaceIA.Infrastructure
│   │
│   └── SpaceIA.Shared

│
└── tests
```

---

# 5. Domain Modules

## Auth

Authentication and authorization.

---

## Users

System users management.

---

## Clients

Institution and customer management.

---

## Products

SpaceIA products and modules.

---

## Quotes

Quotation generation and management.

---

## Materials

Raw material administration.

---

## Inventory

Inventory movement tracking.

---

## Purchases

Provider purchases management.

---

## Providers

Suppliers management.

---

## Documents

Client documentation.

---

## Reviews

Customer reviews.

---

## SupportTickets

Support request management.

---

# 6. Domain Layer Structure

```
Domain

├── Auth
├── Users
├── Clients
├── Products
├── Quotes
├── Materials
├── Inventory
├── Purchases
├── Providers
├── Documents
├── Reviews
└── SupportTickets
```

---

# 7. Entity Naming Convention

## Entities

Singular

```
User
Role
Client
Product
ProductModule
Quote
QuoteItem
Provider
Purchase
Material
InventoryMovement
Document
Review
SupportTicket
```

---

## Tables

Plural

```
Users
Roles
Clients
Products
ProductModules
Quotes
QuoteItems
Providers
Purchases
Materials
InventoryMovements
Documents
Reviews
SupportTickets
```

---

# 8. API Structure

```
/api/auth

/api/users

/api/clients

/api/products

/api/product-modules

/api/quotes

/api/materials

/api/inventory-movements

/api/providers

/api/purchases

/api/documents

/api/reviews

/api/support-tickets
```

---

# 9. DTO Convention

## Requests

```
CreateUserRequest
UpdateUserRequest

CreateClientRequest
UpdateClientRequest

CreateQuoteRequest

CreateMaterialRequest
UpdateMaterialRequest
```

---

## Responses

```
UserResponse

ClientResponse

QuoteResponse

ProductResponse

MaterialResponse
```

---

# 10. Entity Base Class

Todas las entidades heredarán de:

```
BaseEntity
```

### Common Fields

```
id

createdAt
createdBy

updatedAt
updatedBy

isDeleted
deletedAt
```

---

# 11. Soft Delete Strategy

No se eliminarán registros físicamente.

### Example

```
isDeleted = true
deletedAt = currentDate
```

Benefits:

- Audit history.
- Recovery capability.
- Better data integrity.

---

# 12. Audit Strategy

All entities should include:

```
createdAt
createdBy

updatedAt
updatedBy
```

Optional:

```
deletedAt
deletedBy
```

---

# 13. Authentication Strategy

## JWT Authentication

```
Access Token
```

### Claims

```
sub
email
role
```

---

# 14. Authorization Strategy

## Roles

### SuperAdmin

Full access.

---

### Admin

Business administration.

---

### Client

Client portal access.

---

# 15. Database Strategy

## ORM

```
Entity Framework Core
```

---

## Database

```
PostgreSQL
```

---

## Migrations

```
EF Core Migrations
```

---

# 16. Frontend Architecture

## Framework

```
Angular
```

---

## Pattern

```
Feature Based Architecture
```

---

# 17. Angular Structure

```
src

├── app

│   ├── core
│   │
│   ├── shared
│   │
│   ├── features
│   │
│   └── layouts
```

---

# 18. Feature Modules

```
auth

dashboard

users

clients

products

quotes

materials

inventory

providers

purchases

documents

reviews

support-tickets
```

---

# 19. Deployment Strategy

## Environment

```
Docker
```

---

## Reverse Proxy

```
Nginx
```

---

## Cloud Provider

```
DigitalOcean
```

---

## CI/CD

```
GitHub Actions
```

---

# 20. Coding Standards

## Language

English only.

---

## Naming

PascalCase

```
CreateQuoteRequest
ProductModule
SupportTicket
```

---

camelCase

```
createdAt
updatedAt
phoneNumber
```

---

# 21. Deliverables

Al finalizar esta fase se deberán tener:

- Architectural style definition.
- Solution structure.
- Backend structure.
- Frontend structure.
- Naming conventions.
- Authentication strategy.
- Authorization strategy.
- Audit strategy.
- Soft delete strategy.
- Deployment strategy.

---

# Estado

Fase Actual: Solution Architecture & Project Structure
