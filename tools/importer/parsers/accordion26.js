/* global WebImporter */
export default function parse(element, { document }) {
  // Build header row
  const headerRow = ['Accordion (accordion26)'];
  const rows = [headerRow];

  // Locate the accordion content: the UL > LI structure
  const ul = element.querySelector('ul.accordion-list');
  if (!ul) return;
  const li = ul.querySelector('li');
  if (!li) return;

  // Get the title from the <a> (remove the icon div.ec)
  const titleLink = li.querySelector('a.accordion-item');
  let titleCell = '';
  if (titleLink) {
    // Clone the <a> and remove .ec div (expand/collapse icon)
    const divs = titleLink.querySelectorAll('div.ec');
    divs.forEach(d => d.remove());
    // Use the <a> itself as the cell (contains any links/text)
    titleCell = titleLink;
  }

  // Content: div.expandcollapse-content > ol > many div.tcs-wrapper > li
  const contentDiv = li.querySelector('div.expandcollapse-content');
  if (!contentDiv) return;

  // Each accordion item is a .tcs-wrapper: each contains a <li>
  const wrappers = contentDiv.querySelectorAll('.tcs-wrapper');
  wrappers.forEach(wrapper => {
    const liItem = wrapper.querySelector('li');
    if (!liItem) return;
    // Title cell is always the same for all items (from the single <a>). But example expects per-row titles. 
    // In the given source, the only per-item title is the numbered value in <li value="N">. But this is not a heading, just an ordinal.
    // We do not have per-item headings, so use the global title for all rows ("Things you need to know").
    // But, to match the example behavior, consider if the text content of the first <p> or a strong might make sense as the title.
    // However, in this HTML, only the overall <a> is a heading. So we must use that for all rows.
    rows.push([
      titleCell,
      liItem
    ]);
  });

  // Create and replace with block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
