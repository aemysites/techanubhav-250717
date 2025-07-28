/* global WebImporter */
export default function parse(element, { document }) {
  // Create the header row exactly as required
  const headerRow = ['Accordion (accordion34)'];
  const rows = [headerRow];

  // Each accordion is a child with class .accordion
  const accordions = Array.from(element.querySelectorAll(':scope > .accordion'));
  accordions.forEach(acc => {
    // Title cell: the .paragraph-lg inside w-dropdown-toggle
    let titleCell = '';
    const toggle = acc.querySelector('.w-dropdown-toggle');
    if (toggle) {
      const titleElem = toggle.querySelector('.paragraph-lg');
      if (titleElem) {
        titleCell = titleElem;
      } else {
        // fallback: use whole toggle if subelement missing
        titleCell = toggle;
      }
    } else {
      // fallback: use acc if all else fails
      titleCell = acc;
    }

    // Content cell: the .rich-text inside .accordion-content
    let contentCell = '';
    const contentWrap = acc.querySelector('.accordion-content');
    if (contentWrap) {
      // Find the .w-richtext as the main content container
      const rich = contentWrap.querySelector('.w-richtext');
      if (rich) {
        contentCell = rich;
      } else {
        // fallback: use contentWrap itself
        contentCell = contentWrap;
      }
    }

    rows.push([titleCell, contentCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
