/* global WebImporter */
export default function parse(element, { document }) {
  // Header row matches the example exactly
  const headerRow = ['Accordion (accordion34)'];

  // Find all direct accordion blocks
  const accordions = Array.from(element.querySelectorAll(':scope > .accordion.w-dropdown'));
  
  const rows = accordions.map((accordion) => {
    // Title cell: paragraph-lg inside the dropdown toggle
    let titleDiv = accordion.querySelector('.w-dropdown-toggle .paragraph-lg');
    // Fallback to the .w-dropdown-toggle itself if paragraph-lg missing
    if (!titleDiv) {
      titleDiv = accordion.querySelector('.w-dropdown-toggle');
    }

    // Content cell: actual visible content for this accordion item
    // We want the immediate child of nav.accordion-content.w-dropdown-list
    // Usually a div containing .rich-text, but take the full content node for robustness
    let contentNav = accordion.querySelector('.accordion-content.w-dropdown-list');
    let contentCell;
    if (contentNav) {
      // gather all children inside the content nav (excluding empty whitespace)
      const contentChildren = Array.from(contentNav.childNodes).filter((n) => {
        // Element nodes, and non-empty text nodes
        return n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim().length > 0);
      });
      // prefer to collapse to a single element if only one, else array
      contentCell = contentChildren.length === 1 ? contentChildren[0] : contentChildren;
    } else {
      contentCell = '';
    }

    return [titleDiv, contentCell];
  });

  // Compose the table: header row, then each accordion row
  const tableRows = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(tableRows, document);

  element.replaceWith(table);
}
