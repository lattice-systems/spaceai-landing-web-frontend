# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**SpaceIA** is a commercial and administrative web platform developed by **Lattice Systems** to sell, manage, and support the SpaceIA ecosystem — an intelligent university platform integrating AI, IoT, and automation.

This repository is the **Angular frontend** for the platform. The backend (ASP.NET Core) lives in a separate repository.

## Tech Stack

- **Framework:** Angular 20+ (standalone components, signals)
- **Styling:** Tailwind CSS
- **Icons:** Lucide Angular
- **Charts:** Chart.js
- **Auth:** JWT (stored in memory/service, not localStorage)
- **API:** REST — base URL configured per environment

## Architecture

Feature-based Angular architecture:

```
src/app/
├── core/          # Singleton services, guards, interceptors, auth
├── shared/        # Reusable components, directives, pipes, UI primitives
├── features/      # One folder per domain feature (lazy-loaded)
│   ├── public/    # Landing, nosotros, spaceIA, casos-de-uso, faq, contacto, cotizador
│   ├── auth/      # Login
│   ├── client/    # Portal cliente: perfil, documentos, compras, opiniones, tickets
│   └── admin/     # Portal admin: dashboard, usuarios, clientes, productos, cotizaciones,
│                  #   materiales, inventario, proveedores, compras, documentos, opiniones, tickets
└── layouts/       # PublicLayout, ClientLayout, AdminLayout
```

Route guards enforce role-based access: `Visitante` (unauthenticated), `Cliente`, `Admin/SuperAdmin`.

## Design System

Aesthetic: **shadcn/ui style** — clean, minimal, neutral-heavy, thin borders over heavy shadows.  
Component library: **spartan/ui** (shadcn port for Angular via Radix NG primitives).

| Token | Value | Tailwind |
|---|---|---|
| Primary | `#2563EB` Blue 600 | `bg-primary` |
| Secondary | `#06B6D4` Cyan 500 | `bg-secondary` |
| Accent (AI only) | `#8B5CF6` Violet 500 | `bg-accent` |
| Background | `#F8FAFC` Slate 50 | `bg-background` |
| Card | `#FFFFFF` | `bg-card` |
| Border | `#E2E8F0` Slate 200 | `border-border` |
| Text primary | `#0F172A` Slate 900 | `text-foreground` |
| Text muted | `#64748B` Slate 500 | `text-muted-foreground` |
| Font | Inter | — |

Radius: `rounded-md` (6px) for buttons/inputs, `rounded-lg` (8px) for cards.  
Cards: `bg-card border border-border rounded-lg p-6 shadow-sm` (thin border, not heavy shadow).  
Inputs: `h-10 rounded-md border border-input` (40px height, shadcn standard).  
Violet accent reserved **exclusively** for AI-related features.

Visual reference: Vercel, Linear, Stripe Dashboard, Notion, GitHub.

## Commands

```bash
# Install dependencies
npm install

# Development server
ng serve

# Build for production
ng build --configuration production

# Run unit tests
ng test

# Run a single spec file
ng test --include='**/auth.service.spec.ts'

# Lint
ng lint
```

## Coding Conventions

- **Language:** English only (code, variables, components, routes, API calls).
- **Naming:** PascalCase for classes/components/interfaces; camelCase for variables/properties.
- **Components:** Standalone components only (no NgModules).
- **DTOs:** Mirror backend naming — `CreateXRequest`, `UpdateXRequest`, `XResponse`.
- **Soft delete:** Never hard-delete records; the backend uses `isDeleted` flag.
- **Audit fields:** Entities include `createdAt`, `updatedAt`, `createdBy`, `updatedBy`.

## Three Portals

The app has three distinct contexts with different layouts and route prefixes:

| Portal | Prefix | Actors |
|---|---|---|
| Public site | `/` | Visitante (unauthenticated) |
| Client portal | `/client` | Cliente |
| Admin portal | `/admin` | Admin, SuperAdmin |

## API Endpoints (reference)

```
/api/auth
/api/users          /api/clients
/api/products       /api/product-modules
/api/quotes
/api/materials      /api/inventory-movements
/api/providers      /api/purchases
/api/documents      /api/reviews
/api/support-tickets
```

## MVP Scope

Public: Home, SpaceIA, Contacto, Cotizador.
Client portal: Login, Perfil, Documentación.
Admin portal: Usuarios, Productos, Cotizaciones.

**Out of scope:** online payments, SAT invoicing, mobile app, IoT hardware integrations.
