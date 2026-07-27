import { QuartzComponentConstructor } from "./types"

export default (() => {
  function ReflectionText() {
    return null
  }

  ReflectionText.css = `
    .reflection-wrapper {
      width: 100%;
      max-width: 100%;
      margin: 0 auto;
      text-align: center; /* центрирование для всего контейнера */
    }
    .reflection-original,
    .reflection-reflection {
      margin: 0;
      width: 100%;
      background: transparent;
      text-align: center; /* центрирование текста */
    }
    .reflection-original {
      color: transparent;
      user-select: none;
    }
    .reflection-original a {
      color: transparent !important;
      background: transparent !important;
      text-decoration: none !important;
      pointer-events: none !important;
    }
    .reflection-original .highlight {
      color: var(--dark, #000);
    }
    .reflection-original .highlight a {
      color: var(--dark, #000) !important;
      background: transparent !important;
      text-decoration: underline !important;
      pointer-events: auto !important;
    }
    .reflection-reflection {
      transform: scaleY(-1);
      color: var(--dark, #000);
      direction: ltr;
      position: relative;
      user-select: text;
      /* Применяем фильтр для ряби */
      filter: url(#water-ripple);
    }
    .reflection-reflection::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      background: linear-gradient(to top, transparent 0%, var(--light, #f5f5f5) 100%);
      opacity: 0.9;
    }
    .reflection-reflection::selection,
    .reflection-reflection *::selection {
      background: rgba(0,0,0,0.1);
      color: inherit;
    }
  `

  ReflectionText.afterDOMLoaded = `
    (function() {
      // Добавляем SVG-фильтр для ряби
      function addRippleFilter() {
        if (document.getElementById('water-ripple-filter')) return;
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '0');
        svg.setAttribute('height', '0');
        svg.setAttribute('style', 'position:absolute;');
        svg.setAttribute('id', 'water-ripple-filter');
        
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
        filter.setAttribute('id', 'water-ripple');
        filter.setAttribute('x', '-10%');
        filter.setAttribute('y', '-10%');
        filter.setAttribute('width', '120%');
        filter.setAttribute('height', '120%');
        
        // turbulence для создания шума
        const turbulence = document.createElementNS('http://www.w3.org/2000/svg', 'feTurbulence');
        turbulence.setAttribute('type', 'fractalNoise');
        turbulence.setAttribute('baseFrequency', '0.02 0.1');
        turbulence.setAttribute('numOctaves', '2');
        turbulence.setAttribute('seed', '5');
        filter.appendChild(turbulence);
        
        // displacementMap для искажения
        const displacement = document.createElementNS('http://www.w3.org/2000/svg', 'feDisplacementMap');
        displacement.setAttribute('in', 'SourceGraphic');
        displacement.setAttribute('in2', 'turbulence');
        displacement.setAttribute('scale', '3');
        displacement.setAttribute('xChannelSelector', 'R');
        displacement.setAttribute('yChannelSelector', 'G');
        filter.appendChild(displacement);
        
        defs.appendChild(filter);
        svg.appendChild(defs);
        document.body.appendChild(svg);
      }

      function initReflection(container) {
        const original = container.querySelector('.reflection-original');
        const reflection = container.querySelector('.reflection-reflection');
        if (!original || !reflection) return;

        function getTextNodes(element) {
          const nodes = [];
          const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
            acceptNode: function(node) {
              if (node.textContent.trim() === '') return NodeFilter.FILTER_REJECT;
              return NodeFilter.FILTER_ACCEPT;
            }
          });
          let node;
          while (node = walker.nextNode()) {
            nodes.push(node);
          }
          return nodes;
        }

        function getRangeInElement(element, startPos, endPos) {
          const textNodes = getTextNodes(element);
          let currentPos = 0;
          let startNode = null, startOffset = 0, endNode = null, endOffset = 0;

          for (let tn of textNodes) {
            const len = tn.textContent.length;
            if (startPos >= currentPos && startPos < currentPos + len) {
              startNode = tn;
              startOffset = startPos - currentPos;
            }
            if (endPos >= currentPos && endPos < currentPos + len) {
              endNode = tn;
              endOffset = endPos - currentPos;
            }
            currentPos += len;
            if (startNode && endNode) break;
          }

          if (!startNode || !endNode) return null;
          const range = document.createRange();
          range.setStart(startNode, startOffset);
          range.setEnd(endNode, endOffset);
          return range;
        }

        function wrapRangeWithSpan(range) {
          try {
            const commonAncestor = range.commonAncestorContainer;
            if (commonAncestor.nodeType === Node.TEXT_NODE) {
              const parent = commonAncestor.parentNode;
              const text = commonAncestor.textContent;
              const start = range.startOffset;
              const end = range.endOffset;
              const before = text.substring(0, start);
              const selected = text.substring(start, end);
              const after = text.substring(end);

              const span = document.createElement('span');
              span.className = 'highlight';
              span.textContent = selected;

              const fragment = document.createDocumentFragment();
              if (before) fragment.appendChild(document.createTextNode(before));
              fragment.appendChild(span);
              if (after) fragment.appendChild(document.createTextNode(after));

              parent.replaceChild(fragment, commonAncestor);
              return span;
            } else {
              const span = document.createElement('span');
              span.className = 'highlight';
              range.surroundContents(span);
              return span;
            }
          } catch (e) {
            console.warn('Не удалось обернуть диапазон:', e);
            return null;
          }
        }

        function clearHighlights() {
          original.querySelectorAll('.highlight').forEach(el => {
            const parent = el.parentNode;
            while (el.firstChild) {
              parent.insertBefore(el.firstChild, el);
            }
            parent.removeChild(el);
            parent.normalize();
          });
        }

        function updateOriginalSelection() {
          const sel = window.getSelection();
          clearHighlights();
          if (!sel.rangeCount || !reflection.contains(sel.anchorNode)) return;

          const range = sel.getRangeAt(0);
          const startOffset = range.startOffset;
          const endOffset = range.endOffset;
          const origRange = getRangeInElement(original, startOffset, endOffset);
          if (!origRange) return;

          wrapRangeWithSpan(origRange);
        }

        document.addEventListener('selectionchange', updateOriginalSelection);
        document.addEventListener('touchend', updateOriginalSelection);
        document.addEventListener('nav', updateOriginalSelection);

        updateOriginalSelection();
      }

      function initAll() {
        addRippleFilter();
        document.querySelectorAll('.reflection-container').forEach(initReflection);
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
      } else {
        initAll();
      }
      document.addEventListener('nav', initAll);
    })();
  `

  return ReflectionText
}) satisfies QuartzComponentConstructor