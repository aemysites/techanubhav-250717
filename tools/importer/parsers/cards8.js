/* global WebImporter */
export default function parse(element, { document }) {
  // Build the table rows array
  const rows = [
    ['Cards (cards8)']
  ];

  // Select all the cards
  const items = element.querySelectorAll(':scope .sl-list > .sl-item');
  items.forEach((item) => {
    const link = item.querySelector('a.cm-image-block-link');
    if (!link) return; // skip if no link/card content

    // Image cell: the <img> inside the card
    const img = link.querySelector('.image img');
    // Text cell: the title
    const contentDiv = link.querySelector('.content');
    let textContent;
    if (contentDiv) {
      const h2 = contentDiv.querySelector('h2');
      if (h2) {
        // Use the <h2> element as the card heading (reference it directly)
        textContent = h2;
      }
    }
    if (img && textContent) {
      rows.push([
        img,
        [textContent]
      ]);
    }
  });

  // Create the block table and replace the original element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
