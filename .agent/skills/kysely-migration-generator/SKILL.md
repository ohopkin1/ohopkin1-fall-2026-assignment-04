---
name: kysely-migration-generator
description: Generate type-safe Kysely PostgreSQL migrations from Mermaid Entity-Relationship Diagrams. Trigger when the user asks to convert an ERD, Mermaid schema, data model, or database diagram into a Kysely migration.
---

# Kysely Migration Generator

Convert a validated Mermaid ERD into a type-safe Kysely PostgreSQL migration.

## Workflow

1. Read the Mermaid ERD from:

   `docs/architecture/schema.mmd`

2. Parse every entity, attribute, primary key, foreign key, relationship, and cardinality.

3. Inspect the existing migration structure in:

   `src/db/migrations/001_initial_schema.ts`

   Use it as the project's structural reference for imports, function signatures, and Kysely migration conventions.

4. Convert Mermaid entities into PostgreSQL tables.

5. Convert entity names to snake_case table names.

   Example:

   `USERS` → `users`

   `BOOK_AUTHORS` → `book_authors`

6. Convert attributes into snake_case PostgreSQL columns.

7. Map Mermaid data types to appropriate PostgreSQL/Kysely types.

   Common mappings include:

   - `int` → `integer`
   - `integer` → `integer`
   - `string` → `text`
   - `text` → `text`
   - `boolean` → `boolean`
   - `date` → `date`
   - `datetime` → `timestamp`

8. Primary keys:

   - Integer primary keys should follow the existing project convention:
     `.addColumn('id', 'serial', (col) => col.primaryKey())`
   - Use `serial` for auto-generating integer primary keys unless the ERD explicitly requires another integer strategy.
   - UUID primary keys should use an appropriate PostgreSQL UUID type and generation strategy only when the ERD explicitly specifies UUIDs.
   - Preserve the primary-key type specified by the ERD.

9. Foreign keys:

   - Convert `FK` attributes into foreign-key references.
   - Use `.references('table.column')`.
   - Use `.onDelete('cascade')` for dependent relationships where appropriate.

10. Relationships:

   - `||--o{` represents one-to-many.
   - `||--o|` represents one-to-one.
   - One-to-one relationships must enforce uniqueness on the foreign-key column.
   - Many-to-many relationships must use a junction table.
   - Junction-table foreign keys should reference their parent tables and use cascade deletion.

11. Do not create a table for an entity that the user explicitly states already exists.

12. Generate a migration file using:

   `src/db/migrations/<timestamp>_<migration_name>.ts`

13. The migration must export:

export async function up(db: Kysely<any>): Promise<void>


   and:

export async function down(db: Kysely<any>): Promise<void>


14. The `up` function must create tables in dependency order.

15. The `down` function must drop tables in reverse dependency order.

16. Do not use destructive operations unrelated to the generated schema.

17. Preserve referential integrity.

## Migration Quality Requirements

The generated migration must:

- Compile with the project's TypeScript configuration.
- Use the existing project's Kysely conventions.
- Create all required tables.
- Create all required columns.
- Correctly identify primary keys.
- Correctly identify foreign keys.
- Correctly represent relationship cardinalities.
- Correctly implement many-to-many junction tables.
- Apply appropriate cascade behavior.
- Avoid duplicating existing tables.
- Drop tables in reverse dependency order.

## Verification

After generating the migration:

1. Run:

npm run build


2. If TypeScript compilation fails, inspect and correct the generated migration.

3. Start the PostgreSQL database if necessary:

docker compose up -d


4. Run:

npm run migrate:up


5. If the migration fails, inspect the database error, correct the migration, and rerun the verification.

Do not claim the migration is complete until it compiles and executes successfully.
