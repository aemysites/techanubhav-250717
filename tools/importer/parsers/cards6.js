/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards6)'];
  const rows = [headerRow];

  // Get all .cm-content-tile cards in order
  const cards = element.querySelectorAll('.cm.cm-content-tile');
  cards.forEach(card => {
    // First cell: Image (if present)
    let imgCell = '';
    const img = card.querySelector('.image img');
    if (img) imgCell = img;

    // Second cell: Text content
    const contentDiv = card.querySelector('.content');
    const cellContent = document.createElement('div');
    // Title (h3.header)
    const title = contentDiv && contentDiv.querySelector('.header');
    if (title) {
      // Directly reference the title node (not cloning, preserving original element)
      cellContent.appendChild(title);
    }
    // Description paragraphs (ignore p.subheading)
    let ctaLink = null;
    if (contentDiv) {
      const paras = Array.from(contentDiv.querySelectorAll('p')).filter(p => !p.classList.contains('subheading'));
      paras.forEach(p => {
        if (p.querySelector('a')) {
          // If paragraph is only a CTA, extract the link to append after all descriptions
          // but only if it's not empty text
          if (p.textContent.trim() && p.querySelector('a')) {
            ctaLink = p.querySelector('a');
          }
        } else if (p.textContent.trim()) {
          // Only include non-empty paragraphs
          cellContent.appendChild(p);
        }
      });
    }
    if (ctaLink) {
      cellContent.appendChild(ctaLink);
    }
    rows.push([imgCell, cellContent]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
