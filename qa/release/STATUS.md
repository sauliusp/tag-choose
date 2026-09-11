# TagChoose 2.0 release status

Updated September 11, 2026. Do not treat local validation or a pending review as publication.

## Code and tests
- Branch: codex/tagchoose-v2-reliability. PR to main: https://github.com/sauliusp/tag-choose/pull/5.
- 29 automated tests pass, including first-visit availability without downloads, download/preparing/ready distinction, silence/progress recovery, cancellation with hung native promises, late progress, inference timeout, unavailable vs unknown state, duplicate names, bookmark copy preservation, partial saves, stale title/folder/save races and count accuracy.
- TypeScript and ESLint pass. Build and root-level Chrome ZIP integrity pass. Manifest and package are 2.0.0. Requested permissions remain bookmarks and tabs.
- First Codex review raised five P2 findings. All were fixed and a new review was requested at commit 8fc1fef.

## Real Chrome evidence
- Installed unpacked 2.0.0 in a newly created, signed-out TagChoose QA profile.
- Setup reported the existing on-device model available. This machine shares the model with a new profile, so a fresh profile does NOT prove a model-free first download.
- Actual Chrome model inference succeeded on the Chrome Prompt API documentation page. With no custom folders, it suggested Bookmarks bar. After adding Web development, the next request suggested that specific folder.
- Saved into Bookmarks bar and Other bookmarks, saw completion for two folders, and verified one copy in each through Chrome's own bookmark manager.
- Reopened popup and confirmed both existing destinations restored before inference completed.
- Existing model initialization emits 0-percent progress too; fixed the UI to show preparing when availability had already been ready.
- Latest post-review build still needs a final installed-browser pass. The no-model lifecycle is covered with controlled API tests, not a claimed real first-download run.

## Website and media
- Sites public publication succeeded: https://tagchoose.sauliusdev.chatgpt.site.
- Useful guides, setup help, privacy explanation, canonical metadata, sitemap, robots, SoftwareApplication schema and a captioned 30-second video.
- The website credits only Saulius. Automatic folder suggestions use Chrome local AI only; manual saving remains available. No automatic rules fallback.
- YouTube publication confirmed: https://www.youtube.com/watch?v=Rc8u494w-Dc. English captions and custom thumbnail saved. Copyright and Community Guidelines initial checks found no issues.
- Video file is exactly 30.000 seconds according to ffprobe and decodes without errors. YouTube displays a rounded 0:31 duration.
- Latest website changes add the YouTube link, VideoObject schema and consistent trailing-slash routing; deployment pending.

## Domain and Search Console
- Signed-in Namecheap domain and expired-domain lists do not include tagchoose.site. Domain is available for a new registration.
- User authorized one year for $1.98, with automatic renewal and paid add-ons disabled. Checkout total: $1.78 registration + $0.20 ICANN. Renewal advertised $31.98/year before fees/tax.
- Namecheap declined the saved payment method. Asked user to complete payment in the existing checkout. No successful registration claimed.
- Sites hostname added in pending state; DNS requirements and Google Search Console domain verification record are in DNS-RECORDS.md. DNS and Search Console verification are not completed.

## Store
- Initial public version: 1.1.0, updated August 19, 2025; six ratings, 3.7 average.
- Reviews: man osm (December 31, 2025) reported broken automatic suggestions; Eric Hanchrow (July 17, 2025) reported indefinite download waiting. Existing July 18 reply remains.
- Version 2.0.0 has not yet been submitted. No new review replies posted. Reply only after actual public 2.0.0 publication.
