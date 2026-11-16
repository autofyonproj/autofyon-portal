# Auto One Egypt

This is a fresh, standalone prototype for managing a sample vehicle store, vehicle slides, and social links on the main page and per-car pages. It is not the source code for the currently deployed autonegypt.com website.

## Prototype behavior

- The dashboard can add, rename, and delete cars in the local prototype.
- Each car has its own slide list: add image/video URLs, toggle visibility, reorder, and remove slides.
- Homepage and per-car previews show only enabled social links with a non-empty URL; links can be configured independently.
- Common social platforms are provided and an editor can add other platform names.
- State is stored in this browser's `localStorage` only. It is not shared with other users or devices and is not connected to autonegypt.com.
- This prototype has no authentication, server, database, cloud persistence, or file/image upload. Images and videos must be reachable by public URLs.

Do not use it to manage real production content or enter confidential data. Connect it to the real website's authenticated backend before production use.

## Run locally

Open `index.html` in a modern browser. No packages or build step are needed. To reset this prototype's sample data, clear this site's local storage in browser developer tools.
