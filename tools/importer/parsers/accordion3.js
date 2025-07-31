/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main accordion list
  const ul = element.querySelector('ul.accordion-list');
  if (!ul) return;
  // Find the single accordion item <li>
  const li = ul.querySelector(':scope > li');
  if (!li) return;

  // Extract the accordion panel's title (from <a>, excluding .ec icon)
  const titleAnchor = li.querySelector('a.accordion-item');
  if (!titleAnchor) return;
  let titleText = '';
  titleAnchor.childNodes.forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) {
      titleText += node.textContent;
    } else if (
      node.nodeType === Node.ELEMENT_NODE &&
      (!node.classList || !node.classList.contains('ec'))
    ) {
      titleText += node.textContent;
    }
  });
  titleText = titleText.trim();

  // Find the expanded content container for the accordion panel
  const contentDiv = li.querySelector('div.expandcollapse-content');
  if (!contentDiv) return;

  // Collect all <li> elements, either inside .tcs-wrapper or directly under <ol>
  const contentLis = [];
  // Prefer .tcs-wrapper (each contains a <li>)
  const wrappers = contentDiv.querySelectorAll('.tcs-wrapper');
  if (wrappers.length > 0) {
    wrappers.forEach(wrapper => {
      const cli = wrapper.querySelector('li');
      if (cli) contentLis.push(cli);
    });
  } else {
    // Fallback: just in case, add any <li> directly under <ol>
    const ol = contentDiv.querySelector('ol');
    if (ol) {
      ol.querySelectorAll(':scope > li').forEach(cli => contentLis.push(cli));
    }
  }
  // Prepare a fragment with all <li> in order
  const contentFragment = document.createDocumentFragment();
  contentLis.forEach(liEl => {
    contentFragment.appendChild(liEl);
  });

  // Compose the block table as per the requirements
  const cells = [
    ['Accordion (accordion3)'],
    [titleText, contentFragment]
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
