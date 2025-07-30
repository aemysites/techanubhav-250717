/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in the example
  const headerRow = ['Accordion (accordion10)'];
  const rows = [];
  // Find the <ul class="accordion-list">
  const ul = element.querySelector('ul.accordion-list');
  if (!ul) return;
  // Each <li> is an accordion item
  const accordionItems = ul.querySelectorAll(':scope > li');
  accordionItems.forEach((li) => {
    // Title is the <a> inside <li>
    const titleAnchor = li.querySelector(':scope > a.accordion-item');
    let titleCell;
    if (titleAnchor) {
      // Remove trailing chevron or icon if present
      const chevron = titleAnchor.querySelector('.ec');
      if (chevron) chevron.remove();
      // Remove aria attributes and class for block clarity
      titleAnchor.removeAttribute('aria-controls');
      titleAnchor.removeAttribute('aria-expanded');
      titleAnchor.removeAttribute('class');
      titleCell = titleAnchor;
    } else {
      titleCell = '';
    }
    // The content is the next sibling div (expandcollapse-content)
    let contentCell = '';
    const contentDiv = li.querySelector(':scope > div.expandcollapse-content');
    if (contentDiv) {
      // If there's a .cm.cm-rich-text child, use that, else use contentDiv
      const richText = contentDiv.querySelector('.cm.cm-rich-text');
      if (richText) {
        contentCell = richText;
      } else {
        contentCell = contentDiv;
      }
    }
    rows.push([titleCell, contentCell]);
  });
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
