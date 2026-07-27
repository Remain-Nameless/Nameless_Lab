import { QuartzComponent } from "./types"

const GoogleTranslate: QuartzComponent = () => {
  return (
    <div>
      <div id="google_translate_element" style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        zIndex: 1000,
        background: 'white',
        padding: '4px',
        borderRadius: '4px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
      }} />
      <script
        type="text/javascript"
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        defer
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            function googleTranslateElementInit() {
              // Удаляем старый виджет, если он уже был создан внутри контейнера
              const container = document.getElementById('google_translate_element');
              if (container) {
                // Очищаем контейнер, чтобы избежать дублирования
                while (container.firstChild) {
                  container.removeChild(container.firstChild);
                }
                new google.translate.TranslateElement({
                  pageLanguage: 'ru',
                  includedLanguages: 'ru,en,de,fr,es,it,pt,zh-CN,ja,ko',
                  layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                  autoDisplay: false
                }, 'google_translate_element');
              }
            }

            // Пересоздаём виджет при каждом переходе в SPA
            // Используем MutationObserver, чтобы отслеживать изменения в body
            // или просто перехватываем клики по ссылкам
            document.addEventListener('click', function(e) {
              const target = e.target.closest('a[href]');
              if (target && target.href && target.href.startsWith(window.location.origin)) {
                // Если это внутренняя ссылка, даём время на загрузку нового контента и пересоздаём виджет
                setTimeout(googleTranslateElementInit, 300);
              }
            });

            // Также пересоздаём при загрузке страницы, если виджет ещё не создан
            window.addEventListener('load', function() {
              if (!document.getElementById('google_translate_element')?.firstChild) {
                googleTranslateElementInit();
              }
            });
          `,
        }}
      />
    </div>
  )
}

export default (() => GoogleTranslate) satisfies QuartzComponent

  {`
    .goog-te-menu-value {
      color: #333 !important;
    }
    .goog-te-menu-frame {
      z-index: 9999 !important;
    }
    .goog-te-menu2 {
      z-index: 9999 !important;
    }
  `}
