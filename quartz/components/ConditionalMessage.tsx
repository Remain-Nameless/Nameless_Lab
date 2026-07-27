import { QuartzComponentConstructor } from "./types"

export default (() => {
  function ConditionalMessage() {
    return null
  }

  ConditionalMessage.afterDOMLoaded = `
    (function() {
      function checkUrlParam() {
        const urlParams = new URLSearchParams(window.location.search);
        const from = urlParams.get('from');
        const messages = document.querySelectorAll('.conditional-message');
        messages.forEach(el => {
          const source = el.getAttribute('data-source');
          if (!source) return;
          if (from === source) {
            el.style.display = 'block';
          } else {
            el.style.display = 'none';
          }
        });
        // Удаляем параметр из URL, чтобы не мешал при обновлении страницы
        if (from) {
          const newUrl = window.location.pathname;
          window.history.replaceState({}, '', newUrl);
        }
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkUrlParam);
      } else {
        checkUrlParam();
      }
      document.addEventListener('nav', checkUrlParam);
    })();
  `

  return ConditionalMessage
}) satisfies QuartzComponentConstructor