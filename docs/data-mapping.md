# ProfitLeak Data Mapping & Entity Normalization

## 1. Purpose of External-to-Internal Mapping
Every 3rd-party system (1C, Poster, Didox, Bank) employs proprietary nomenclatures, SKU formatting, and tax terminology. The Data Mapping layer decouples ProfitLeak's internal relational schema from external variations.

---

## 2. Entity Mapping Schema (`external_entity_mappings`)
Mappings are stored in a dedicated persistent table:

| Column | Type | Example |
|---|---|---|
| `connection_id` | UUID | Foreign key to `integration_connections` |
| `entity_type` | Enum | `PRODUCT`, `CUSTOMER`, `SUPPLIER`, `PAYMENT_METHOD` |
| `internal_id` | String | `PRD-UUID-00129` |
| `external_id` | String | `1C_NOMENCLATURE_7721` |
| `external_code`| String | `4780001239841` (Barcode) |
| `mapping_metadata` | JSON | `{ "unit": "kg", "tax_rate": 12, "source_currency": "UZS" }` |

---

## 3. Transformation & Coercion Rules
1. **Numbers & Currencies**: All monetary figures are converted to canonical Uzbek Som (`UZS`) as a fixed-point numeric, preventing floating-point rounding errors.
2. **Timestamps**: All incoming dates are parsed to UTC ISO-8601 timestamps.
3. **SKU / Barcode Lookup Pipeline**:
   - Step 1: Match on exact `external_id` via mapping table.
   - Step 2: Fallback to exact barcode match in internal `products` table.
   - Step 3: If no match is found, item is flagged as `UNMAPPED_EXTERNAL_ITEM`, auto-generating an Action Item for the catalog manager.
