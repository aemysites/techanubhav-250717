/* global WebImporter */
export default function parse(element, { document }) {
  // The header row must be exactly as specified
  const headerRow = ['Accordion (accordion3)'];
  const rows = [];

  // Get the accordion list (ul.accordion-list)
  const accordionList = element.querySelector('ul.accordion-list');
  if (!accordionList) return;

  // Each accordion item is a <li> in the <ul>
  const itemLis = Array.from(accordionList.querySelectorAll(':scope > li'));

  itemLis.forEach((itemLi) => {
    // Get the title: the <a[aria-controls]> inside li
    const a = itemLi.querySelector('a[aria-controls]');
    let title = '';
    if (a) {
      // Remove any child .ec icon divs for clean text
      const aClone = a.cloneNode(true);
      const ec = aClone.querySelector('.ec');
      if (ec) ec.remove();
      title = aClone.textContent.trim();
    }
    // Content: find the .expandcollapse-content div INSIDE this li (not from previous li!)
    // In the provided HTML, the content div is INSIDE the <li> as a direct child after <a>
    let contentDiv = null;
    // Check only direct children of this li
    const liChildren = Array.from(itemLi.children);
    for (let i = 0; i < liChildren.length; i++) {
      if (liChildren[i].classList && liChildren[i].classList.contains('expandcollapse-content')) {
        contentDiv = liChildren[i];
        break;
      }
    }
    // If not found, fallback to .expandcollapse-content anywhere in li (defensive)
    if (!contentDiv) {
      contentDiv = itemLi.querySelector('.expandcollapse-content');
    }
    rows.push([title, contentDiv ? contentDiv : '']);
  });

  // Build the table: header first, then all item rows
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  element.replaceWith(table);
}
