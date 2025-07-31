/* global WebImporter */
export default function parse(element, { document }) {
  // Find all card sections (each card is a section.cm-content-tile)
  const sections = element.querySelectorAll('section.cm-content-tile');

  // Table header as in the example
  const rows = [
    ['Cards (cards6)']
  ];

  sections.forEach((section) => {
    // --- IMAGE CELL ---
    let imgEl = null;
    const img = section.querySelector('.image img');
    if (img) {
      imgEl = img;
    }

    // --- TEXT CELL ---
    const contentDiv = section.querySelector('.content');
    const cellContent = [];
    if (contentDiv) {
      // Title (h3.header)
      const title = contentDiv.querySelector('h3.header');
      if (title) cellContent.push(title);

      // Description & CTA
      const paragraphs = Array.from(contentDiv.querySelectorAll('p'));
      paragraphs.forEach((p) => {
        // ignore .subheading if empty
        if (p.classList.contains('subheading') && !p.textContent.trim()) return;
        // CTA: paragraph with link(s)
        const links = p.querySelectorAll('a');
        if (links.length > 0) {
          links.forEach(link => cellContent.push(link));
        } else if (p.textContent.trim()) {
          cellContent.push(p);
        }
      });
    }

    rows.push([
      imgEl,
      cellContent
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
