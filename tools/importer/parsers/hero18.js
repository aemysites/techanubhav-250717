/* global WebImporter */
export default function parse(element, { document }) {
  // Build table header row exactly as in the example
  const headerRow = ['Hero (hero18)'];

  // Per block spec: row 2 is for background image (none in this HTML; leave blank)
  const imageRow = [''];

  // Compose content: headline, subheading, paragraph, cta
  // Reference only existing child elements, maintaining their structure
  // Only add non-empty items, in original order
  const children = Array.from(element.childNodes).filter((n) => {
    // Ignore empty text nodes or empty <p>
    if (n.nodeType === Node.TEXT_NODE) {
      return n.textContent.trim().length > 0;
    }
    if (n.tagName === 'P' && n.textContent.trim().length === 0) {
      return false;
    }
    return true;
  });

  // Variables to keep only first instance of each semantic element
  let heading = null;
  let subtitle = null;
  let desc = null;
  let cta = null;

  for (const child of children) {
    if (!heading && child.tagName === 'H1') {
      heading = child;
    } else if (!subtitle && child.tagName === 'SPAN' && child.classList.contains('subtitle')) {
      subtitle = child;
    } else if (!desc && child.tagName === 'P') {
      desc = child;
    } else if (!cta && child.tagName === 'SPAN' && child.classList.contains('cta')) {
      cta = child;
    }
  }

  // Compose array in content cell in correct order (heading, subtitle, desc, cta)
  const contentArr = [];
  if (heading) contentArr.push(heading);
  if (subtitle) contentArr.push(subtitle);
  if (desc) contentArr.push(desc);
  if (cta) contentArr.push(cta);

  // If everything is missing (edge case), pass an empty string as cell
  const contentRow = [contentArr.length ? contentArr : ''];

  // Compose table rows
  const rows = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element in the DOM
  element.replaceWith(table);
}
