# Case Form — Google Apps Script

Aplicación web para capturar un caso, crear su expediente en Google Drive y
generar una hoja de cálculo a partir de una plantilla de Google Sheets.

## Qué hace

1. La web abre directamente el formulario. No muestra Opciones al iniciar.
2. Cada usuario puede configurar una carpeta destino y una plantilla desde el
   botón de engrane.
3. Al enviar el formulario, crea esta estructura:

   ```text
   Nombre del caso/
   ├── 01/
   │   └── Nombre del caso - Formulario
   ├── 02/
   ├── 03/
   └── 04/
   ```

4. Copia la plantilla de Google Sheets dentro de `01`.
5. Escribe los datos en las hojas y celdas definidas en `TemplateMapping.gs`.
6. Impide crear un caso duplicado en la misma carpeta destino.
7. Valida que la composición de B sea 100% y que en D se cumpla
   `Min ≤ Target ≤ Max`.

## Archivos y dónde editar

| Archivo | Responsabilidad |
| --- | --- |
| `Config.gs` | Nombre de la app, carpetas `01`–`04` y sufijo del archivo generado. |
| `FieldDefinitions.gs` | Campos de A, nombres/unidades de C y parámetros de D. |
| `Components.gs` | Base de datos de componentes y sus 15 características. |
| `COMPONENT_DATABASE_EXAMPLE.md` | Ejemplo completo para sustituir la base ficticia por datos reales. |
| `TemplateMapping.gs` | Relación editable entre cada dato y su hoja/celda destino. |
| `SettingsService.gs` | Opciones personales y validación de IDs de Drive. |
| `Validation.gs` | Reglas de negocio del formulario. |
| `DriveService.gs` | Creación de la carpeta del caso y sus subcarpetas. |
| `TemplateService.gs` | Copia de la plantilla y escritura en Google Sheets. |
| `WebApp.gs` | Entrada de la web app y coordinación del envío. |
| `Index.html` | Estructura de la interfaz. |
| `Styles.html` | Estilos visuales. |
| `Scripts.html` | Comportamiento de la interfaz. |
| `Tests.gs` | Autoprueba sin escribir archivos en Drive. |

## Preparar la plantilla

1. Cree o seleccione un archivo nativo de Google Sheets.
2. Abra `TemplateMapping.gs`.
3. Cambie los nombres de hoja y las celdas de ejemplo para que coincidan con la
   plantilla real.
4. Revise `GOOGLE_SHEETS_TEMPLATE.md` para conocer el formato del mapa.

Los campos de `general`, A y D se asignan a celdas individuales. B y C son
listas variables: `startRow` define la primera fila y `columns` define dónde se
escribe cada propiedad.

En la interfaz, la sección C presenta una sola tabla comparativa: cada
componente seleccionado ocupa una fila y las 15 características comparten un
único encabezado.

Ejemplo de un campo individual:

```javascript
A_SHORT_1: { sheet: 'Formulario', cell: 'B5' }
```

Ejemplo de una lista:

```javascript
sectionB: {
  sheet: 'Componentes',
  startRow: 3,
  maxRows: 50,
  percentageAsDecimal: true,
  columns: { code: 'A', name: 'B', percentage: 'C' }
}
```

## Instalar o actualizar el proyecto

En el editor de Apps Script, cree o reemplace los archivos `.gs` y `.html` con
los de esta carpeta. Asegúrese de agregar el nuevo archivo
`TemplateMapping.gs`.

Abra **Configuración del proyecto**, active la visualización del manifiesto y
reemplace `appsscript.json`. El manifiesto utiliza permisos de Drive, Google
Sheets y propiedades de usuario; ya no utiliza el permiso de Google Docs.

## Probar

1. En el selector de funciones ejecute `runProjectSelfTest`.
2. Autorice los permisos solicitados.
3. El resultado debe incluir `ok: true`.

La autoprueba revisa los conteos del formulario y que todos los campos estén
mapeados. No valida que las pestañas existan en una plantilla concreta; eso se
comprueba cuando se crea el primer caso.

## Desplegar

1. Seleccione **Implementar → Nueva implementación → Aplicación web**.
2. Para que cada usuario trabaje con sus propios permisos y opciones, seleccione
   **Ejecutar como: usuario que accede a la aplicación web** cuando esté
   disponible.
3. Limite el acceso a la organización o al grupo correspondiente.
4. Autorice Drive, Google Sheets y almacenamiento de propiedades.
5. Abra la URL terminada en `/exec`.

Después de modificar una implementación existente, use **Implementar →
Administrar implementaciones**, edítela y seleccione **Nueva versión**.

## Configurar la web

La pantalla abre directamente el formulario. Si todavía no existen opciones,
se muestra un aviso en la parte superior, pero no se abre una ventana modal.

1. Presione el engrane **Opciones**.
2. Pegue la URL o el ID de la carpeta destino.
3. Pegue la URL o el ID de la plantilla de Google Sheets.
4. Presione **Validar y guardar**.

Si se intenta enviar sin configuración, la aplicación abre Opciones en ese
momento.

## Consideraciones

- La plantilla debe ser de Google Sheets, no Excel ni Google Docs.
- Los valores se escriben en una copia; la plantilla original no se modifica.
- Las opciones se almacenan de forma separada por usuario mediante
  `PropertiesService.getUserProperties()`.
- `percentageAsDecimal: true` escribe 25% como `0.25`; las celdas deben tener
  formato de porcentaje en la plantilla.
- Si falla la generación después de crear la estructura, la carpeta incompleta
  se envía a la papelera para que sea recuperable.
- La implementación utiliza `DriveApp`. Para escenarios especiales en unidades
  compartidas puede ser necesario migrar al servicio avanzado de Drive.
