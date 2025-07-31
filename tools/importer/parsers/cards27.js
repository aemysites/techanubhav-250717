/* global WebImporter */
export default function parse(element, { document }) {
  // Header for the block, exactly as specified
  const headerRow = ['Cards (cards27)'];
  const cells = [headerRow];

  // Find the card container list
  const slList = element.querySelector('.sl-list');
  if (!slList) return;

  // Each .sl-item is a column, each column contains one or more .cm-content-tile sections (cards)
  const slItems = Array.from(slList.querySelectorAll('.sl-item'));
  slItems.forEach(slItem => {
    // Cards in the column
    const cards = Array.from(slItem.querySelectorAll('section.cm-content-tile'));
    cards.forEach(card => {
      // First cell: image
      // Get the <img> inside .image
      const imgWrapper = card.querySelector('.image img');
      const imgCell = imgWrapper ? imgWrapper : '';

      // Second cell: content
      const contentDiv = card.querySelector('.content');
      let textContent = [];
      if (contentDiv) {
        // Keep all children that aren't empty <p class="subheading">
        textContent = Array.from(contentDiv.children).filter(child => {
          if (child.tagName.toLowerCase() === 'p' && child.classList.contains('subheading') && !child.textContent.trim() && !child.querySelector('a')) {
            return false;
          }
          return true;
        });
      }
      // Each row: [image, text content elements]
      cells.push([imgCell, textContent]);
    });
  });

  // Create table and replace original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
