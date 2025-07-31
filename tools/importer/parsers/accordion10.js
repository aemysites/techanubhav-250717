/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion-list (required structure)
  const accordionList = element.querySelector('ul.accordion-list');
  if (!accordionList) return;

  const rows = [];
  // Header row as per block name
  rows.push(['Accordion']);

  // For each top-level <li> in the accordion-list
  const items = accordionList.querySelectorAll(':scope > li');
  items.forEach((li) => {
    // Get the clickable title (first <a> with .accordion-item)
    let titleElem = li.querySelector('a.accordion-item');
    let titleCell = '';
    if (titleElem) {
      // Remove the trailing icon <div class="ec"> if present
      const icon = titleElem.querySelector('.ec');
      if (icon) icon.remove();
      // Use the link text content only (as in the screenshot, not a link)
      titleCell = document.createElement('span');
      titleCell.textContent = titleElem.textContent.trim();
    }
    // Get the content panel
    let contentElem = li.querySelector('.expandcollapse-content');
    let contentCell = '';
    if (contentElem) {
      // All .tcs-wrapper within the content
      const wrappers = contentElem.querySelectorAll('.tcs-wrapper');
      const blockfrag = document.createDocumentFragment();
      wrappers.forEach((wrapper, i) => {
        // Find <li> and append its children (preserve formatting, links, bold, etc)
        const liInWrapper = wrapper.querySelector('li');
        if (liInWrapper) {
          // If it has more than one child (e.g. multiple <p>), append them all
          Array.from(liInWrapper.childNodes).forEach(node => {
            blockfrag.appendChild(node);
          });
        }
        // Add a <br> between each wrapper except the last
        if (i < wrappers.length - 1) blockfrag.appendChild(document.createElement('br'));
      });
      // If there is content, assign
      if (blockfrag.childNodes.length) contentCell = blockfrag;
    }
    rows.push([titleCell, contentCell]);
  });
  // Create the table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
