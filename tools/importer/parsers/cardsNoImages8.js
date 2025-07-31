/* global WebImporter */
export default function parse(element, { document }) {
  // Build the table header
  const rows = [['Cards']];

  // Find all card containers
  const cardContainers = element.querySelectorAll('.column-container');

  cardContainers.forEach(container => {
    // Each .sl-item: [0]=heading, [1]=content
    const slItems = container.querySelectorAll('.sl-item');
    if (slItems.length < 2) return;
    const titleItem = slItems[0];
    const bodyItem = slItems[1];
    // Title is in h3/h2/h4/... inside first sl-item
    const heading = titleItem.querySelector('h1, h2, h3, h4, h5, h6');

    // Compose the card cell: heading (strong), then all content from body item
    const cardFragment = document.createElement('div');
    if (heading) {
      const strong = document.createElement('strong');
      strong.textContent = heading.textContent.trim();
      cardFragment.appendChild(strong);
      cardFragment.appendChild(document.createElement('br'));
    }
    // Move all child nodes from bodyItem to the fragment
    while (bodyItem.firstChild) {
      cardFragment.appendChild(bodyItem.firstChild);
    }
    rows.push([cardFragment]);
  });

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
