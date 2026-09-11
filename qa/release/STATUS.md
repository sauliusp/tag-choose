# TagChoose 2.0 release work

## Scope
Repair bookmark saving and local AI. Test core and real Chrome paths, create PR to main, request Codex review and fix findings. Create a public Sites website optimized for useful search/answer content, connect the existing Namecheap domain, produce a 30-second narrated screenshot video using the established voice, publish it on YouTube, update Store copy/assets, and submit 2.0.0. After verified public publication, reply to the two one-star reviews.

## Initial evidence, 2026-09-11
- Public Store: 1.1.0, updated August 19 2025; six ratings, 3.7 average.
- man osm, Dec 31 2025: keyword suggestions stopped working, no performance update since August.
- Eric Hanchrow, July 17 2025: indefinite download message without progress or observable transfer. Existing developer reply from July 18 2025.
- Existing site/domain: https://tagchoose.site.
- Existing code removes copies outside selected folders, keys folders by title, resets selections on asynchronous folder load, does not guard missing LanguageModel, leaks the downloaded session, disables manual selection during inference, swallows save failures, allows concurrent saves, and ships with no tests and a misspelled tsconfig filename.

## Status
Implementation in progress. No PR, deployment, Store submission, publication, or new review reply yet.
