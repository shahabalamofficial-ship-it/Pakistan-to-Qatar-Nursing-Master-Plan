# Pakistan to Qatar Nursing Master Plan

❤️ حسن گل بھائی کی طرف سے اپنی بہن کے لیے

A free, offline-friendly progress tracker for the licensing and relocation journey a nurse takes from Pakistan to Qatar — DataFlow verification, DHP/QCHP registration, the Prometric exam, evaluation, sponsorship, visa, and arrival, laid out as one stamped "boarding pass" journey.

> **مختصر تعارف (اردو):** یہ ایک سادہ ویب ایپ ہے جو پاکستان سے قطر جانے والی نرسز کے لیے لائسنسنگ اور نقل مکانی کے پورے سفر کو نو مراحل میں دکھاتی ہے۔ ہر مرحلے میں چیک لسٹ ہے جسے آپ نشان زد کر سکتے ہیں، اور آپ کی پیش رفت خود بخود آپ کے فون یا کمپیوٹر میں محفوظ ہو جاتی ہے — کسی اکاؤنٹ یا انٹرنیٹ کی ضرورت نہیں۔

## What it does

- Walks through 9 real stages of the Qatar DHP (formerly QCHP) nursing licensing process, based on the 2026 requirements (DataFlow PSV, Prometric, evaluation, sponsorship, visa, arrival).
- Lets you check off checklist items per stage; a stage is "stamped" done once every item on it is checked.
- Saves your progress automatically in the browser (`localStorage`) — no login, no server, no data leaves the device.
- Works offline once loaded once, thanks to a small service worker (PWA).
- Lets you export your progress to a `.json` file (as a backup, or to move to another device) and import it back.
- Has a print-friendly view for a paper/PDF copy.

**Disclaimer:** this is a personal planning aid, not official legal or immigration advice. Rules change — always confirm the current requirements on the official DHP website (dhp.moph.gov.qa) and with your recruitment agency before making decisions.

## Folder structure

```
Pakistan-to-Qatar-Nursing-Master-Plan/
│── index.html          → the app shell (structure)
│── style.css            → design system (colors, type, layout, print)
│── script.js            → renders the roadmap, tracks progress, export/import
│── manifest.json        → PWA metadata (name, icon, colors)
│── sw.js                 → service worker (offline caching)
│── README.md
│── assets/
│     ├── images/         → reserved for future photos/illustrations
│     ├── icons/
│     │     └── icon.svg  → app icon (passport-stamp mark)
│     └── fonts/          → reserved if you ever want to self-host fonts
│── data/
│     └── roadmap.json    → the actual 9-stage content — edit this to update steps
```

## Running it locally

Because the app loads `data/roadmap.json` with `fetch()`, opening `index.html` directly by double-clicking it won't work in most browsers (they block local file requests). Serve it with any tiny local server, for example:

```bash
# Python (already on most machines)
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploying to GitHub Pages

1. Create a new GitHub repository named `Pakistan-to-Qatar-Nursing-Master-Plan` (or any name you like).
2. Push this folder's contents to the repository's `main` branch:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Pakistan to Qatar Nursing Master Plan"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```
3. On GitHub, open the repository → **Settings → Pages**.
4. Under **Build and deployment**, set **Source** to `Deploy from a branch`, branch `main`, folder `/ (root)` → **Save**.
5. GitHub will give you a live URL, typically:
   `https://<your-username>.github.io/<your-repo>/`
6. Open it — the app should load, and revisiting it later (even offline) will work once it's been loaded once.

## Updating the roadmap content

All step content lives in `data/roadmap.json` — nothing else needs to change. Each stage looks like this:

```json
{
  "id": 4,
  "title": "Prometric Exam (or Exemption)",
  "titleUr": "پرومیٹرک امتحان یا استثنیٰ",
  "duration": "4-6 weeks",
  "description": "…",
  "checklist": ["…", "…"]
}
```

Add, remove, or reorder items in `checklist` freely — the app recalculates progress automatically. If you add or remove a whole stage, give it a unique `id`.

## Ideas for future features

- A notes field per stage for personal reminders (appointment dates, contact names).
- Push/local notifications for upcoming deadlines (e.g. Prometric result validity).
- A shareable read-only link for a family member to follow progress.
- Multi-profile support if more than one family member is on the same journey.
- A dark mode toggle.

## Credits

Built for a family, one stamp at a time. 🛂
