# FASE 3 – DISEÑO DE API REST

## Proyecto

### SpaceIA – Universidad Inteligente

**Empresa:** Lattice Systems

---

# 1. Objetivo de la Fase

Diseñar la estructura de la API REST que conectará el Frontend en Angular con el Backend en ASP.NET Core.

Esta fase define los endpoints principales, métodos HTTP, responsabilidades de cada módulo y reglas básicas de acceso por rol.

---

# 2. Arquitectura General

```
Angular Frontend
      |
      | HTTP Requests
      v
ASP.NET Core Web API
      |
      | Entity Framework Core
      v
PostgreSQL Database
```

---

# 3. API Naming Convention

Todas las rutas estarán en inglés y en plural.

Ejemplos:

```
/api/users
/api/clients
/api/products
/api/quotes
/api/providers
/api/purchases
```

---

# 4. Authentication Module

## Base Route

```
/api/auth
```

## Endpoints

### Login

```
POST /api/auth/login
```

### Request Body

```json
{
  "email": "admin@latticesystems.com",
  "password": "password123"
}
```

### Response

```json
{
  "accessToken": "jwt_token",
  "user": {
    "id": "uuid",
    "firstName": "Daniel",
    "lastName": "Ojeda",
    "email": "admin@latticesystems.com",
    "role": "Admin"
  }
}
```

---

### Get Current User

```
GET /api/auth/me
```

### Access

- Admin
- Client

---

# 5. Users Module

## Base Route

```
/api/users
```

## Endpoints

```
GET /api/users
GET /api/users/{id}
POST /api/users
PUT /api/users/{id}
DELETE /api/users/{id}
```

## Access

- Admin

## Main Fields

```
id
roleId
firstName
lastName
email
phone
isActive
createdAt
updatedAt
```

---

# 6. Roles Module

## Base Route

```
/api/roles
```

## Endpoints

```
GET /api/roles
GET /api/roles/{id}
POST /api/roles
PUT /api/roles/{id}
DELETE /api/roles/{id}
```

## Access

- Admin

---

# 7. Clients Module

## Base Route

```
/api/clients
```

## Endpoints

```
GET /api/clients
GET /api/clients/{id}
POST /api/clients
PUT /api/clients/{id}
DELETE /api/clients/{id}
```

## Access

- Admin

## Client Self Profile

```
GET /api/clients/me
PUT /api/clients/me
```

## Access

- Client

---

# 8. Products Module

## Base Route

```
/api/products
```

## Public Endpoints

```
GET /api/products
GET /api/products/{id}
```

## Admin Endpoints

```
POST /api/products
PUT /api/products/{id}
DELETE /api/products/{id}
```

## Access

Public read:

- Visitor
- Client
- Admin

Write:

- Admin

---

# 9. Product Modules Module

## Base Route

```
/api/product-modules
```

## Endpoints

```
GET /api/product-modules
GET /api/product-modules/{id}
POST /api/product-modules
PUT /api/product-modules/{id}
DELETE /api/product-modules/{id}
```

## Extra Endpoint

```
GET /api/products/{productId}/modules
```

## Access

Read:

- Visitor
- Client
- Admin

Write:

- Admin

---

# 10. Quotes Module

## Base Route

```
/api/quotes
```

## Public Quote Request

```
POST /api/quotes
```

## Request Body

```json
{
  "requesterName": "Juan Pérez",
  "requesterEmail": "contacto@universidad.com",
  "phone": "4770000000",
  "institutionName": "Universidad Ejemplo",
  "studentCount": 2500,
  "buildingCount": 8,
  "accessPointCount": 4,
  "kioskCount": 2,
  "robotCount": 1,
  "items": [
    {
      "productModuleId": "uuid",
      "quantity": 1
    }
  ]
}
```

## Admin Endpoints

```
GET /api/quotes
GET /api/quotes/{id}
PUT /api/quotes/{id}/status
DELETE /api/quotes/{id}
```

## Client Endpoints

```
GET /api/quotes/my-quotes
```

## Access

Create quote:

- Visitor
- Client

Manage quotes:

- Admin

View own quotes:

- Client

---

# 11. Providers Module

## Base Route

```
/api/providers
```

## Endpoints

```
GET /api/providers
GET /api/providers/{id}
POST /api/providers
PUT /api/providers/{id}
DELETE /api/providers/{id}
```

## Access

- Admin

---

# 12. Purchases Module

## Base Route

```
/api/purchases
```

## Endpoints

```
GET /api/purchases
GET /api/purchases/{id}
POST /api/purchases
PUT /api/purchases/{id}
DELETE /api/purchases/{id}
```

## Access

- Admin

---

# 13. Documents Module

## Base Route

```
/api/documents
```

## Public/Admin Endpoints

```
GET /api/documents
GET /api/documents/{id}
POST /api/documents
PUT /api/documents/{id}
DELETE /api/documents/{id}
```

## Client Documents

```
GET /api/documents/my-documents
```

## Access

Public visible documents:

- Visitor
- Client
- Admin

Manage documents:

- Admin

Client documents:

- Client

---

# 14. Contact Messages Module

## Base Route

```
/api/contact-messages
```

## Public Endpoint

