import { QuartzComponentConstructor } from "./types"

export default (() => {
  function RevealText() {
    return null
  }

  RevealText.afterDOMLoaded = `
    (function() {
      // Обёртка текстовых узлов (без изменений)
      function wrapTextNodes(node, wrapperTag, wrapperClass, getDataText) {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent;
          if (text.trim() === '') return;
          const parts = getDataText(text);
          const parent = node.parentNode;
          const fragment = document.createDocumentFragment();
          parts.forEach(part => {
            if (part === '') return;
            if (part === ' ' || part === '\\n' || part === '\\t') {
              fragment.appendChild(document.createTextNode(part));
            } else {
              const span = document.createElement(wrapperTag);
              span.className = wrapperClass;
              span.setAttribute('data-text', part);
              let isGlow = false;
              let ancestor = node.parentNode;
              while (ancestor) {
                if (ancestor.classList && ancestor.classList.contains('glow')) {
                  isGlow = true;
                  break;
                }
                ancestor = ancestor.parentNode;
              }
              if (isGlow) {
                span.setAttribute('data-glow', 'true');
                span.classList.add('glow');
              }
              span.textContent = part;
              fragment.appendChild(span);
            }
          });
          parent.replaceChild(fragment, node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.classList && (node.classList.contains('word') || node.classList.contains('letter'))) return;
          Array.from(node.childNodes).forEach(child => wrapTextNodes(child, wrapperTag, wrapperClass, getDataText));
        }
      }

      function wrapWords(container) {
        const getWords = (text) => text.split(/(\\s+)/);
        wrapTextNodes(container, 'span', 'word', getWords);
      }

      function wrapLetters(container) {
        const getLetters = (text) => text.split('').map(ch => ch === ' ' ? ' ' : ch);
        wrapTextNodes(container, 'span', 'letter', getLetters);
      }

      // Обработка контейнеров
      function processRevealContainers() {
        document.querySelectorAll('.reveal-words').forEach(c => {
          if (c.querySelector('.word')) return;
          wrapWords(c);
        });
      }
      function processFadeContainers() {
        document.querySelectorAll('.fade-words').forEach(c => {
          if (c.querySelector('.word')) return;
          wrapWords(c);
        });
      }
      function processLetterContainers() {
        document.querySelectorAll('.reveal-letters').forEach(c => {
          if (c.querySelector('.letter')) return;
          wrapLetters(c);
        });
      }
      function applyFadeEffect() {
        document.querySelectorAll('.fade-words').forEach(c => {
          const words = c.querySelectorAll('.word');
          words.forEach((w, i) => w.style.opacity = 1 - (i / words.length));
        });
      }

      // Tooltip
      let tooltip = null, currentElement = null;
      let lastVibrationTime = 0;
      
      function createTooltip() {
        if (tooltip) return;
        tooltip = document.createElement('div');
        tooltip.className = 'reveal-tooltip';
        document.body.appendChild(tooltip);
      }
      
      const isMobile = () => window.matchMedia("(max-width: 768px)").matches;
      
      function vibrate() {
        if (!isMobile()) return;
        const now = Date.now();
        if (now - lastVibrationTime < 100) return;
        lastVibrationTime = now;
        if (window.navigator && window.navigator.vibrate) {
          window.navigator.vibrate(50);
        }
      }
      
      function showTooltip(text, clientX, clientY, isGlow) {
        createTooltip();
        if (isGlow) {
          tooltip.innerHTML = '<span style="color: #ff3333; display: inline-block; animation: flash 0.8s ease-in-out infinite alternate; text-shadow: 0 0 20px #fff, 0 0 40px #fff, 0 0 60px #fff;">' + text + '</span>';
        } else {
          tooltip.textContent = text;
        }
        tooltip.style.display = 'block';
        const rect = tooltip.getBoundingClientRect();
        tooltip.style.left = ((window.innerWidth - rect.width) / 2) + 'px';
        tooltip.style.top = '10px';
      }
      
      function hideTooltip() {
        if (tooltip) {
          tooltip.style.display = 'none';
          tooltip.innerHTML = '';
        }
      }

      // Мобильные обработчики
      let touchActive = false;
      function attachMobileHandlers() {
        if (!isMobile()) return;
        document.querySelectorAll('.reveal-words .word, .reveal-letters .letter').forEach(el => {
          el.removeEventListener('touchstart', onTouchStart);
          el.removeEventListener('touchmove', onTouchMove);
          el.removeEventListener('touchend', onTouchEnd);
          el.addEventListener('touchstart', onTouchStart);
          el.addEventListener('touchmove', onTouchMove);
          el.addEventListener('touchend', onTouchEnd);
        });
      }
      
      function onTouchStart(e) {
        e.preventDefault();
        touchActive = true;
        const el = e.currentTarget;
        const text = el.getAttribute('data-text');
        const isGlow = el.getAttribute('data-glow') === 'true';
        if (text) {
          vibrate(); // вибрация при первом касании
          showTooltip(text, e.touches[0].clientX, e.touches[0].clientY, isGlow);
        }
      }
      
      function onTouchMove(e) {
        if (!touchActive) return;
        e.preventDefault();
        const touch = e.touches[0];
        const target = document.elementFromPoint(touch.clientX, touch.clientY)?.closest('.word, .letter');
        if (target && target !== currentElement) {
          currentElement = target;
          const text = target.getAttribute('data-text');
          const isGlow = target.getAttribute('data-glow') === 'true';
          if (text) {
            vibrate(); // вибрация при переходе на новую точку
            showTooltip(text, touch.clientX, touch.clientY, isGlow);
          }
        } else if (!target) {
          hideTooltip();
        }
      }
      
      function onTouchEnd() {
        touchActive = false;
        hideTooltip();
      }

      // Активация вибрации при первом касании в любом месте экрана
      let vibrationActivated = false;
      function activateVibrationOnFirstTouch() {
        if (vibrationActivated) return;
        const handler = () => {
          if (isMobile() && window.navigator && window.navigator.vibrate) {
            // Короткая вибрация, чтобы "разбудить" механизм вибрации в браузере
            window.navigator.vibrate(1);
          }
          vibrationActivated = true;
          document.removeEventListener('touchstart', handler);
        };
        document.addEventListener('touchstart', handler, { once: false, passive: false });
      }

      // Стили (без изменений)
      function addStyles() {
        if (document.getElementById('reveal-text-styles')) return;
        const style = document.createElement('style');
        style.id = 'reveal-text-styles';
        style.textContent = \`
          .reveal-words .word, .reveal-letters .letter {
            transition: opacity 0.2s;
            display: inline;
            cursor: pointer;
            font-size: 2rem;
            line-height: 1.6;
            white-space: normal;
            word-break: keep-all;
          }
          .reveal-words:not(.fade-words) .word { opacity: 0; }
          .reveal-words:not(.fade-words) .word:hover { opacity: 1 !important; }
          .reveal-letters .letter { opacity: 0; }
          .reveal-letters .letter:hover { opacity: 1 !important; }
          .fade-words .word { opacity: 1; cursor: default; }
          .fade-words .word:hover { opacity: 1 !important; }

          .reveal-words .word.glow {
            color: #ff3333;
            animation: glowPulse 1s ease-in-out infinite alternate;
          }
          @keyframes glowPulse {
            0% { text-shadow: 0 0 5px #fff, 0 0 10px #fff; }
            100% { text-shadow: 0 0 40px #fff, 0 0 60px #fff, 0 0 80px #fff; }
          }

          @media (max-width: 768px) {
            .reveal-words, .reveal-letters { line-height: 2.5; }
            .reveal-words .word, .reveal-letters .letter {
              opacity: 1 !important;
              display: inline-block;
              text-indent: -9999px;
              position: relative;
              width: 8px;
              height: 8px;
              background: rgba(128,128,128,0.2);
              border-radius: 50%;
              margin: 0 6px;
              padding: 0;
              vertical-align: middle;
            }
            .reveal-words .word::before, .reveal-letters .letter::before {
              content: '';
              position: absolute;
              width: 100%;
              height: 100%;
              background: inherit;
              border-radius: inherit;
              top: 0;
              left: 0;
            }
            .reveal-words .word::after, .reveal-letters .letter::after {
              content: '';
              position: absolute;
              top: -12px;
              left: -12px;
              right: -12px;
              bottom: -12px;
              pointer-events: auto;
            }
            .fade-words .word {
              display: inline !important;
              text-indent: 0 !important;
              width: auto !important;
              height: auto !important;
              background: none !important;
              border-radius: 0 !important;
              margin: 0 !important;
              padding: 0 !important;
              opacity: inherit;
            }
            .fade-words .word::before, .fade-words .word::after { display: none !important; }
            .reveal-words .word.glow {
              animation: none;
              text-shadow: none;
            }
          }
          .reveal-tooltip {
            position: fixed;
            background: rgba(0,0,0,0.9);
            color: #fff;
            padding: 16px 24px;
            border-radius: 12px;
            font-size: 2.4rem;
            font-family: var(--bodyFont, sans-serif);
            pointer-events: none;
            z-index: 10000;
            max-width: 90vw;
            white-space: normal;
            word-break: break-word;
            text-align: center;
            display: none;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          }
          @keyframes flash {
            0% { text-shadow: 0 0 5px #fff, 0 0 10px #fff; }
            100% { text-shadow: 0 0 80px #fff, 0 0 120px #fff, 0 0 180px #fff; }
          }
        \`;
        document.head.appendChild(style);
      }

      function init() {
        addStyles();
        processRevealContainers();
        processFadeContainers();
        processLetterContainers();
        applyFadeEffect();
        attachMobileHandlers();
        activateVibrationOnFirstTouch(); // обязательно вызываем
      }

      if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
      else init();
      document.addEventListener('nav', init);
    })();
  `

  return RevealText
}) satisfies QuartzComponentConstructor