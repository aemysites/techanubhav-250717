/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main accordion section within the filtered content block
  const filteredContent = element.querySelector('.filtered-content');
  if (!filteredContent) return;
  const accordionSection = filteredContent.querySelector('.cm-accordion');
  if (!accordionSection) return;

  const headerRow = ['Accordion (accordion12)'];
  const tableRows = [headerRow];

  // Find potential intro block, which is a .cm-rich-text before the <ul> in .cm-accordion,
  // or a .cm-rich-text as the first child of .accordion-list
  let introBlock = null;
  // Try to find a direct child .cm-rich-text in the accordion section (before the <ul>)
  const children = Array.from(accordionSection.childNodes);
  for (let i = 0; i < children.length; i++) {
    const node = children[i];
    if (node.nodeType === 1 && node.classList.contains('cm-rich-text')) {
      introBlock = node;
      break;
    }
  }
  // If not found, check if one is in .accordion-list as the first element
  const ul = accordionSection.querySelector('.accordion-list');
  if (!ul) return;
  let introListBlock = null;
  if (ul.children.length && ul.children[0].tagName === 'DIV' && ul.children[0].classList.contains('cm-rich-text')) {
    introListBlock = ul.children[0];
  }
  // Prefer the first intro found
  const introElem = introListBlock || introBlock;
  if (introElem) {
    // Intro gets a row spanning both columns via [introElem, '']
    tableRows.push([introElem, '']);
  }

  // Now find all <li> accordion items (skip any div intro in <ul>)
  const lis = Array.from(ul.children).filter(child => child.tagName === 'LI');
  lis.forEach(li => {
    // The title is the <a> inside the li
    const a = li.querySelector('a.accordion-item');
    let titleElem = '';
    if (a) {
      // Remove any trailing <div class="ec"> (expand/collapse icon)
      const ec = a.querySelector('div.ec');
      if (ec) ec.remove();
      // Reference the <a> itself for semantic heading/formatting/links
      titleElem = a;
    }
    // The content is the .expandcollapse-content > .cm-rich-text
    let contentElem = '';
    const contentDiv = li.querySelector('.expandcollapse-content .cm-rich-text');
    if (contentDiv) {
      contentElem = contentDiv;
    }
    tableRows.push([titleElem, contentElem]);
  });

  // Create and replace with the accordion table
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
