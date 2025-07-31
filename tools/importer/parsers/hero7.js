/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Create the header row as specified
  const headerRow = ['Hero (hero7)'];

  // 2. Image row: get the background image as <img>
  let imgEl = null;
  const bgDiv = element.querySelector('.img[style*="background-image"]');
  if (bgDiv && bgDiv.style.backgroundImage) {
    const match = bgDiv.style.backgroundImage.match(/url\((?:'|")?(.*?)(?:'|")?\)/);
    let url = match && match[1] ? match[1] : '';
    if (url && !/^https?:\/\//.test(url)) {
      url = 'https://www.virginmoney.com' + url;
    }
    if (url) {
      imgEl = document.createElement('img');
      imgEl.src = url;
      const altSpan = bgDiv.querySelector('span');
      imgEl.alt = altSpan ? altSpan.textContent.trim() : '';
    }
  }
  const imageRow = [imgEl ? imgEl : ''];

  // 3. Content row: collect ALL nodes from the .content div in order, preserving structure
  let contentRow = [''];
  const contentDiv = element.querySelector('.content');
  if (contentDiv) {
    // Collect all nodes (including text nodes)
    const nodes = [];
    contentDiv.childNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        nodes.push(node);
      } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        // Wrap text node in <p> for semantic structure
        const p = document.createElement('p');
        p.textContent = node.textContent.trim();
        nodes.push(p);
      }
    });
    if (nodes.length) contentRow = [nodes];
  }

  // 4. Assemble and replace
  const cells = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
