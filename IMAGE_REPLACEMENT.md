# einksmart Image Replacement Guide

The site loads visual assets through `assets/site-config.js`.

Replace values in `window.EinksmartAssets` to update images without editing each HTML page.

## Current Rule

Current visuals should be treated as **E-Ink optimized previews** unless you replace them with verified product photography.

Do not label a visual as "real product photo" or "实拍" until the image is confirmed production or prototype photography.

## Recommended Sizes

- `hero*`: 2400 x 1400 or larger
- `scenario*`: 1600 x 1000
- `diagram*` / `technology*`: 1800 x 1000
- `productFrame`: 1600 x 1200

## Asset Keys

- `heroCn`, `heroEn`
- `diagramCn`, `diagramEn`
- `technologyCn`, `technologyEn`
- `productFrame`
- `scenarioHotel`
- `scenarioGallery`
- `scenarioEducation`
- `scenarioRetail`
- `partnerVisual`
- `materialDetail`
- `frameEdge`

Keep the keys stable so the static pages continue to resolve images.
