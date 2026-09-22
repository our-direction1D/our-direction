# OUR DIRECTION — V9 prototype

A colourful, scrapbook-style One Direction fan community prototype.

## What is included

- Home / Fan Wall / Fun / Quizzes / Facts / Updates / Community / Rules
- Fun Page with Random, This or That, Guess It, Daily Poll and Challenges
- Admin-editable Fun Page content, including new Guess It entries
- Admin-editable Daily Poll; changing it starts a fresh vote count
- User-created quizzes publish immediately
- Quiz builder supports multiple questions and up to 12 multiple-choice options per question in this prototype
- Admin quiz editor supports adding/removing questions and options
- Fan Wall supports text, pictures and videos
- Media credits are required only when media is attached; text-only posts do not need credits
- Uploaded media keeps its natural proportions instead of being forced into square crops
- Long messages can take more space on the wall
- Fan Wall likes; the post owner and public visitors see only the like count, never a list of who liked it
- Community page shows the user's own posts, like counts, quiz stats and accurately tracked game/quiz activity
- Game counts are incremented only when a game is actually completed, not when pages render
- Admin controls for moderation, editing, deletion, user suspension and site content
- Site + Fun editor for homepage/page copy, footer text, jokes, random results, challenges, This or That and Guess It
- Copyright / credits rules and an unofficial-fan-project disclaimer
- `OneDirection.ttf` included and wired into the site

## Prototype admin

Email: `admin@ourdirection.test`
Password: `admin123`

These credentials are for the local prototype only. Do not use them for a real public site.

## Test it

1. Unzip the folder.
2. Keep `index.html`, `style.css`, `script.js`, `OneDirection.ttf` and the `assets` folder together.
3. Open `index.html` in a browser.
4. Sign up with a test account.
5. Fan Wall: submit text only and confirm no credit is requested.
6. Fan Wall: submit a picture or video and confirm the credit + rights confirmation appears.
7. Like an approved post and confirm only the number is shown.
8. Fun Page: play Random, This or That and Guess It. Confirm the game counter changes only after actual play/completion.
9. Quizzes: create 2+ questions and add more than 4 options to one question. Take the quiz and check the score.
10. Community: confirm your own game/quiz stats and wall posts appear without overlapping.
11. Admin: log in with the prototype credentials, open Control Room, edit a quiz, add/remove questions/options, edit the Daily Poll, and edit Fun Page content.
12. Add a new Guess It entry from Site + Fun Editor in the format:
   `ANSWER | CLUE 1 | CLUE 2 | CLUE 3`

## Important limitation

This is still a browser-storage prototype. Data is stored in each visitor's `localStorage`, so it is NOT yet a real shared community database. A real public launch should use a secure backend/database, real authentication, cloud media storage, server-side admin permissions, moderation, rate limiting and backups.

The browser prototype is also not suitable for storing large video files long-term. The final public version should upload media to proper cloud storage and keep only secure media references in the database.

## Copyright note

The Peakpx image on the homepage is credited to the source supplied for the project. A credit line alone does not grant permission to reuse copyrighted material. Before a public launch, verify the image's actual licence/permission and replace it if necessary. User-uploaded media should likewise be shared only when the uploader has the necessary rights, permission or licence.

## Changing the site later

The final architecture should keep site code/design separate from community data. That means changing the layout, wording, Fun Page, polls or other features should not require deleting users or existing posts. In this prototype, content changes are stored in browser storage; in the final public version they should live in a database/content system so deployments can update the code without destroying community data.
