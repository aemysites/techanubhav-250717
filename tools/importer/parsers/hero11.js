/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row
  const headerRow = ['Hero (hero11)'];

  // 2. Find the main hero image for background image row
  // Assume the image with a descriptive alt and a src, outside the text area, is the hero image
  const imgs = element.querySelectorAll('img');
  let heroImg = null;
  if (imgs.length) {
    // Use the last image, as it comes after the text, matching screenshot
    heroImg = imgs[imgs.length - 1];
  }

  // 3. Find the content area (heading, subheading, CTA)
  // The text content is in the deeply nested div with h2, paragraph, buttons
  let contentDiv = null;
  const gridCandidates = element.querySelectorAll(':scope .container');
  for (const grid of gridCandidates) {
    const section = grid.querySelector(':scope > .section');
    if (section && section.querySelector('h2')) {
      contentDiv = section;
      break;
    }
  }

  // Compose text content: heading(s), paragraph(s), CTA(s) as seen in the screenshot/description
  const textContent = [];
  if (contentDiv) {
    // Heading
    const heading = contentDiv.querySelector('h2');
    if (heading) textContent.push(heading);
    // Subheading or paragraph
    // Try rich-text, paragraph-lg, or just p
    let subHeading = contentDiv.querySelector('.rich-text, .paragraph-lg, p');
    if (subHeading) textContent.push(subHeading);
    // CTA buttons (button-group)
    const btnGroup = contentDiv.querySelector('.button-group');
    if (btnGroup) textContent.push(btnGroup);
  }

  // Table rows
  const rows = [
    headerRow,
    [heroImg ? heroImg : ''],
    [textContent]
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
