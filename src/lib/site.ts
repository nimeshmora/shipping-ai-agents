// Settings that point at outside services. Change them here, not in the pages.

// The GitHub repository, used for the "Edit this page" and "Suggest an example" links.
export const REPO = 'https://github.com/nimeshmora/shipping-ai-agents';
// Example code for the notebooks is in examples/, with one folder for each notebook.
export const EXAMPLES = `${REPO}/tree/main/examples`;

// Your GoatCounter code (the part before .goatcounter.com). Set it to '' to turn visitor counting off.
// Counting only runs on the live site, never on `npm run dev`.
export const GOATCOUNTER = 'shipping-ai-agents';

// Your Buttondown username, for the "Get the next notebook by email" box. Set it to '' to hide the box.
// The box is on the front page, under the notebooks.
export const BUTTONDOWN = 'nimesha';

// KodeBox (kodekloud.com/kodebox): servers you can keep running, with a GPU if you want one.
// The link is used on the front page, in the pop-up and on the Engine Room page (src/pages/engine-room.astro).
export const KODEBOX = 'https://tidd.ly/3VbFm5x';
// The KodeBox pop-up on the front page stops showing after this date. Set it to '' to turn the pop-up off.
export const KODEBOX_POPUP_UNTIL = '2026-12-23';

// How many notebooks the front page shows. The rest are on the Illustrated Notebooks page (/notebooks/),
// which the front page links to with "View all notebooks".
export const FRONT_PAGE_NOTEBOOKS = 4;
