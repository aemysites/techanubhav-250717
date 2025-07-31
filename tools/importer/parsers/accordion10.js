/* global WebImporter */
export default function parse(element, { document }) {
  // Table header matches example exactly
  const headerRow = ['Accordion (accordion10)'];
  const rows = [headerRow];

  // Find all top-level <li> in the accordion <ul>
  const list = element.querySelector('ul.accordion-list');
  if (!list) return;
  const items = list.querySelectorAll(':scope > li');

  items.forEach((li) => {
    // Title: the <a> inside the <li>
    const link = li.querySelector(':scope > a');
    let titleNode = null;
    if (link) {
      // Use only textContent of <a> (excluding any <div>), use reference to text node
      // Remove any child <div> (such as the expand/collapse icon)
      let text = Array.from(link.childNodes)
        .filter(n => n.nodeType === Node.TEXT_NODE)
        .map(n => n.textContent.trim())
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
      titleNode = document.createTextNode(text);
    } else {
      titleNode = document.createTextNode('');
    }

    // Content: the <div.js-ec> inside the <li>
    const content = li.querySelector(':scope > .js-ec');
    let contentCell;
    if (content) {
      // find the rich text container, or just use the .js-ec div itself
      const rich = content.querySelector('.cm-rich-text, .module__content, .l-full-width');
      if (rich) {
        // include all child nodes (including inline elements, lists, etc.)
        const children = Array.from(rich.childNodes).filter(
          node => (node.nodeType === Node.ELEMENT_NODE) || (node.nodeType === Node.TEXT_NODE && node.textContent.trim())
        );
        contentCell = children.length === 1 ? children[0] : children;
      } else {
        // fallback: all content's child nodes
        const children = Array.from(content.childNodes).filter(
          node => (node.nodeType === Node.ELEMENT_NODE) || (node.nodeType === Node.TEXT_NODE && node.textContent.trim())
        );
        contentCell = children.length === 1 ? children[0] : children;
      }
    } else {
      contentCell = document.createTextNode('');
    }

    rows.push([titleNode, contentCell]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
