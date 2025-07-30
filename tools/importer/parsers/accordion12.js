/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion section in the element
  const accordionSection = element.querySelector('section.cm-accordion, section.cm.cm-accordion');
  if (!accordionSection) return;

  // Find all accordion items (li)
  const ul = accordionSection.querySelector('ul.accordion-list');
  if (!ul) return;

  // Optional: gather intro content before the accordion items (inside ul)
  let introContent = null;
  if (ul.firstElementChild && ul.firstElementChild.matches('div.cm-rich-text')) {
    introContent = ul.firstElementChild;
  }

  // Get all li items that are direct children of the ul (avoid nested or unrelated lis)
  const liItems = Array.from(ul.children).filter(child => child.tagName === 'LI');

  // Table header row
  const rows = [['Accordion (accordion12)']];

  // If there's an intro block, insert it as a row spanning both columns
  if (introContent) {
    rows.push([introContent, '']);
  }

  // For each li (accordion item)
  liItems.forEach(li => {
    // The clickable title is the <a> tag inside li
    const titleLink = li.querySelector('a.accordion-item, a.js-ec-link');
    let titleContent = '';
    if (titleLink) {
      // Remove the trailing <div class="ec"></div> for clean title
      const titleNodes = Array.from(titleLink.childNodes).filter(node => {
        // Skip div.ec
        return !(node.nodeType === 1 && node.tagName === 'DIV' && node.classList.contains('ec'));
      });
      // If only one node, use that; if multiple, use as array
      titleContent = titleNodes.length === 1 ? titleNodes[0] : titleNodes;
    }
    // The answer/content is the <div class="expandcollapse-content">
    const expandDiv = li.querySelector('div.expandcollapse-content');
    let contentCell = '';
    if (expandDiv) {
      // Use the first '.cm-rich-text' child if present, else the expandDiv
      const richText = expandDiv.querySelector('.cm-rich-text');
      if (richText) {
        contentCell = richText;
      } else {
        // If no .cm-rich-text, use expandDiv (should not normally happen)
        contentCell = expandDiv;
      }
    }
    rows.push([
      titleContent,
      contentCell
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
