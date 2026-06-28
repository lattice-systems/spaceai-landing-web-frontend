# FASE 2.1 – INVENTORY & COSTING MODULE

## Proyecto

### SpaceIA – Universidad Inteligente

**Empresa:** Lattice Systems

---

# 1. Objetivo de la Fase

Complementar el diseño de base de datos con un módulo de inventario, materia prima, método de costeo y explosión de materiales para cumplir con los requerimientos administrativos del proyecto.

Este módulo permitirá administrar los materiales necesarios para fabricar o implementar los módulos de SpaceIA, calcular costos y conocer la composición de cada producto o módulo.

---

# 2. Alcance del Módulo

## Incluye

- Administración de materia prima.
- Registro de costos unitarios.
- Relación entre productos y materiales.
- Explosión de materiales.
- Cálculo de costo estimado por producto o módulo.
- Movimientos básicos de inventario.

---

# 3. New Entities

## 3.1 Materials

Representa la materia prima o insumos necesarios para fabricar o instalar los módulos de SpaceIA.

### Fields

- id
- name
- description
- unitOfMeasure
- unitCost
- currentStock
- minimumStock
- isActive
- createdAt
- updatedAt

### Examples

- Raspberry Pi 4
- ESP32
- Touch Screen
- Camera Module
- Relay Module
- Ultrasonic Sensor
- Microphone
- Speaker
- Wiring Kit

---

## 3.2 ProductRecipes

Representa la receta o composición de un producto o módulo.

También funciona como la explosión de materiales del producto.

### Fields

- id
- productModuleId
- materialId
- quantity
- unitCost
- subtotal
- createdAt

### Relationships

- One product module can have many product recipe items.
- One material can be used in many product recipes.

---

## 3.3 InventoryMovements

Registra entradas y salidas de materia prima.

### Fields

- id
- materialId
- movementType
- quantity
- unitCost
- totalCost
- reason
- createdAt

### Suggested Movement Types

- In
- Out
- Adjustment

### Examples

- Compra de sensores
- Uso de Raspberry Pi para kiosco
- Ajuste por daño de componente

---

# 4. Main Relationships

## ProductModule – ProductRecipe

```
ProductModules 1 ─── N ProductRecipes
```

## Material – ProductRecipe

```
Materials 1 ─── N ProductRecipes
```

## Material – InventoryMovement

```
Materials 1 ─── N InventoryMovements
```

---

# 5. Updated Relational Model

```
Materials
- id PK
- name
- description
- unitOfMeasure
- unitCost
- currentStock
- minimumStock
- isActive
- createdAt
- updatedAt

ProductRecipes
- id PK
- productModuleId FK
- materialId FK
- quantity
- unitCost
- subtotal
- createdAt

InventoryMovements
- id PK
- materialId FK
- movementType
- quantity
- unitCost
- totalCost
- reason
- createdAt
```

---

# 6. Costing Method

## Proposed Method

**Standard Costing Method**

El sistema utilizará un método de costeo estándar, donde cada material tendrá un costo unitario definido.

El costo de cada módulo se calculará sumando los subtotales de los materiales que forman parte de su receta.

---

## Formula

```
Material Subtotal = Quantity × Unit Cost
```

```
Product Module Cost = Sum of Material Subtotals
```

```
Suggested Sale Price = Product Module Cost + Profit Margin
```

---

# 7. Bill of Materials Example

## Product Module: AI Kiosk

```
AI Kiosk
│
├── Raspberry Pi 4 x 1
├── Touch Screen x 1
├── Microphone x 1
├── Speaker x 1
├── Camera Module x 1
├── Wiring Kit x 1
└── Case Structure x 1
```

---

## Example Costing

```
Raspberry Pi 4       1 × $1,500 = $1,500
Touch Screen         1 × $1,200 = $1,200
Microphone           1 × $250   = $250
Speaker              1 × $200   = $200
Camera Module        1 × $350   = $350
Wiring Kit           1 × $150   = $150
Case Structure       1 × $500   = $500
```

```
Total Estimated Cost = $4,150 MXN
```

---

## Product Module: Smart Access Control

```
Smart Access Control
│
├── ESP32 x 1
├── Camera Module x 1
├── Relay Module x 1
├── Buzzer x 1
├── Wiring Kit x 1
└── Case Structure x 1
```

---

## Example Costing

```
ESP32                1 × $180 = $180
Camera Module        1 × $350 = $350
Relay Module         1 × $80  = $80
Buzzer               1 × $40  = $40
Wiring Kit           1 × $100 = $100
Case Structure       1 × $250 = $250
```

```
Total Estimated Cost = $1,000 MXN
```

---

# 8. Business Rules

## Materials

- Each material must have a unit cost.
- Each material must have a unit of measure.
- Materials can be activated or deactivated.
- Current stock cannot be negative.

---

## ProductRecipes

- Each product module can have multiple materials.
- The subtotal is calculated using quantity and unit cost.
- If a material cost changes, the recipe can be updated.

---

## InventoryMovements

- Every stock change must generate an inventory movement.
- Movement type can be In, Out or Adjustment.
- Inventory In increases current stock.
- Inventory Out decreases current stock.
- Adjustment modifies stock due to corrections, damage or inventory review.

---

## Costing

- The module cost is calculated from the sum of recipe materials.
- The sale price may include a profit margin.
- The quote system can use the module price calculated from the costing method.

---

# 9. Updated API Scope

## Materials

```
GET /api/materials
GET /api/materials/{id}
POST /api/materials
PUT /api/materials/{id}
DELETE /api/materials/{id}
```

## ProductRecipes

```
GET /api/product-modules/{productModuleId}/recipe
POST /api/product-recipes
PUT /api/product-recipes/{id}
DELETE /api/product-recipes/{id}
```

## InventoryMovements

```
GET /api/inventory-movements
POST /api/inventory-movements
GET /api/materials/{materialId}/movements
```

## Costing

```
GET /api/product-modules/{productModuleId}/cost
```

---

# 10. Updated Admin Portal

Agregar al portal administrador los siguientes módulos:

## Materials

Permite administrar la materia prima.

## Product Recipes

Permite configurar la explosión de materiales de cada módulo.

## Inventory Movements

Permite registrar entradas, salidas y ajustes de inventario.

## Costing

Permite calcular el costo estimado de fabricación o implementación de cada módulo.

---

# 11. Updated Dashboard Metrics

El dashboard administrativo puede mostrar:

- Total materials.
- Low stock materials.
- Total inventory value.
- Product module estimated costs.
- Recent inventory movements.

---

# 12. Deliverables

Al finalizar esta fase se deberán tener:

- Materials entity.
- ProductRecipes entity.
- InventoryMovements entity.
- Costing method definition.
- Bill of Materials examples.
- Updated API scope.
- Updated admin module list.
- Updated database model.

---

# Estado

Fase Actual: Inventory & Costing Module

Fase Anterior: Diseño de Base de Datos

Próxima Fase: Design System