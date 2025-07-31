/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as in the example
  const headerRow = ['Cards (cards13)'];
  const rows = [];

  // The cards are .sl-item descendants of .sl-list
  const slList = element.querySelector('.sl-list');
  if (slList) {
    const cards = slList.querySelectorAll(':scope > .sl-item');
    cards.forEach((item) => {
      // section may be direct child or wrapped in .cq-dd-paragraph
      let section = item.querySelector('section.cm-content-tile, section.cm.cm-content-tile, section');
      if (!section) return; // skip if not found
      const innerDiv = section.querySelector('div');
      if (!innerDiv) return;
      // First cell: image or icon (mandatory)
      let imageCell = null;
      const imageDiv = innerDiv.querySelector('.image');
      if (imageDiv) {
        // Prefer the <img> itself
        const img = imageDiv.querySelector('img');
        imageCell = img ? img : imageDiv;
      }
      // Second cell: text content (mandatory)
      let textCell = null;
      const contentDiv = innerDiv.querySelector('.content');
      if (contentDiv) {
        textCell = contentDiv;
      }
      rows.push([imageCell, textCell]);
    });
  }
  const table = WebImporter.DOMUtils.createTable(
    [headerRow, ...rows],
    document
  );
  element.replaceWith(table);
}
