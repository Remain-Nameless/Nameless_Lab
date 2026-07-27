import { QuartzComponentConstructor } from "./types"

export default (() => {
  function ShakyText() {
    return null
  }

  ShakyText.afterDOMLoaded = `
    (function() {
      function applyShakyEffect(container) {
        const text = container.innerText;
        const chars = text.split('');
        container.innerHTML = chars.map(ch => {
          if (ch === ' ') return ' ';
          const delay = Math.random() * 0.1;
          const duration = 0.08 + Math.random() * 0.07; // 0.08–0.15 с
          return '<span style="display: inline-block; animation: shaky ' + duration + 's infinite linear; animation-delay: ' + delay + 's;">' + ch + '</span>';
        }).join('');
      }

      function processShakyElements() {
        const containers = document.querySelectorAll('.shaky-text');
        containers.forEach(container => {
          if (container.querySelector('span')) return;
          applyShakyEffect(container);
        });
      }

      function addStyles() {
        if (document.getElementById('shaky-styles')) return;
        const style = document.createElement('style');
        style.id = 'shaky-styles';
        style.textContent = \`
          @keyframes shaky {
            0% { transform: translate(0, 0); }
            25% { transform: translate(-1px, -1px); }
            50% { transform: translate(1px, 1px); }
            75% { transform: translate(-1px, 1px); }
            100% { transform: translate(0, 0); }
          }
        \`;
        document.head.appendChild(style);
      }

      function init() {
        addStyles();
        processShakyElements();
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
      } else {
        init();
      }
      document.addEventListener('nav', init);
    })();
  `

  return ShakyText
}) satisfies QuartzComponentConstructor