/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header row
  const headerRow = ['Accordion (accordion26)'];
  const rows = [headerRow];

  // Find all accordion items
  const ul = element.querySelector('ul.accordion-list');
  if (!ul) return;
  const allLi = Array.from(ul.querySelectorAll(':scope > li'));

  allLi.forEach(li => {
    // Title: <a class="accordion-item">
    const titleAnchor = li.querySelector('a.accordion-item');
    // Content: <div class="expandcollapse-content">
    const contentDiv = li.querySelector('div.expandcollapse-content');
    if (!titleAnchor || !contentDiv) return;

    // Create a title element that only includes the visible label (no icons/divs)
    let titleText = '';
    Array.from(titleAnchor.childNodes).forEach(n => {
      if (n.nodeType === Node.TEXT_NODE) {
        titleText += n.textContent;
      }
    });
    const titleEl = document.createElement('div');
    titleEl.textContent = titleText.trim();

    // For the content, reference the <ol> inside the expandcollapse-content if present,
    // otherwise reference the expandcollapse-content itself.
    let content;  
    const ol = contentDiv.querySelector('ol');
    if (ol) {
      content = ol;
    } else {
      // Fallback if not found
      content = contentDiv;
    }
    rows.push([titleEl, content]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