```
POST /api/contact-messages
```

## Admin Endpoints

```
GET /api/contact-messages
GET /api/contact-messages/{id}
PUT /api/contact-messages/{id}/status
DELETE /api/contact-messages/{id}
```

## Access

Create message:

- Visitor

Manage messages:

- Admin

---

# 15. Reviews Module

## Base Route

```
/api/reviews
```

## Public Endpoints

```
GET /api/reviews
GET /api/products/{productId}/reviews
```

## Client Endpoints

```
POST /api/reviews
GET /api/reviews/my-reviews
```

## Admin Endpoints

```
PUT /api/reviews/{id}/approve
PUT /api/reviews/{id}/reject
DELETE /api/reviews/{id}
```

## Access

Read approved reviews:

- Visitor
- Client
- Admin

Create review:

- Client

Moderate reviews:

- Admin

---

# 16. Support Tickets Module

## Base Route

```
/api/support-tickets
```

## Client Endpoints

```
GET /api/support-tickets/my-tickets
POST /api/support-tickets
PUT /api/support-tickets/{id}
```

## Admin Endpoints

```
GET /api/support-tickets
GET /api/support-tickets/{id}
PUT /api/support-tickets/{id}/status
DELETE /api/support-tickets/{id}
```

## Access

Create and view own tickets:

- Client

Manage tickets:

- Admin

---

# 17. Dashboard Module

## Base Route

```
/api/dashboard
```

## Admin Dashboard

```
GET /api/dashboard/admin
```

## Response Example

```json
{
  "totalClients": 10,
  "totalQuotes": 25,
  "pendingQuotes": 8,
  "totalProducts": 1,
  "totalProviders": 6,
  "openTickets": 3
}
```

## Client Dashboard

```
GET /api/dashboard/client
```

## Response Example

```json
{
  "totalPurchases": 2,
  "availableDocuments": 5,
  "openTickets": 1,
  "totalReviews": 1
}
```

---

# 18. Roles and Permissions

## Visitor

Puede acceder a:

```
GET /api/products
GET /api/product-modules
POST /api/quotes
POST /api/contact-messages
GET /api/reviews
```

---

## Client

Puede acceder a:

```
GET /api/auth/me
GET /api/clients/me
PUT /api/clients/me
GET /api/quotes/my-quotes
GET /api/documents/my-documents
POST /api/reviews
GET /api/reviews/my-reviews
POST /api/support-tickets
GET /api/support-tickets/my-tickets
```

---

## Admin

Puede acceder a todos los módulos administrativos:

```
/api/users
/api/roles
/api/clients
/api/products
/api/product-modules
/api/quotes
/api/providers
/api/purchases
/api/documents
/api/contact-messages
/api/reviews
/api/support-tickets
/api/dashboard/admin
```

---

# 19. Suggested DTOs

## Auth

```
LoginRequest
LoginResponse
CurrentUserResponse
```

## Users

```
CreateUserRequest
UpdateUserRequest
UserResponse
```

## Clients

```
CreateClientRequest
UpdateClientRequest
ClientResponse
```

## Products

```
CreateProductRequest
UpdateProductRequest
ProductResponse
```

## Quotes

```
CreateQuoteRequest
CreateQuoteItemRequest
QuoteResponse
UpdateQuoteStatusRequest
```

## Providers

```
CreateProviderRequest
UpdateProviderRequest
ProviderResponse
```

## Purchases

```
CreatePurchaseRequest
CreatePurchaseItemRequest
PurchaseResponse
```

## Documents

```
CreateDocumentRequest
UpdateDocumentRequest
DocumentResponse
```

## Reviews

```
CreateReviewRequest
ReviewResponse
```

## SupportTickets

```
CreateSupportTicketRequest
UpdateSupportTicketStatusRequest
SupportTicketResponse
```

---

# 20. API Response Standard

Todas las respuestas deberían mantener una estructura consistente.

## Success Response

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

## Error Response

```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    "Email is required",
    "Password is required"
  ]
}
```

---

# 21. MVP API Scope

Para la primera versión funcional se recomienda implementar solo:

## Authentication

```
POST /api/auth/login
GET /api/auth/me
```

## Users

```
GET /api/users
POST /api/users
PUT /api/users/{id}
DELETE /api/users/{id}
```

## Products

```
GET /api/products
POST /api/products
PUT /api/products/{id}
DELETE /api/products/{id}
```

## ProductModules

```
GET /api/product-modules
POST /api/product-modules
PUT /api/product-modules/{id}
DELETE /api/product-modules/{id}
```

## Quotes

```
POST /api/quotes
GET /api/quotes
GET /api/quotes/{id}
PUT /api/quotes/{id}/status
```

## ContactMessages

```
POST /api/contact-messages
GET /api/contact-messages
```

---

# 22. Phase 3 Deliverables

Al finalizar esta fase se deberán tener los siguientes entregables:

- API route map.
- REST endpoint list.
- Access control definition.
- DTO naming convention.
- API response standard.
- MVP API scope.
- Base para implementación en ASP.NET Core.

---

# Estado

Fase Actual: Diseño de API REST

Fase Anterior: Diseño de Base de Datos

Próxima Fase: Wireframes y Flujos de Pantallas