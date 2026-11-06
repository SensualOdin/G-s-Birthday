# Birthday invitation design

## Direction

A playful superhero comic invitation pairing Spider-Man and Optimus Prime, as requested by George. Warm paper, navy ink, red and blue accents, large condensed comic lettering, and two character panels. The page should feel like a personal birthday invitation, with practical details and RSVP immediately findable.

## Implementation

- Bangers for headings and wordmark; Nunito Sans for readable information and forms.
- Colors are defined in styles.css: paper #fff9ef, paper-deep #f3eadc, ink #15264b, muted #526078, red #bd233b, blue #174ac1, yellow #ffda62.
- Character imagery is sourced in assets/SOURCES.md; two static WebP images avoid large animated media.
- Desktop: text and character art share the hero; event details and RSVP form share the next section. Gift links are compact and follow RSVP.
- Mobile: one column, first-screen event summary and RSVP link, character panel, event details, form, then gifts. Minimum usable width320px.
- No perpetual animation. A one-second confetti burst can follow accepted Yes responses; reduced-motion and hidden-tab states suppress/cancel it. Native form semantics and visible focus are required.

## Boundaries

Do not add unconfirmed activities, food, waiver rules, prices, deadlines, or venue promises. Preserve the confirmed date, time, address, theme, existing contact, and endpoint. Do not publish the draft without authorization.
