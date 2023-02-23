//modified from: https://github.com/KaTeX/KaTeX/blob/main/contrib/copy-tex/copy-tex.js
// import katexReplaceWithTex from './katex2tex.js';
// Return <div class="katex"> element containing node, or null if not found.
function closestKatex(node) {
  // If node is a Text Node, for example, go up to containing Element,
  // where we can apply the `closest` method.
  const element =
    (node instanceof Element ? node : node.parentElement);
  return element && element.closest('.katex');
}
//waiting so that yew can load
requestAnimationFrame(() => {
  console.log("inside copy.js");
  // Global copy handler to modify behavior on/within .katex elements.
  document.addEventListener('copy', function(event) {
    console.log("copy event");
    const selection = window.getSelection();
    if (selection.isCollapsed || !event.clipboardData) {
      return; // default action OK if selection is empty or unchangeable
    }
    const clipboardData = event.clipboardData;
    const range = selection.getRangeAt(0);

    // When start point is within a formula, expand to entire formula.
    const startKatex = closestKatex(range.startContainer);
    if (startKatex) {
      range.setStartBefore(startKatex);
    }

    // // Similarly, when end point is within a formula, expand to entire formula.
    const endKatex = closestKatex(range.endContainer);
    if (endKatex) {
      range.setEndAfter(endKatex);
    }

    const fragment = range.cloneContents();
    if (!fragment.querySelector('.katex-mathml')) {
      console.log("not katex")
      // return; // default action OK if no .katex-mathml elements
    }

    const htmlContents = Array.prototype.map.call(fragment.childNodes,
      (el) => (el instanceof Text ? el.textContent : el.outerHTML)
    ).join('');

    // Preserve usual HTML copy/paste behavior.
    clipboardData.setData('text/html', htmlContents);
    // Rewrite plain-text version.
    clipboardData.setData('text/plain',
      katexReplaceWithTex(fragment).textContent);
    console.log("done");
    // Prevent normal copy handling.
    event.preventDefault();
  });
})
