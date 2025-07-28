/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: matches example exactly
  const headerRow = ['Hero (hero12)'];

  // Row 2: Background image (optional)
  // Look for an img with class 'cover-image utility-position-absolute' as the background
  let bgImg = null;
  const relDivs = element.querySelectorAll('.utility-position-relative');
  for (const div of relDivs) {
    const img = div.querySelector('img.cover-image.utility-position-absolute');
    if (img) {
      bgImg = img;
      break;
    }
  }

  // Row 3: Main content
  // Find the card which contains the visible text content (headings, bullets, CTA)
  let contentCell = null;
  const card = element.querySelector('.card.card-on-secondary');
  if (card) {
    // The card-body contains the grid-layout
    const cardBody = card.querySelector('.card-body');
    if (cardBody) {
      const grid = cardBody.querySelector('.grid-layout');
      if (grid) {
        // The grid usually contains an image and a text column; take the column with the h2 for main content
        const gridChildren = Array.from(grid.children);
        const mainTextCol = gridChildren.find(child => child.querySelector('h2'));
        if (mainTextCol) {
          contentCell = mainTextCol;
        } else {
          // fallback if unexpected structure: use grid
          contentCell = grid;
        }
      } else {
        // fallback: use cardBody
        contentCell = cardBody;
      }
    } else {
      // fallback: use card
      contentCell = card;
    }
  } else {
    // fallback: use element
    contentCell = element;
  }

  // Compose the table rows: header, background image, content
  const rows = [
    headerRow,
    [bgImg || ''],
    [contentCell]
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
