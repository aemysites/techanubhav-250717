/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row exactly as specified
  const headerRow = ['Hero (hero39)'];

  // Find the background image (if present)
  const bgImg = element.querySelector('img.cover-image');
  const imageRow = [bgImg ? bgImg : ''];

  // Find the headline (h1)
  const h1 = element.querySelector('h1');
  // Find paragraph (subheading/description), which is after h1 in the visual order
  let para = null;
  // Find the CTAs (could be <a>), also after h1
  let cta = null;
  // The text and buttons are often grouped inside a container, but fall back if not
  const containerCandidates = Array.from(element.querySelectorAll('.flex-vertical, .w-layout-grid, .utility-position-relative'));
  for (const wrapper of containerCandidates) {
    // Find the first paragraph and button in order
    if (!para) para = wrapper.querySelector('p');
    if (!cta) cta = wrapper.querySelector('a.button, a.w-button, a');
  }
  // fallback: global search if not found
  if (!para) para = element.querySelector('p');
  if (!cta) cta = element.querySelector('a.button, a.w-button, a');

  // Compose content fragment in correct order (headline, para, CTA)
  const contentFrag = document.createDocumentFragment();
  if (h1) contentFrag.appendChild(h1);
  if (para) contentFrag.appendChild(para);
  if (cta) contentFrag.appendChild(cta);

  // Build the rows
  const rows = [
    headerRow,
    imageRow,
    [contentFrag],
  ];

  // Create the block table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
