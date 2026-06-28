# FASE 4 – WIREFRAMES Y FLUJOS DE PANTALLAS

## Proyecto

### SpaceIA – Universidad Inteligente

**Empresa:** Lattice Systems

---

# 1. Objetivo de la Fase

Definir la estructura visual, navegación y flujo de interacción de los usuarios dentro de la plataforma antes de iniciar el diseño UI y el desarrollo.

Esta fase permite validar la experiencia de usuario (UX), identificar pantallas necesarias y reducir cambios durante el desarrollo.

---

# 2. Site Map

## Public Website

```
Home
│
├── About Us
├── SpaceIA
│   ├── Mobile App
│   ├── Smart Access Control
│   ├── AI Kiosk
│   └── Autonomous Robot
│
├── Use Cases
├── FAQ
├── Contact
├── Request Quote
└── Login
```

---

## Client Portal

```
Dashboard
│
├── Profile
├── Documents
├── Purchases
├── Reviews
└── Support Tickets
```

---

## Admin Portal

```
Dashboard
│
├── Users
├── Clients
├── Products
├── Product Modules
├── Quotes
├── Providers
├── Purchases
├── Documents
├── Reviews
├── Contact Messages
└── Support Tickets
```

---

# 3. Visitor Flow

```
Visitor
│
├── Home
│
├── Explore SpaceIA
│
├── View Product Modules
│
├── Read FAQ
│
├── Contact Company
│
└── Request Quote
```

---

# 4. Client Flow

```
Login
│
├── Dashboard
│
├── Profile
│
├── Documents
│
├── Purchases
│
├── Reviews
│
└── Support Tickets
```

---

# 5. Admin Flow

```
Login
│
├── Dashboard
│
├── Users
│
├── Clients
│
├── Products
│
├── Product Modules
│
├── Quotes
│
├── Providers
│
├── Purchases
│
├── Reviews
│
├── Contact Messages
│
└── Support Tickets
```

---

# 6. Public Website Wireframes

## Home Page

```
┌───────────────────────────────┐
│ Navbar                        │
├───────────────────────────────┤
│ Hero Section                  │
│ SpaceIA Overview              │
│ CTA: Request Quote            │
├───────────────────────────────┤
│ Product Modules               │
├───────────────────────────────┤
│ Benefits                      │
├───────────────────────────────┤
│ Testimonials                  │
├───────────────────────────────┤
│ Contact CTA                   │
├───────────────────────────────┤
│ Footer                        │
└───────────────────────────────┘
```

---

## SpaceIA Page

```
┌───────────────────────────────┐
│ Header                        │
├───────────────────────────────┤
│ What is SpaceIA?              │
├───────────────────────────────┤
│ Mobile App                    │
├───────────────────────────────┤
│ Smart Access Control          │
├───────────────────────────────┤
│ AI Kiosk                      │
├───────────────────────────────┤
│ Autonomous Robot              │
├───────────────────────────────┤
│ CTA: Request Quote            │
└───────────────────────────────┘
```

---

## Quote Page

```
┌───────────────────────────────┐
│ Quote Form                    │
├───────────────────────────────┤
│ Institution Information       │
├───────────────────────────────┤
│ Student Count                 │
├───────────────────────────────┤
│ Product Modules Selection     │
├───────────────────────────────┤
│ Infrastructure Requirements   │
├───────────────────────────────┤
│ Estimated Total              │
├───────────────────────────────┤
│ Submit Quote Request          │
└───────────────────────────────┘
```

---

## Contact Page

```
┌───────────────────────────────┐
│ Contact Information           │
├───────────────────────────────┤
│ Contact Form                  │
├───────────────────────────────┤
│ Company Information           │
├───────────────────────────────┤
│ Social Networks               │
└───────────────────────────────┘
```

---

# 7. Authentication Wireframe

## Login Page

```
┌───────────────────────────────┐
│ Company Logo                  │
├───────────────────────────────┤
│ Email                         │
├───────────────────────────────┤
│ Password                      │
├───────────────────────────────┤
│ Login Button                  │
├───────────────────────────────┤
│ Forgot Password               │
└───────────────────────────────┘
```

