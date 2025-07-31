/* global WebImporter */
export default function parse(element, { document }) {
  // Find the second column (contains the card grid)
  const columns = element.querySelectorAll(':scope > div');
  if (!columns || columns.length < 2) return;
  const cardsContainer = columns[1];
  if (!cardsContainer) return;

  // Cards are within .cm-content-tile (inside .cq-dd-paragraph inside .sl-item)
  const cardSections = cardsContainer.querySelectorAll('section.cm-content-tile');
  if (!cardSections.length) return;

  const cards = [];
  cardSections.forEach(section => {
    // Image: First <img> in .image
    let img = section.querySelector('.image img');
    // Title: <h3> in .content
    const contentDiv = section.querySelector('.content');
    const title = contentDiv ? contentDiv.querySelector('h3') : null;
    // Description: all <p> that are not empty and not CTA
    let descs = [];
    let cta = null;
    if (contentDiv) {
      const ps = Array.from(contentDiv.querySelectorAll('p'));
      ps.forEach(p => {
        const a = p.querySelector('a');
        // Find the CTA (<a> containing .cta) which is always the last item if it exists
        if (a && a.querySelector('.cta')) {
          cta = a;
        } else if (p.textContent.trim()) {
          descs.push(p);
        }
      });
    }
    // Compose text cell content
    const frag = document.createDocumentFragment();
    if (title) frag.appendChild(title);
    descs.forEach(p => frag.appendChild(p));
    if (cta) frag.appendChild(cta);
    // Add card row
    cards.push([
      img ? img : '',
      frag
    ]);
  });

  const cells = [
    ['Cards (cards19)'],
    ...cards
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
