// quartz/components/scripts/languageSwitcher.inline.ts
document.addEventListener("nav", () => {
  const toggle = document.querySelector(".language-switcher-toggle")
  if (!toggle) return

  // Список языков и их отображение на кнопке
  const languages = [
    { code: 'ru', label: 'English' }, // на русской версии кнопка предлагает переключить на английский
    { code: 'en', label: 'Русский' }  // на английской – на русский
  ]

  // Текущий язык из localStorage или ru
  let currentLang = localStorage.getItem("preferredLanguage") || "ru"

  // Функция установки языка
  const setLanguage = (lang: string) => {
    currentLang = lang
    localStorage.setItem("preferredLanguage", lang)

    // Показать/скрыть блоки контента
    document.querySelectorAll(".lang-block").forEach((el) => {
      const blockLang = el.getAttribute("data-lang")
      el.style.display = blockLang === lang ? "block" : "none"
    })

    // Обновить заголовок страницы
    const titleElements = document.querySelectorAll(".lang-title")
    titleElements.forEach((el) => {
      const titleLang = el.getAttribute("data-lang")
      if (titleLang === lang) {
        document.title = el.textContent || document.title
      }
    })

    // Обновить текст кнопки (показываем язык, на который можно переключиться)
    const nextLang = languages.find(l => l.code !== lang) || languages[0]
    const label = toggle.querySelector(".lang-toggle-label")
    if (label) label.textContent = nextLang.label
  }

  // Обработчик клика – переключение на следующий язык
  toggle.addEventListener("click", (e) => {
    e.preventDefault()
    const nextLang = languages.find(l => l.code !== currentLang) || languages[0]
    setLanguage(nextLang.code)
  })

  // Инициализация
  setLanguage(currentLang)
})