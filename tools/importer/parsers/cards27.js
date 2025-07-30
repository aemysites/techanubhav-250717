/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as shown in the example
  const cells = [['Cards (cards27)']];

  // Each .sl-item holds 1 or more card sections
  const slItems = element.querySelectorAll('.sl-item');
  slItems.forEach(slItem => {
    const cardSections = slItem.querySelectorAll('section.cm-content-tile');
    cardSections.forEach(section => {
      // Image cell
      let imageCell = '';
      const img = section.querySelector('.image img');
      if (img) imageCell = img;

      // Text content cell
      const contentDiv = section.querySelector('.content');
      const textElements = [];
      if (contentDiv) {
        // Title: <h3 class="header"><b>...</b></h3>
        const title = contentDiv.querySelector('.header');
        if (title) textElements.push(title);

        // Remove empty subheading
        const subheading = contentDiv.querySelector('.subheading');
        if (subheading && !subheading.textContent.trim()) subheading.remove();

        // Description: any <p> with non-empty text and without <a>
        const paragraphs = contentDiv.querySelectorAll('p');
        paragraphs.forEach(p => {
          const hasLink = !!p.querySelector('a');
          if (!hasLink && p.textContent.trim()) {
            textElements.push(p);
          }
        });

        // CTA row: collect all <a> (buttons/links) from the last <p> that contains <a>
        const ctaP = Array.from(paragraphs).reverse().find(p => p.querySelector('a'));
        if (ctaP) {
          ctaP.querySelectorAll('a').forEach(a => textElements.push(a));
        }
      }
      cells.push([
        imageCell,
        textElements
      ]);
    });
  });

  // Create and replace with the table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
