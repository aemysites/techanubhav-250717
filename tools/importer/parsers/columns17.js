/* global WebImporter */
export default function parse(element, { document }) {
  // Find the two main columns from the .sl-list > .sl-item children
  const slList = element.querySelector('.sl-list');
  if (!slList) return;
  const slItems = slList.querySelectorAll(':scope > .sl-item');
  if (slItems.length < 2) return;

  // First column: the image section
  let leftContent;
  const imgSection = slItems[0].querySelector('section.cm-image, figure, img');
  // Prefer referencing the section/figure if possible, else the image itself
  if (imgSection) {
    // Use the highest-level section or figure containing the image
    if (imgSection.tagName === 'IMG') {
      leftContent = imgSection;
    } else {
      leftContent = imgSection;
    }
  } else {
    // fallback: whole sl-item
    leftContent = slItems[0];
  }

  // Second column: rich text, including h2, links, paragraphs, badges
  const rightRich = slItems[1].querySelector('.cm-rich-text');
  let rightContentNodes = [];
  if (rightRich) {
    // Collect only meaningful children, in order
    Array.from(rightRich.childNodes).forEach((node) => {
      if (node.nodeType !== Node.ELEMENT_NODE) return;
      // Skip empty paragraphs
      if (
        node.tagName === 'P' &&
        node.textContent.replace(/\u00A0/g, '').trim() === ''
      ) {
        return;
      }
      // Skip paragraphs with only an empty small
      if (
        node.tagName === 'P' &&
        node.childElementCount === 1 &&
        node.firstElementChild.tagName === 'SMALL' &&
        node.firstElementChild.textContent.replace(/\u00A0/g, '').trim() === ''
      ) {
        return;
      }
      rightContentNodes.push(node);
    });
    // Also ensure the .responsive-table app badge block is present in output
    const responsiveTable = rightRich.querySelector('.responsive-table');
    if (responsiveTable && !rightContentNodes.includes(responsiveTable)) {
      rightContentNodes.push(responsiveTable);
    }
  } else {
    // fallback if no .cm-rich-text: use the full column
    rightContentNodes.push(slItems[1]);
  }
  // If there's only one node, use it directly; if multiple, pass as array
  const rightContent = rightContentNodes.length === 1 ? rightContentNodes[0] : rightContentNodes;

  // Build the block table
  const cells = [
    ['Columns (columns17)'],
    [leftContent, rightContent]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
