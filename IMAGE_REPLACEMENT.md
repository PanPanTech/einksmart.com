# Image Replacement Guide

All MVP pages load images through `assets/site-config.js`.

To replace placeholder visuals:

1. Put your production photos or renders in `assets/images/`.
2. Open `assets/site-config.js`.
3. Replace the value for the image key you want to update.

Example:

```js
window.MagiRealmAssets = {
  heroCn: "../assets/images/real-hotel-room-frame.jpg",
  heroEn: "../assets/images/real-product-hero.jpg"
};
```

Current keys:

- `heroCn`, `heroEn`
- `diagramCn`, `diagramEn`
- `technologyCn`, `technologyEn`
- `productFrame`
- `scenarioHotel`
- `scenarioGallery`
- `scenarioEducation`
- `scenarioRetail`
- `partnerVisual`

Recommended sizes:

- Hero images: 2400 x 1400 or larger
- Scenario images: 1600 x 1000
- Diagrams: 1800 x 1000

