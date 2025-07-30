/* global WebImporter */
export default function parse(element, { document }) {
  // Extract the .img div containing the background-image and possible inner text
  const bgDiv = element.querySelector('.img');
  let imgElem = null;
  let headingElem = null;

  if (bgDiv) {
    // Get background image URL
    const style = bgDiv.style && bgDiv.style.backgroundImage;
    if (style) {
      const match = style.match(/url\((['"]?)(.*?)\1\)/);
      if (match && match[2]) {
        imgElem = document.createElement('img');
        imgElem.src = match[2];
        // Use text from <span> as alt if present
        const span = bgDiv.querySelector('span');
        imgElem.alt = span ? span.textContent.trim() : '';
        // If there is visible text, use it as heading
        if (span && span.textContent.trim()) {
          headingElem = document.createElement('h1');
          headingElem.textContent = span.textContent.trim();
        }
      }
    }
  }

  // Build table rows per Hero (hero28) block doc
  const headerRow = ['Hero (hero28)'];
  const imgRow = [imgElem ? imgElem : ''];
  const contentRow = [headingElem ? headingElem : ''];

  const cells = [headerRow, imgRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}