---

# 8. Client Portal Wireframes

## Client Dashboard

```
┌───────────────────────────────┐
│ Sidebar                       │
├───────────────────────────────┤
│ Welcome Card                  │
├───────────────────────────────┤
│ Purchased Products            │
├───────────────────────────────┤
│ Available Documents           │
├───────────────────────────────┤
│ Open Tickets                  │
└───────────────────────────────┘
```

---

## Profile Page

```
┌───────────────────────────────┐
│ Personal Information          │
├───────────────────────────────┤
│ Contact Information           │
├───────────────────────────────┤
│ Change Password               │
├───────────────────────────────┤
│ Save Changes                  │
└───────────────────────────────┘
```

---

## Documents Page

```
┌───────────────────────────────┐
│ Search Documents              │
├───────────────────────────────┤
│ Document List                 │
│ - User Manual                 │
│ - Installation Guide          │
│ - Technical Documentation     │
├───────────────────────────────┤
│ Download Button               │
└───────────────────────────────┘
```

---

## Support Tickets Page

```
┌───────────────────────────────┐
│ Create Ticket                 │
├───────────────────────────────┤
│ Open Tickets                  │
├───────────────────────────────┤
│ Ticket Details                │
├───────────────────────────────┤
│ Status Tracking               │
└───────────────────────────────┘
```

---

# 9. Admin Portal Wireframes

## Admin Dashboard

```
┌──────────────────────────────────┐
│ Sidebar                          │
├──────────────────────────────────┤
│ Total Clients                    │
├──────────────────────────────────┤
│ Total Quotes                     │
├──────────────────────────────────┤
│ Pending Quotes                   │
├──────────────────────────────────┤
│ Open Tickets                     │
├──────────────────────────────────┤
│ Revenue Summary                  │
└──────────────────────────────────┘
```

---

## Generic Management Page

Applicable to:

- Users
- Clients
- Products
- Providers
- Purchases

```
┌──────────────────────────────────┐
│ Page Title                       │
├──────────────────────────────────┤
│ Search Bar                       │
├──────────────────────────────────┤
│ Filters                          │
├──────────────────────────────────┤
│ Data Table                       │
│                                  │
│                                  │
├──────────────────────────────────┤
│ Pagination                       │
├──────────────────────────────────┤
│ Create Button                    │
└──────────────────────────────────┘
```

---

## Quotes Management

```
┌──────────────────────────────────┐
│ Quotes Table                     │
├──────────────────────────────────┤
│ Pending                          │
│ Under Review                     │
│ Approved                         │
│ Rejected                         │
├──────────────────────────────────┤
│ Quote Details                    │
├──────────────────────────────────┤
│ Update Status                    │
└──────────────────────────────────┘
```

---

# 10. MVP Screens

Estas son las pantallas mínimas necesarias para la primera versión funcional.

## Public

- Home
- SpaceIA
- Request Quote
- Contact
- Login

## Client

- Dashboard
- Profile
- Documents

## Admin

- Dashboard
- Users
- Products
- Product Modules
- Quotes
- Contact Messages

---

# 11. User Experience Guidelines

## Navigation

- Maximum 3 clicks to reach any feature.
- Persistent navigation menu.
- Responsive layout.

## Forms

- Inline validation.
- Clear error messages.
- Required field indicators.

## Tables

- Search.
- Sorting.
- Pagination.

## Dashboard

- Summary cards.
- Recent activity.
- Quick actions.

---

# 12. Deliverables

Al finalizar esta fase se deberán tener:

- Site Map.
- User Flows.
- Screen Inventory.
- Low-Fidelity Wireframes.
- MVP Screen Definition.
- UX Guidelines.

---

# Estado

Fase Actual: Wireframes y Flujos de Pantallas

Fase Anterior: Diseño de API REST

Próxima Fase: Design System (UI Kit, Colors, Typography, Components)