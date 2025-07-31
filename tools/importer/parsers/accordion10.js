/* global WebImporter */
export default function parse(element, { document }) {
  // Step 1: Prepare the rows array; header first
  const cells = [['Accordion']];

  // Step 2: Locate the main <ul class="accordion-list">
  const accordionList = element.querySelector('ul.accordion-list');
  if (!accordionList) {
    // No accordion list found, do nothing
    return;
  }

  // Step 3: Each accordion item is a <li> directly under accordion-list
  // In this HTML, there is one <li> which contains all actual toggles: title <a> and content <div>
  const topLi = accordionList.querySelector(':scope > li');
  if (!topLi) {
    return;
  }

  // Title is the <a>
  const titleLink = topLi.querySelector(':scope > a');
  let titleCell = '';
  if (titleLink) {
    // Only the text (strip any children like icons)
    // Get all child text nodes (exclude elements)
    let titleText = Array.from(titleLink.childNodes).filter(n => n.nodeType === 3).map(n => n.textContent).join(' ').trim();
    titleCell = titleText;
  }

  // Content area is <div expandcollapse-content>
  const contentDiv = topLi.querySelector(':scope > div.expandcollapse-content');
  let contentCell = '';
  if (contentDiv) {
    // There is an <ol> with multiple <div.tcs-wrapper>, each of which contains <li>
    const ol = contentDiv.querySelector('ol');
    if (ol) {
      const wrappers = ol.querySelectorAll(':scope > div.tcs-wrapper');
      // For each wrapper, gather the relevant <li> children
      const rows = [];
      wrappers.forEach(wrapper => {
        const li = wrapper.querySelector('li');
        if (!li) return;
        // Gather <p> and any block children from the <li>
        const liContent = [];
        Array.from(li.childNodes).forEach(node => {
          // Only append non-empty nodes
          if (node.nodeType === 1) {
            // elements
            if (node.textContent.trim() || node.querySelector('a, b, u, i, em, strong')) {
              liContent.push(node);
            }
          } else if (node.nodeType === 3 && node.textContent.trim()) {
            // text nodes
            const span = document.createElement('span');
            span.textContent = node.textContent.trim();
            liContent.push(span);
          }
        });
        if (liContent.length) {
          rows.push(liContent.length === 1 ? liContent[0] : liContent);
        }
      });
      // Place all li contents in a fragment
      if (rows.length) {
        const frag = document.createDocumentFragment();
        rows.forEach((block, idx) => {
          if (Array.isArray(block)) {
            block.forEach(el => frag.appendChild(el));
          } else {
            frag.appendChild(block);
          }
          // Optionally, add <br> between blocks for clarity (matches original HTML breaks)
          if (idx !== rows.length - 1) {
            frag.appendChild(document.createElement('br'));
          }
        });
        contentCell = frag.childNodes.length === 1 ? frag.firstChild : Array.from(frag.childNodes);
      }
    }
  }

  // Add the row if there is a title or content
  if (titleCell || contentCell) {
    cells.push([
      titleCell,
      contentCell
    ]);
  }

  // Build and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
