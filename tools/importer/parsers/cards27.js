/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as required by spec
  const headerRow = ['Cards (cards27)'];

  // Find the card sections.
  const cards = [];
  // Defensive: find .sl-list, then all section.cm-content-tile inside
  const slList = element.querySelector('.sl-list');
  if (slList) {
    const cardSections = slList.querySelectorAll('section.cm-content-tile');
    cardSections.forEach((section) => {
      // First cell: the card image (if present)
      let img = null;
      const imageDiv = section.querySelector('.image');
      if (imageDiv) {
        img = imageDiv.querySelector('img');
      }
      // Second cell: the card content: heading, description, CTA
      const contentDiv = section.querySelector('.content');
      const contentElements = [];
      if (contentDiv) {
        // Heading
        const heading = contentDiv.querySelector('h3');
        if (heading) contentElements.push(heading);
        // Subheading (is empty, skip)
        // Description: p (non-empty, not .subheading, not containing only links)
        const contentPs = Array.from(contentDiv.querySelectorAll('p'));
        contentPs.forEach((p) => {
          if (p.classList.contains('subheading')) return; // skip subheading (empty)
          if (p.textContent.trim() || p.querySelector('a')) {
            contentElements.push(p);
          }
        });
      }
      cards.push([img, contentElements]);
    });
  }
  // Compose final table
  const tableData = [headerRow, ...cards];
  const block = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(block);
}
