/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards13)'];
  const cells = [headerRow];

  const list = element.querySelector('.sl-list');
  if (!list) return;
  const items = list.querySelectorAll(':scope > .sl-item');

  items.forEach((item) => {
    let section = item.querySelector('section.cm-content-tile');
    if (!section) section = item;

    // --- Image/Icon cell ---
    let imageCell = '';
    const imageWrapper = section.querySelector('.image');
    if (imageWrapper) {
      const img = imageWrapper.querySelector('img');
      if (img) imageCell = img;
    }

    // --- Content cell ---
    const contentElements = [];
    const contentDiv = section.querySelector('.content');
    if (contentDiv) {
      // Heading (use whichever heading tag is present)
      const heading = contentDiv.querySelector('h1, h2, h3, h4, h5, h6');
      if (heading) {
        contentElements.push(heading);
      }
      // Subheading/description: specifically include .subheading if non-empty
      const subheading = contentDiv.querySelector('p.subheading');
      if (subheading && subheading.textContent.trim()) {
        contentElements.push(subheading);
      }
      // Any other <p> that is not subheading and not a CTA
      const ps = Array.from(contentDiv.querySelectorAll('p'));
      ps.forEach((p) => {
        if (
          p !== subheading &&
          !p.querySelector('a') &&
          p.textContent.trim()
        ) {
          contentElements.push(p);
        }
      });
      // CTA (p with link)
      ps.forEach((p) => {
        if (p.querySelector('a')) {
          contentElements.push(p);
        }
      });
    }
    cells.push([imageCell, contentElements]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
