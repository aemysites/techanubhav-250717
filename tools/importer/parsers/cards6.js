/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: create header row as per requirements
  const headerRow = ['Cards (cards6)'];
  const cells = [headerRow];

  // All cards are <section class="cm cm-content-tile">
  const cardSections = element.querySelectorAll('section.cm.cm-content-tile');

  cardSections.forEach((section) => {
    // --- COLUMN 1: Image/Icon ---
    let img = section.querySelector('.image img');
    let imgCell = img ? img : '';

    // --- COLUMN 2: Text content (heading, description, CTA) ---
    const content = section.querySelector('.content');
    let textParts = [];
    if (content) {
      // Use existing heading (h3.header, typically has <b> inside)
      let heading = content.querySelector('h3.header');
      if (heading && heading.textContent.trim() !== '') {
        textParts.push(heading);
      }
      // Get all <p> that are NOT .subheading and not empty
      const ps = Array.from(content.querySelectorAll('p')).filter(
        p => !p.classList.contains('subheading') && p.textContent.trim() !== ''
      );
      ps.forEach(p => textParts.push(p));
    }
    // Fallback: cell must NOT be empty
    let textCell = textParts.length ? textParts : '';
    cells.push([imgCell, textCell]);
  });

  // Create table and replace original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
