/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row as required
  const headerRow = ['Cards (cards8)'];

  // 2. Reference all immediate card containers (each holds an image)
  const cardDivs = element.querySelectorAll(':scope > .utility-aspect-1x1');

  // 3. Each card gets two cells: image, then an empty string for text (since there is no text)
  const rows = Array.from(cardDivs).map(div => {
    const img = div.querySelector('img');
    // If img is missing, use an empty string (unlikely, but safe)
    return [img || '', ''];
  });

  // 4. Compose and create the table
  const tableCells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(tableCells, document);

  // 5. Replace the original element
  element.replaceWith(block);
}
