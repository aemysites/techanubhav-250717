/* global WebImporter */
export default function parse(element, { document }) {
  // Get all cards (content tiles)
  const tiles = Array.from(
    element.querySelectorAll('section.cm-content-tile, section.cm.cm-content-tile')
  );
  if (!tiles.length) return;

  // Build rows for the cards19 table
  const rows = [['Cards (cards19)']];

  tiles.forEach((tile) => {
    // Image (mandatory)
    const img = tile.querySelector('.image img');
    // Text content container
    const contentDiv = tile.querySelector('.content');
    const contentCells = [];

    if (contentDiv) {
      // Title (optional)
      const title = contentDiv.querySelector('h3, .header');
      if (title) contentCells.push(title);

      // Description/paragraph(s), excluding empty and subheading
      const paragraphs = Array.from(contentDiv.querySelectorAll('p'));
      paragraphs.forEach((p) => {
        // Exclude empty subheading <p> (commonly used as a spacer)
        if (p.classList.contains('subheading') && !p.textContent.trim()) return;
        if (p.textContent.trim() || p.querySelector('a')) {
          contentCells.push(p);
        }
      });
    }

    rows.push([img, contentCells]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
