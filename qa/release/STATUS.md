# TagChoose 2.0 release status

Updated September 11, 2026. Do not treat local validation or a pending review as publication.

## Code and tests
- Branch: codex/tagchoose-v2-reliability. PR to main: https://github.com/sauliusp/tag-choose/pull/5.
- 35 automated tests pass, including first-visit availability without downloads, download/preparing/ready distinction, silence/progress recovery, cancellation with hung native promises, late progress, inference timeout, unavailable vs unknown state, duplicate names, bookmark copy preservation, partial saves, stale title/folder/save races and count accuracy.
- TypeScript and ESLint pass. Build and root-level Chrome ZIP integrity pass. Manifest and package are 2.0.0. Requested permissions remain bookmarks and tabs.
- The first five Codex reviews raised eleven findings in total. Fixes cover title invalidation, late progress, duplicate names, addable suggestions, saved-state feedback, stale automatic selections, replacement of automatic choices on retry and navigation during saves. All are addressed in the working branch; a new review is required before merging. The required order remains clean review, merge to main, fresh package from main, then Store submission.

## Real Chrome evidence
- Installed unpacked 2.0.0 in a newly created, signed-out TagChoose QA profile.
- Setup reported the existing on-device model available. This machine shares the model with a new profile, so a fresh profile does NOT prove a model-free first download.
- Actual Chrome model inference succeeded on the Chrome Prompt API documentation page. With no custom folders, it suggested Bookmarks bar. After adding Web development, the next request suggested that specific folder.
- Saved into Bookmarks bar and Other bookmarks, saw completion for two folders, and verified one copy in each through Chrome's own bookmark manager.
- Reopened popup and confirmed both existing destinations restored before inference completed.
- Existing model initialization emits 0-percent progress too; fixed the UI to show preparing when availability had already been ready.
- Reloaded the latest post-review build in Chrome. Confirmed preparing rather than downloading for an existing model, restored saved folders and actual inference selecting Web development. The no-model lifecycle is covered with controlled API tests, not a claimed real first-download run.

- September 11 follow-up: latest unpacked build completed actual inference and added Web development. Editing the title removed that automatic destination, kept the two saved destinations, and replaced the stale ready banner with an instruction to request updated suggestions. Closed without saving the test title.

## Website and media
- Sites public publication succeeded on the provider host; official public address: https://tagchoose.site (DNS connection pending).
- Useful guides, setup help, privacy explanation, canonical metadata, sitemap, robots, SoftwareApplication schema and a captioned 30-second video.
- The website credits only Saulius. Automatic folder suggestions use Chrome local AI only; manual saving remains available. No automatic rules fallback.
- YouTube publication confirmed: https://www.youtube.com/watch?v=Rc8u494w-Dc. English captions and custom thumbnail saved. Copyright and Community Guidelines initial checks found no issues.
- Video file is exactly 30.000 seconds according to ffprobe and decodes without errors. YouTube displays a rounded 0:31 duration.
- Published website version 2 with the YouTube link, VideoObject schema, consistent trailing-slash routing and updated dependencies. Both dependency audits report zero vulnerabilities. All 12 deployed routes pass HTTP, metadata, canonical, internal-link, sitemap, robots and 404 checks. No public page includes a hosting-provider address or full creator name. YouTube description saved with https://tagchoose.site/.

## Domain and Search Console
- Signed-in Namecheap domain and expired-domain lists do not include tagchoose.site. Domain is available for a new registration.
- User authorized one year for $1.98, with automatic renewal and paid add-ons disabled. Checkout total: $1.78 registration + $0.20 ICANN. Renewal advertised $31.98/year before fees/tax.
- Namecheap declined the saved payment method. Asked user to complete payment in the existing checkout. No successful registration claimed.
- Sites hostname added in pending state; DNS requirements and Google Search Console domain verification record are in DNS-RECORDS.md. DNS and Search Console verification are not completed.

## Store
- Initial public version: 1.1.0, updated August 19, 2025; six ratings, 3.7 average.
- Reviews: man osm (December 31, 2025) reported broken automatic suggestions; Eric Hanchrow (July 17, 2025) reported indefinite download waiting. Existing July 18 reply remains.
- Google reauthentication completed. The 2.0.0 ZIP was accepted into a draft and the revised listing, video, official homepage/support/privacy URLs and reviewer instructions were saved. It has NOT been submitted for Chrome review. The Store reports unreachable homepage/support URLs while domain registration and DNS are pending. Per the user, finish the Codex review loop first, rebuild and verify the final package, then replace the staged ZIP before submission. No new review replies posted. Reply only after actual public 2.0.0 publication.
