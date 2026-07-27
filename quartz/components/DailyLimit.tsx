import { QuartzComponentConstructor } from "./types"

export default (() => {
  function DailyLimit() {
    return null
  }

  DailyLimit.afterDOMLoaded = `
    (function() {
      const STORAGE_KEY = 'daily-limit-visit';
      const MESSAGE_HTML = '<div class="daily-limit-message"><p>Случилось нечто странное: хотя вы уверены, что раньше здесь что-то было, теперь оно полностью исчезло.</p></div>';

      function applyLimit() {
        const containers = document.querySelectorAll('.daily-limit');
        if (containers.length === 0) return;

        const limitHours = parseFloat(containers[0].getAttribute('data-limit-hours')) || 24;
        const now = Date.now();
        let lastVisit = localStorage.getItem(STORAGE_KEY);
        let allow = false;

        if (!lastVisit) {
          allow = true;
        } else {
          const last = parseInt(lastVisit, 10);
          if (isNaN(last)) {
            allow = true;
          } else {
            const hoursPassed = (now - last) / (1000 * 60 * 60);
            if (hoursPassed >= limitHours) {
              allow = true;
            }
          }
        }

        if (allow) {
          localStorage.setItem(STORAGE_KEY, now.toString());
          containers.forEach(container => {
            container.style.display = 'block';
            const msg = container.parentNode?.querySelector('.daily-limit-message');
            if (msg) msg.remove();
          });
        } else {
          containers.forEach(container => {
            container.style.display = 'none';
            if (!container.parentNode?.querySelector('.daily-limit-message')) {
              const msgDiv = document.createElement('div');
              msgDiv.className = 'daily-limit-message';
              msgDiv.innerHTML = MESSAGE_HTML;
              container.parentNode?.insertBefore(msgDiv, container.nextSibling);
            }
          });
        }
      }

      function init() {
        applyLimit();
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
      } else {
        init();
      }
      document.addEventListener('nav', init);
    })();
  `

  // Добавляем стили для сообщения
  DailyLimit.css = `
    .daily-limit-message {
      text-align: center;
      padding: 2rem;
      font-style: italic;
      color: var(--darkgray);
      background: var(--light);
      border-radius: 8px;
      margin: 1rem 0;
    }
  `

  return DailyLimit
}) satisfies QuartzComponentConstructor