# Preparing the Google Sheets template

The application copies a native Google Sheets file and writes form values into
the copy. It does not use text placeholders.

## Cell mapping

Edit `TemplateMapping.gs`. Each individual destination contains:

```javascript
{ sheet: 'Form', cell: 'B2' }
```

- `sheet` is the exact template tab name.
- `cell` uses A1 notation.

The case title is captured once above the form and written through
`general.caseName`. It is not part of Section A.

## Component lists

Sections B and C support a variable number of components. Configure their first
row and destination columns:

```javascript
sectionB: {
  sheet: 'Components',
  startRow: 3,
  maxRows: 50,
  percentageAsDecimal: true,
  columns: { code: 'A', name: 'B', percentage: 'C' }
}
```

The first selected component is written to row 3, the second to row 4, and so
on. `maxRows` is the maximum reserved capacity.

When `percentageAsDecimal` is `true`, an entered value of 25% is written as
`0.25`. Format those template cells as percentages. A blank percentage remains
blank.

## Optional values

Sections A, B, and D may be empty. Empty mapped values are written as blank
cells. Section B and C write nothing when no components are selected.

## Rules

- The template must be a native Google Sheets file.
- Sheet names must exactly match `TemplateMapping.gs`.
- Prepare styles, number formats, formulas, and merged cells in advance.
- Mapped cells must be editable by the user running the application.
- Do not place formulas in cells that are intended to receive form values.
