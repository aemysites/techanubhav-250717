/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: block name EXACTLY as required
  const headerRow = ['Accordion (accordion10)'];
  const rows = [headerRow];

  // Get all accordion items
  const accordionItems = element.querySelectorAll('ul.accordion-list > li');

  accordionItems.forEach((li) => {
    // Title cell: get the anchor text without the inner icon
    const a = li.querySelector('a.accordion-item');
    // Remove trailing .ec icon from the title for display
    let title = '';
    if (a) {
      // Get all child nodes except the .ec div
      const nodes = Array.from(a.childNodes).filter(n => !(n.nodeType === 1 && n.classList.contains('ec')));
      // Join all text nodes and inline nodes except the icon
      title = nodes.map(n => n.textContent).join('').trim();
    }
    // Use a div to preserve HTML formatting if needed (though title is usually plain text)
    const titleElement = document.createElement('div');
    titleElement.textContent = title;

    // Content cell: reference all direct children of the expandcollapse-content
    const contentDiv = li.querySelector('div.expandcollapse-content');
    // Instead of cloning, reference the actual element's children (to preserve formatting, lists, etc)
    let contentCell;
    if (contentDiv && contentDiv.children.length > 0) {
      const contentParts = Array.from(contentDiv.children); // usually one .cm-rich-text
      // If there's only one child, reference it directly; if more, use array
      contentCell = contentParts.length === 1 ? contentParts[0] : contentParts;
    } else if (contentDiv) {
      // Fallback: if no child elements, but there is text, preserve it
      const fallbackDiv = document.createElement('div');
      fallbackDiv.textContent = contentDiv.textContent.trim();
      contentCell = fallbackDiv;
    } else {
      // Fallback: blank cell
      contentCell = '';
    }
    rows.push([titleElement, contentCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
