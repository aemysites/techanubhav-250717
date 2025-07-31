/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per block requirements
  const cells = [['Cards (cards14)']];

  // Get all cards: section.cm.cm-content-tile
  const cardSections = Array.from(element.querySelectorAll('section.cm.cm-content-tile'));
  cardSections.forEach((section) => {
    // FIRST CELL: image/icon (mandatory)
    // Use the <img> element directly
    let imgEl = section.querySelector('div.image img');
    
    // SECOND CELL: text content (title, description, CTA)
    const contentDiv = section.querySelector('.content');
    const textCellContent = [];
    if (contentDiv) {
      // Title: h3.header (may contain <b>, preserve as-is)
      const heading = contentDiv.querySelector('h3.header');
      if (heading && heading.textContent.trim().length > 0) {
        textCellContent.push(heading);
      }
      // Description: first <p> after h3.header which is not empty, not just a link, and not .subheading
      let foundDescription = false;
      const ps = Array.from(contentDiv.querySelectorAll('p'));
      for (const p of ps) {
        if (p.classList.contains('subheading') || !p.textContent.trim()) continue;
        if (p.querySelector('a') && p.textContent.trim() === p.querySelector('a').textContent.trim()) continue;
        // p is a description
        textCellContent.push(p);
        foundDescription = true;
        break;
      }
      // CTA: any <a> in .content which is not part of heading or description, typically in its own <p>
      // We'll add the first <a> found in a <p> that is not a subheading and not empty
      const ctaP = ps.find(p => {
        return (
          !p.classList.contains('subheading') &&
          p.querySelector('a') &&
          p.textContent.trim() === p.querySelector('a').textContent.trim()
        );
      });
      if (ctaP) {
        textCellContent.push(ctaP);
      }
    }
    // Add card row to cells array (image, text)
    cells.push([
      imgEl || '',
      textCellContent
    ]);
  });
  // Create the block table and replace original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
