# G's fifth-birthday invitation

Static HTML/CSS/JavaScript invitation for January 16, 2027, 10 AM–12 PM Central Time at Takeoff Adventure Park in Plano. Theme: Spider-Man and Optimus Prime.

## Preview

From this directory:

```sh
python3 -m http.server 8427 --bind 127.0.0.1
```

Open http://127.0.0.1:8427. No build step or package installation is needed.

## Verify

```sh
node --test
node --check script.js
git diff --check
```

The lifecycle tests cover the venue's explicit UTC offset and the event's start/end boundaries. Browser verification should also cover attendance changes, native validation, request failures/retries, duplicate sends, success focus, and reduced motion. Mock `window.fetch` when checking submission flows to avoid creating test RSVPs in the existing Formspree account.

## Event information

Visible copy lives in `index.html`. Its body `data-party-start` and `data-party-end` attributes are the countdown and closure source of truth; retain an explicit UTC offset when changing them. For this January event, Plano is UTC−06:00. RSVP closes at the event's end.

`PRODUCT.md` records confirmed facts and `DESIGN.md` records the current design. Artwork sources are in `assets/SOURCES.md`. Existing host contact, Formspree endpoint, and gift registry links are retained. GitHub Pages publishes the `main` branch at https://g5birthday.com.
