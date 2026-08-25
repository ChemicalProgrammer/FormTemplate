# Case Form — Google Apps Script

Web application for capturing a case, creating its Google Drive folder
structure, and generating a spreadsheet from a Google Sheets template.

## Current behavior

1. The web app opens directly on the form. It does not force the Settings
   dialog to open at startup.
2. The case title is captured once above the form sections. It is the only
   required form value.
3. Sections A, B, and D may be completely empty.
4. Component percentages are optional and do not have to total 100%.
5. Section C displays one comparison table with one row per selected component
   and one shared header for C1 through C15.
6. On submission, the application creates:

   ```text
   Case title/
   ├── 01/
   │   └── Case title - Form
   ├── 02/
   ├── 03/
   └── 04/
   ```

7. It copies the Google Sheets template into `01` and writes values according
   to `TemplateMapping.gs`.
8. The success dialog can be closed with its X button, by clicking the
   backdrop, or by pressing Escape. Closing it preserves the completed form;
   **Create another case** closes it and resets the form.

## Main files

| File | Responsibility |
| --- | --- |
| `Config.gs` | Application name, numbered folders, and generated filename suffix. |
| `FieldDefinitions.gs` | Optional Section A fields, C headers/units, and D parameters. |
| `Components.gs` | Component database and C1–C15 values. |
| `COMPONENT_DATABASE_EXAMPLE.md` | Complete example of a realistic component database. |
| `TemplateMapping.gs` | Mapping from each form value to its destination sheet/cell. |
| `SettingsService.gs` | Per-user Drive folder and template settings. |
| `Validation.gs` | Server-side normalization; only the case title is required. |
| `DriveService.gs` | Duplicate check and creation of the case folder structure. |
| `TemplateService.gs` | Template copy and Google Sheets value insertion. |
| `WebApp.gs` | Web entry point and submission orchestration. |
| `Index.html` | Interface structure and English labels. |
| `Styles.html` | Visual styling and responsive behavior. |
| `Scripts.html` | Client-side behavior. |
| `Tests.gs` | Structural self-test without Drive writes. |

## Case title mapping

The title is not repeated in Section A. It is written directly from the top
field through:

```javascript
general: {
  caseName: { sheet: 'Form', cell: 'B2' }
}
```

Change this destination in `TemplateMapping.gs` to match the real template.

## Template setup

1. Create or select a native Google Sheets file.
2. Open `TemplateMapping.gs`.
3. Change the example sheet names and cells to match the real template.
4. Review `GOOGLE_SHEETS_TEMPLATE.md` for mapping details.

The example mapping expects sheets named `Form`, `Components`, and
`Characteristics`. Names must match the real template exactly.

## Test and deploy

1. Run `runProjectSelfTest` from the Apps Script editor.
2. Confirm the returned object contains `ok: true`.
3. Select **Deploy → New deployment → Web app**.
4. Prefer **Execute as: User accessing the web app** when every user should
   operate with their own Drive permissions.
5. Restrict access to the appropriate organization or group.

After changing an existing deployment, select **Deploy → Manage deployments**,
edit the deployment, choose **New version**, and deploy it again.

## Settings and recovery

The Settings dialog accepts either complete Drive URLs or IDs for the
destination folder and Google Sheets template. These values are currently saved
per user with `PropertiesService.getUserProperties()`.

The template itself is never modified. The application writes only to a copy.
If generation fails after the case folder is created, the incomplete case
folder is moved to Drive trash, where it can still be recovered.

The current implementation uses `DriveApp`. For complete Shared Drive support,
consider migrating folder and file operations to the Advanced Drive service.
