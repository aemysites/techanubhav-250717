/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: exactly one column
  const headerRow = ['Accordion (accordion12)'];
  const rows = [headerRow];

  // Locate the main accordion <ul>
  let filteredContent = element.querySelector('.filtered-content');
  if (!filteredContent) filteredContent = element;
  const accordionSection = filteredContent.querySelector('section.cm-accordion');
  if (!accordionSection) return;
  const ul = accordionSection.querySelector('ul.accordion-list');
  if (!ul) {
    element.replaceWith(WebImporter.DOMUtils.createTable(rows, document));
    return;
  }

  // Only process <li> children, ignore <div> intro blocks (do not add them as rows)
  Array.from(ul.children).forEach(child => {
    if (child.tagName !== 'LI') return;
    const a = child.querySelector(':scope > a.accordion-item');
    if (a) {
      const ec = a.querySelector(':scope > .ec');
      if (ec) ec.remove();
    }
    const contentDiv = child.querySelector(':scope > .expandcollapse-content');
    rows.push([a || '', contentDiv || '']);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
