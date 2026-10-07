---
name: erd-generator
description: Generate a verified Mermaid Entity-Relationship Diagram from domain requirements, compile it to SVG, and validate syntax. Use when requested to design an ERD, data model, or architecture diagram.
---

# ERD Generator

Generate a verified Mermaid Entity-Relationship Diagram from the user's domain requirements.

## Workflow

1. Parses the user's domain requirements and identifies the following:
   - Entities
   - Attributes
   - Primary keys (PK)
   - Foreign keys (FK)
   - Relationships
   - Cardinalities
   - Any explicit business rules or constraints

2. Makes reasonable schema changes once the user has provided necessary information. Do not invent unnecessary entities, code, or relationships.

3. Writes the Mermaid ERD to:

   `docs/architecture/schema.mmd`

4. The mmd file must have the Mermaid `erDiagram` syntax.

5. Renders and validates the created diagram by executing:

  node .agent/skills/erd-generator/scripts/render_erd.js docs/architecture/schema.mmd


6. If the renderer returns an error beginning with `SYNTAX_ERROR:`, view and correct the Mermaid syntax causing the error in `docs/architecture/schema.mmd`, and rerun the renderer.

7. Retry the correction and renderer at most 3 times if necessary.

8. Does NOT report that the ERD was successfully generated unless the renderer exits with 'SUCCESS' and returns the generated SVG asset at:

   `docs/architecture/erd.svg`

9. After successful rendering, returns the following to the user:
   - The Mermaid source from `docs/architecture/schema.mmd`
   - The generated SVG asset at `docs/architecture/erd.svg`

## Mermaid Rules

- Use `erDiagram` as the diagram type.
- Every entity must have defined attributes.
- Primary keys are designated with `PK`.
- Foreign keys are designated with `FK`.
- Use Mermaid relationship syntax that accurately meets the requirements of the user.
- Uses descriptive relationship labels.
- Do not duplicate an existing entity when the user explicitly says it already exists.
- Prefer explicit foreign-key attributes over implicit relationships.
- Ensure the final Mermaid syntax can be compiled by the local renderer.

## Validation

The renderer is the overarching validation system.

NEVER bypasses the renderer or manually reports that invalid Mermaid syntax is valid.

If rendering fails, fixes the Mermaid source and retries in accordance with the workflow above.