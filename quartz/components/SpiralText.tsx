import { QuartzComponentConstructor } from "./types"

export default (() => {
  function SpiralText() {
    return null
  }

  SpiralText.afterDOMLoaded = `
    (function() {
      function wrapInSpiral(element, direction = 'inward') {
        const text = element.innerText.trim();
        if (!text) return;

        const uniqueId = 'spiral-path-' + Math.random().toString(36).slice(2, 10);

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 600 600');
        svg.style.width = '100%';
        svg.style.maxWidth = '600px';
        svg.style.margin = '0 auto';
        svg.style.display = 'block';

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('id', uniqueId);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', 'none');
        svg.appendChild(path);

        const textEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textEl.setAttribute('font-family', 'var(--bodyFont, serif)');
        textEl.setAttribute('style', 'font-size: 1.3rem');
        const textPath = document.createElementNS('http://www.w3.org/2000/svg', 'textPath');
        textPath.setAttribute('href', '#' + uniqueId);
        textPath.setAttribute('startOffset', '0');
        textPath.textContent = text;
        textEl.appendChild(textPath);
        svg.appendChild(textEl);

        element.replaceWith(svg);
        drawSpiral(uniqueId, direction);
      }

      function drawSpiral(pathId, direction) {
        const path = document.getElementById(pathId);
        if (!path) return;

        const centerX = 300, centerY = 300;
        const turns = 8;
        const radiusMax = 280;
        const startRadius = 5;
        const a = (radiusMax - startRadius) / (turns * 2 * Math.PI);
        const points = [];
        for (let t = 0; t <= turns * 2 * Math.PI; t += 0.08) {
          const r = startRadius + a * t;
          const x = centerX + r * Math.cos(t);
          const y = centerY + r * Math.sin(t);
          points.push([x, y]);
        }

        let d;
        if (direction === 'outward') {
          d = "M " + points[0][0] + "," + points[0][1];
          for (let i = 1; i < points.length; i++) {
            d += " L " + points[i][0] + "," + points[i][1];
          }
        } else {
          points.reverse();
          d = "M " + points[0][0] + "," + points[0][1];
          for (let i = 1; i < points.length; i++) {
            d += " L " + points[i][0] + "," + points[i][1];
          }
        }
        path.setAttribute("d", d);
      }

      function processSpiralElements() {
        const inwardElements = document.querySelectorAll('.spiral-text-inward');
        inwardElements.forEach(el => wrapInSpiral(el, 'inward'));
        const outwardElements = document.querySelectorAll('.spiral-text-outward');
        outwardElements.forEach(el => wrapInSpiral(el, 'outward'));
        const legacyElements = document.querySelectorAll('.spiral-text');
        legacyElements.forEach(el => wrapInSpiral(el, 'inward'));
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', processSpiralElements);
      } else {
        processSpiralElements();
      }
      document.addEventListener('nav', processSpiralElements);
    })();
  `

  return SpiralText
}) satisfies QuartzComponentConstructor