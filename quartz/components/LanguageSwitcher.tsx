// quartz/components/LanguageSwitcher.tsx
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/languageSwitcher.scss"
import { resolveRelative } from "../util/path"
import { classNames } from "../util/lang"

export default (() => {
  const LanguageSwitcher: QuartzComponent = (props: QuartzComponentProps) => {
    const { fileData, displayClass, allFiles } = props
    const translationValue = fileData.frontmatter?.translation

    if (!translationValue) return null

    // Извлекаем название страницы из вики-ссылки
    const extractPageName = (value: string): string | null => {
      const match = value.match(/\[\[([^\]]+)\]\]/)
      if (match) return match[1]
      return value
    }

    const pageName = extractPageName(translationValue)
    if (!pageName) return null

    const targetPage = allFiles.find(
      (f) => f.frontmatter?.title === pageName
    )
    if (!targetPage) return null

    const targetSlug = targetPage.slug
    const currentLang = fileData.frontmatter?.lang || 'en'
    
    // Текст кнопки в зависимости от языка
    const buttonText = currentLang === 'ru' 
      ? 'Switch to English' 
      : 'Читать на русском'

    return (
      <div class={classNames(displayClass, "language-switcher")}>
        <a
          href={resolveRelative(fileData.slug!, targetSlug)}
          class="language-link"
        >
          <span>🌐 {buttonText}</span>
        </a>
      </div>
    )
  }

  LanguageSwitcher.css = style
  return LanguageSwitcher
}) satisfies QuartzComponentConstructor