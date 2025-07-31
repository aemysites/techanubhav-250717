/* global WebImporter */
export default function parse(element, { document }) {
  // Table: header row, then each accordion row is [Title, Content]
  const rows = [['Accordion']];
  // Find all accordion items
  const accordionList = element.querySelector('ul.accordion-list');
  if (!accordionList) return;
  const liItems = accordionList.querySelectorAll(':scope > li');

  liItems.forEach(li => {
    // Title: the <a> with class accordion-item, but reference existing node, not clone
    let titleCell = '';
    const titleLink = li.querySelector('a.accordion-item');
    if (titleLink) {
      // Remove .ec visual sub-element from the title, but keep the anchor
      const ecDiv = titleLink.querySelector('div.ec');
      if (ecDiv) ecDiv.remove();
      titleCell = titleLink;
    }
    // Content: the corresponding <div class="expandcollapse-content"> (direct child of li). Reference the <ol> inside, or all children if not present.
    let contentCell = '';
    const contentDiv = li.querySelector('div.expandcollapse-content');
    if (contentDiv) {
      // Remove potential role, tabindex, inline style attributes
      contentDiv.removeAttribute('role');
      contentDiv.removeAttribute('tabindex');
      contentDiv.removeAttribute('style');
      // Reference the <ol> directly if present, else the div itself
      const ol = contentDiv.querySelector('ol');
      if (ol) {
        contentCell = ol;
      } else {
        contentCell = contentDiv;
      }
    }
    rows.push([titleCell, contentCell]);
  });

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
