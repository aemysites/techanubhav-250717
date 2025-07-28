/* global WebImporter */
export default function parse(element, { document }) {
  // Build table header
  const cells = [
    ['Cards (cards33)']
  ];

  // Get all direct <a> (card) children
  const cards = element.querySelectorAll(':scope > a');

  cards.forEach((card) => {
    // Card image (mandatory)
    const img = card.querySelector('img');
    
    // Card text content (mandatory)
    // Inside the <a>, it's the .w-layout-grid > div that does NOT contain <img>
    let contentDiv = null;
    const innerGrid = card.querySelector('.w-layout-grid');
    if (innerGrid) {
      const divs = innerGrid.querySelectorAll(':scope > div');
      for (const div of divs) {
        if (!div.querySelector('img')) {
          contentDiv = div;
          break;
        }
      }
    }

    // Remove the "Read" div at the end, since it's not a link (CTA is text only here)
    if (contentDiv && contentDiv.lastElementChild && contentDiv.lastElementChild.textContent.trim().toLowerCase() === 'read') {
      contentDiv.lastElementChild.remove();
    }

    // Ensure both image and contentDiv exist
    if (img && contentDiv) {
      cells.push([
        img,
        contentDiv
      ]);
    }
  });

  // Create and replace with the cards block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
