/* global WebImporter */
export default function parse(element, { document }) {
  // Find the outermost grid
  const outerGrid = element.querySelector('.grid-layout.grid-gap-sm.y-top');
  if (!outerGrid) return;

  const cards = [];

  // Helper to extract card content from a card root (<a> or div)
  function extractCard(cardRoot) {
    // Find image: in a div.utility-aspect-* (first descendant)
    let img = null;
    const imgDiv = cardRoot.querySelector('div[class*="utility-aspect"]');
    if (imgDiv) {
      img = imgDiv.querySelector('img');
    }

    // Find heading: h3 or h4 (in the cardRoot, not in children further down)
    let heading = cardRoot.querySelector('h3, h4');
    // Find description: first <p>
    let desc = cardRoot.querySelector('p');
    // Find CTA: .button (could be a <div> or <a>)
    let cta = cardRoot.querySelector('.button');

    // Compose text cell: in the correct order
    const textContent = [];
    if (heading) textContent.push(heading);
    if (desc) textContent.push(desc);
    if (cta) textContent.push(cta);

    return [img, textContent];
  }

  // First card is a direct child <a> of the outerGrid
  const firstCard = outerGrid.querySelector(':scope > a.utility-link-content-block');
  if (firstCard) {
    cards.push(extractCard(firstCard));
  }

  // The rest of the cards are inside a nested grid-layout
  const nestedGrid = outerGrid.querySelector(':scope > .grid-layout.grid-gap-sm.y-top');
  if (nestedGrid) {
    nestedGrid.querySelectorAll(':scope > a.utility-link-content-block').forEach(cardRoot => {
      cards.push(extractCard(cardRoot));
    });
  }

  // Build the final table
  const cells = [
    ['Cards (cards37)'],
    ...cards.map(([img, textContent]) => [img, textContent])
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
