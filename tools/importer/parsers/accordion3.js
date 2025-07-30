/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion (accordion3) block
  // Header row
  const headerRow = ['Accordion (accordion3)'];

  // Find the accordion main li (should be only one)
  const li = element.querySelector('ul.accordion-list > li');
  let titleCell = '';
  let contentCell = '';
  if (li) {
    // Title cell: get the .js-ec-link anchor
    const titleAnchor = li.querySelector('a.js-ec-link');
    if (titleAnchor) {
      // Remove the visual <div class="ec"> from the anchor
      const tempAnchor = titleAnchor.cloneNode(true);
      const ecDiv = tempAnchor.querySelector('.ec');
      if (ecDiv) ecDiv.remove();
      // If the anchor contains HTML elements (like <strong>, <span>, etc.), use its children; else use text
      if (tempAnchor.children.length > 0) {
        // Remove all empty <div> or elements with no useful content
        Array.from(tempAnchor.children).forEach(child => {
          if (child.tagName === 'DIV' && !child.textContent.trim()) child.remove();
        });
        // If still children remaining, use them as an array
        if (tempAnchor.childNodes.length > 0) {
          titleCell = Array.from(tempAnchor.childNodes);
        } else {
          titleCell = tempAnchor.textContent.trim();
        }
      } else {
        titleCell = tempAnchor.textContent.trim();
      }
    }
    // Content cell: find the expandcollapse-content div
    const contentDiv = li.querySelector('div.expandcollapse-content');
    if (contentDiv) {
      // Find the <ol> inside contentDiv
      const ol = contentDiv.querySelector('ol');
      if (ol) {
        // Since <ol> has multiple .tcs-wrapper, each with a <li>; we want to collect all <li> in order, with preserved markup
        const lis = [];
        ol.querySelectorAll(':scope > div.tcs-wrapper').forEach(wrapper => {
          const liItem = wrapper.querySelector('li');
          if (liItem) lis.push(liItem);
        });
        // Create a new <ol> in this document and append all <li>
        if (lis.length > 0) {
          const newOl = document.createElement('ol');
          lis.forEach(liItem => newOl.appendChild(liItem));
          contentCell = newOl;
        } else {
          contentCell = '';
        }
      } else {
        contentCell = contentDiv;
      }
    } else {
      contentCell = '';
    }
  }
  const rows = [
    headerRow,
    [titleCell, contentCell],
  ];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
