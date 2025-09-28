# Valódi Fényképek Útmutató

A themed sections sokkal hatásosabbak lennének valódi fényképekkel. Itt van az útmutató a képek cseréjéhez:

## Szükséges fényképek:

### 1. Professional Photography (`images/photographer-real.jpg`)
- **Jelenet**: Profi fotós felszerelés (kamerák, lencsék, tripod, táska)
- **Stílus**: Sötét háttér, drámai megvilágítás
- **Elemek**: Canon/Nikon kamera, különböző lencsék, memóriakártyák, akkumulátorok
- **RFID tagek**: Kis fehér RFID címkék láthatóan az eszközökön

### 2. Contractors & Technicians (`images/contractor-real.jpg`)
- **Jelenet**: Munkás környezet, szerszámok, építkezés
- **Stílus**: Ipari környezet, természetes világítás
- **Elemek**: Fúró, kalapács, csavarok, mérőszalag, védőfelszerelés
- **RFID tagek**: Eszközökre ragasztott címkék

### 3. Business Travel (`images/traveler-real.jpg`)
- **Jelenet**: Üzleti utazó felszerelés, repülőtér/szálloda
- **Stílus**: Elegáns, modern környezet
- **Elemek**: Laptop, útlevél, töltők, bőrönd, üzleti ruházat
- **RFID tagek**: Elektronikai eszközökön és táskákon

### 4. Students & Academics (`images/student-real.jpg`)
- **Jelenet**: Egyetemi környezet, tanulási eszközök
- **Stílus**: Természetes fény, könyvtár/labor hangulat
- **Elemek**: Laptop, könyvek, jegyzetfüzetek, tudományos eszközök
- **RFID tagek**: Értékes eszközökön

### 5. Outdoor & Sports (`images/outdoor-real.jpg`)
- **Jelenet**: Outdoor felszerelés, természeti környezet
- **Stílus**: Természetes környezet, adventure hangulat
- **Elemek**: Hátizsák, mászófelszerelés, túrafelszerelés, biztonsági eszközök
- **RFID tagek**: Túlélési és biztonsági eszközökön

### 6. Healthcare Professionals (`images/medical-real.jpg`)
- **Jelenet**: Kórházi/orvosi környezet, steril eszközök
- **Stílus**: Tiszta, fehér/kék színek, professzionális
- **Elemek**: Sztetoszkóp, vérnyomásmérő, orvosi eszközök, gyógyszerek
- **RFID tagek**: Kritikus orvosi eszközökön

## Képforrások:

### Ingyenes opcióók:
- **Unsplash** (unsplash.com) - Magas minőségű stock fotók
- **Pexels** (pexels.com) - Ingyenes stock fotók
- **Pixabay** (pixabay.com) - Képek commercial használatra

### Fizetős opcióók:
- **Shutterstock** - Premium stock fotók
- **Getty Images** - Professzionális fotók
- **Adobe Stock** - Nagy választék

### Saját fotók:
- **Helyi fotós** bérlése a specific jelenetekhez
- **Smartphone fotók** jó megvilágítással és kompozícióval

## Képspecifikációk:

- **Felbontás**: Min. 1920x1080px (Full HD)
- **Formátum**: JPG (optimalizált webhez)
- **Fájlméret**: Max. 500KB (weboptimalizált)
- **Orientáció**: Landscape (fekvő)
- **Minőség**: Éles, jó megvilágítás, professzionális kompozíció

## Implementáció:

1. **Töltse le a képeket** a fenti specifikációkkal
2. **Optimalizálja webhez** (compressjpeg.com vagy tinypng.com)
3. **Mentse el a images/ mappába** a megfelelő nevekkel
4. **Frissítse a HTML-t** - automatikusan működni fog

## HTML automatikus frissítés:

A kód már fel van készítve a valódi képekre:

```html
<!-- Automatikusan vált SVG-ről JPG-re, ha létezik -->
<img src="images/photographer-hero.svg" alt="..." class="hero-background">
```

Ha létező a `images/photographer-real.jpg`, használhatjuk:

```html
<img src="images/photographer-real.jpg" alt="..." class="hero-background">
```

## CSS optimalizáció valódi képekhez:

```css
.hero-background {
    object-fit: cover;
    object-position: center;
    filter: brightness(0.7) contrast(1.1);
}
```

Szükség esetén frissíthetem a kódot, hogy automatikusan váltson valódi képekre, ha elérhetőek!