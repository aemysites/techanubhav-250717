/* global WebImporter */
export default function parse(element, { document }) {
  // Table header for Accordion block
  const cells = [['Accordion']];

  // Find accordion items: <ul class="accordion-list"><li> ... </li></ul>
  const accordionList = element.querySelector('.accordion-list');
  if (!accordionList) return;
  // Each top-level <li> in the accordion-list is an accordion item
  const accordionItems = accordionList.querySelectorAll(':scope > li');

  accordionItems.forEach((item) => {
    // Title is <a> (with label and possibly icon/chevron as <div class="ec">)
    const title = item.querySelector('a');
    // Content is the <div> next to the <a>
    let content = null;
    const aEl = title;
    let next = aEl ? aEl.nextElementSibling : null;
    if (next && next.tagName === 'DIV') {
      // The content is in a <div>, typically with an <ol> of <div class="tcs-wrapper"><li>...</li></div>
      // We'll assemble a content block from the <li>s inside each .tcs-wrapper
      const ol = next.querySelector('ol');
      if (ol) {
        // Create a container for the content
        content = document.createElement('div');
        // Each <div.tcs-wrapper> contains a <li>
        const wrappers = ol.querySelectorAll(':scope > div.tcs-wrapper');
        wrappers.forEach((wrapper, idx) => {
          const li = wrapper.querySelector('li');
          if (li) {
            // If li has a single p, just use the <p>, else keep whole <li>
            if (li.childElementCount === 1 && li.firstElementChild.tagName === 'P') {
              content.appendChild(li.firstElementChild);
            } else {
              content.appendChild(li);
            }
          }
        });
      } else {
        // If no <ol>, use the entire <div> content
        content = document.createElement('div');
        content.append(...next.childNodes);
      }
    } else {
      // Fallback: No content div, use empty div
      content = document.createElement('div');
    }
    // Use the existing title <a> element, and the constructed content
    cells.push([title, content]);
  });

  // Create and replace block
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
