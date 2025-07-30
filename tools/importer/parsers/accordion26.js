/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per requirements
  const headerRow = ['Accordion (accordion26)'];

  // Find the accordion list
  const accordionList = element.querySelector('ul.accordion-list');
  if (!accordionList) return;

  // Each <li> in <ul> is an accordion entry
  const liItems = Array.from(accordionList.querySelectorAll(':scope > li'));

  const rows = [headerRow];

  liItems.forEach((li) => {
    // Find the title anchor
    const titleAnchor = li.querySelector('a.accordion-item');
    let titleCell = '';
    if (titleAnchor) {
      // Remove the .ec icon if present for cleanliness
      const ecIcon = titleAnchor.querySelector('.ec');
      if (ecIcon) ecIcon.remove();
      // Remove any aria-* attributes and superfluous ones
      titleAnchor.removeAttribute('aria-controls');
      titleAnchor.removeAttribute('aria-expanded');
      titleAnchor.removeAttribute('class');
      titleAnchor.removeAttribute('target');
      // Use the anchor directly (reference, do not clone)
      titleCell = titleAnchor;
    }

    // The content for this item: the div.expandcollapse-content
    let contentCell = '';
    const contentDiv = li.querySelector('div.expandcollapse-content');
    if (contentDiv) {
      // Find the <ol> containing accordion details
      const ol = contentDiv.querySelector('ol');
      // If found, collect all <li> descendants (inside tcs-wrapper)
      if (ol) {
        // All direct children with .tcs-wrapper, each contains a <li>
        const wrappers = Array.from(ol.querySelectorAll(':scope > div.tcs-wrapper'));
        if (wrappers.length > 0) {
          // Some wrappers may contain blocks with lists
          let parts = [];
          wrappers.forEach((wrapper) => {
            // Reference the actual <li> (as-is, not cloned)
            const wrapperLi = wrapper.querySelector('li');
            if (wrapperLi) parts.push(wrapperLi);
          });
          contentCell = parts;
        } else {
          // Fallback: use the whole contentDiv if wrappers are missing
          contentCell = contentDiv;
        }
      } else {
        // Fallback: use the whole contentDiv
        contentCell = contentDiv;
      }
    }

    rows.push([titleCell, contentCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
