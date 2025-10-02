# Favicon para ReportFIA Docs

Este directorio contiene los favicons para el sitio de documentación.

## Archivos Disponibles

### 1. `favicon.svg` (ACTUAL)
- Favicon simple con emoji 📊
- Formato: SVG (escalable)
- Uso: Navegadores modernos

### 2. `favicon-alt.svg` (ALTERNATIVO)
- Diseño personalizado con documento y checkmark
- Colores: Azul (#3B82F6) y Verde (#10B981)
- Más profesional y corporativo

## Cambiar el Favicon

Para usar el diseño alternativo, renombra los archivos:

```bash
# Guardar el actual
Move-Item favicon.svg favicon-emoji.svg

# Usar el alternativo
Move-Item favicon-alt.svg favicon.svg
```

O edita directamente `.vitepress/config.mjs` para cambiar la ruta.

## Generar Favicon PNG (Opcional)

Si necesitas un PNG para compatibilidad con navegadores antiguos:

### Opción A: Usar herramientas online
1. Ve a https://favicon.io/ o https://realfavicongenerator.net/
2. Sube el archivo SVG
3. Descarga el PNG generado
4. Guárdalo como `favicon.png` en este directorio

### Opción B: Usar ImageMagick (si lo tienes instalado)
```bash
magick convert -background none -density 1024 favicon.svg -resize 512x512 favicon.png
```

### Opción C: Diseñar tu propio favicon
Herramientas recomendadas:
- **Figma** (gratis): https://figma.com
- **Canva** (gratis): https://canva.com
- **Inkscape** (gratis, open source): https://inkscape.org

## Tamaños Recomendados

Si generas múltiples tamaños:
- `favicon.ico` - 16x16, 32x32, 48x48 (legacy)
- `favicon-16x16.png` - 16x16
- `favicon-32x32.png` - 32x32
- `apple-touch-icon.png` - 180x180 (iOS)
- `android-chrome-192x192.png` - 192x192 (Android)
- `android-chrome-512x512.png` - 512x512 (Android)

## Personalización del Diseño Alternativo

El archivo `favicon-alt.svg` usa:
- **Azul**: #3B82F6 (color primario)
- **Verde**: #10B981 (color de éxito)
- **Blanco**: #FFFFFF (fondo del documento)

Puedes editar estos colores directamente en el archivo SVG para que coincidan con tu branding.

## Emojis Alternativos para favicon.svg

Si prefieres otro emoji, cambia la línea en `favicon.svg`:

```svg
<text y="0.9em" font-size="90">📊</text>
```

Opciones sugeridas:
- 📊 - Gráfico de barras (actual)
- 📝 - Memo/documento
- 🔧 - Herramienta/mantenimiento
- 📄 - Página/documento
- 📋 - Portapapeles/checklist
- 🏢 - Edificio/institución
- 🎓 - Educación/universidad
- ⚙️ - Configuración/sistema

## Verificar el Favicon

Después de agregar o cambiar el favicon:

1. Reinicia el servidor de desarrollo: `npm run docs:dev`
2. Limpia la caché del navegador (Ctrl+Shift+Delete)
3. Recarga la página (Ctrl+F5)
4. Revisa la pestaña del navegador para ver el nuevo favicon

## Favicon en Producción

Asegúrate de que la carpeta `public/` se incluya en el build:
```bash
npm run docs:build
```

Los archivos en `public/` se copiarán automáticamente a la raíz del sitio en producción.
