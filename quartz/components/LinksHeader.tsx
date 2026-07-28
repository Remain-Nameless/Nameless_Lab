// quartz/components/LinksHeader.tsx
import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/linksHeader.scss"
// @ts-ignore
import script from "./scripts/linksHeader.inline"
import { classNames } from "../util/lang"

export default (() => {
  function LinksHeader(props: QuartzComponentProps) {
    const { displayClass } = props
    return (
      <div class={classNames(displayClass, "links-header-outer")}>
        <div class="links-header-container">
          {/* Кнопка для мобильной версии */}
          <button
            type="button"
            class="links-header-toggle mobile-only"
            aria-controls="links-list"
            aria-expanded="false"
          >
            <span>Разделы</span>
          </button>

          {/* Контейнер со ссылками */}
          <div class="links-header-content" id="links-list" aria-expanded="false">
            {/* Заголовок для десктопной версии */}
            <div class="links-header-title desktop-only">
              <h1>Разделы</h1>
            </div>
            <ul class="links-header-list">
              <li>
                <a href="https://remain-nameless.github.io/Nameless_Lab/Site-Map">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M14.5 2H9l-.35.15-.65.64-.65-.64L7 2H1.5l-.5.5v10l.5.5h5.29l.86.85h.7l.86-.85h5.29l.5-.5v-10l-.5-.5zm-7 10.32l-.18-.17L7 12H2V3h4.79l.74.74-.03 8.58zM14 12H9l-.35.15-.14.13V3.7l.7-.7H14v9zM6 5H3v1h3V5zm0 4H3v1h3V9zM3 7h3v1H3V7zm10-2h-3v1h3V5zm-3 2h3v1h-3V7zm0 2h3v1h-3V9z" fill="currentColor"/>
                  </svg>
                  Content Map
                </a>
              </li>
              <li class="has-submenu">
                <span class="menu-title">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 52 52">
                      <path d="M26,2C12.7,2,2,12.7,2,26s10.7,24,24,24s24-10.7,24-24S39.3,2,26,2z M26,7C26,7,26,7,26,7C26,7,26,7,26,7 C26,7,26,7,26,7z M28,7.1c-0.1,0-0.1,0-0.2,0C27.9,7.1,28,7.1,28,7.1z M26,45C15.5,45,7,36.5,7,26c0-1,0.1-2.1,0.3-3 c1.3,0.2,2.9,0.7,3.7,1.5c1.7,1.8,3.6,3.9,5.4,4.3c0,0-0.2,0.1-0.4,0.4c-0.2,0.3-0.4,0.9-0.4,1.9c0,4.7,4.4,1.9,4.4,6.6 c0,4.7,5.3,6.6,5.3,2.8s3.5-5.6,3.5-8.5s-2.7-2.8-4.4-3.8c-1.8-0.9-2.7-2.4-6.1-1.9c-1.8-1.7-2.8-3.1-2-4.7c0.9-1.7,4.6-2,4.6-4.6 s-2.5-3.1-4.3-3.1c-0.8,0-2.5-0.6-3.9-1.3c1.7-1.7,3.8-3.1,6-4.1c1.6,0.7,4.3,1.8,6.6,1.8c2.7,0,4.1-1.9,3.7-3.1 c4.5,0.7,8.5,3,11.4,6.2c-1.5,0.9-3.5,1.9-7,1.9c-4.6,0-4.6,4.7-1.9,5.6c2.8,0.9,5.6-1.8,6.5,0c0.9,1.8-6.5,1.8-4.6,6.4 c1.9,4.6,3.7-0.1,5.6,4.5c1.9,4.6,5.6-0.7,2.8-4.3c-1.2-1.6-0.9-6.5,1.9-6.5h0.9c0.4,1.6,0.7,3.3,0.7,5C45,36.5,36.5,45,26,45z" fill="currentColor"/>
                    </svg>
                    Projects
                </span>
				<ul class="submenu">
                  <li><a href="https://remain-nameless.github.io/Nameless_Lab/Escupereum-Wiki">Escupereum Wiki</a></li>
                  <li><a href="https://remain-nameless.github.io/Nameless_Lab/Corporate-Knowledge-Base">Knowledge Base</a></li>
                  <li><a href="">Telegram bot</a></li>
				  <li><a href="">Reading Algorythm</a></li>
                </ul>
              </li>
			  
			  
              <li class="has-submenu">
                <span class="menu-title">
                  <a href="https://remain-nameless.github.io/Escupereum/Общество/Общество">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
  <path fill-rule="evenodd" d="M3.5 8a5.5 5.5 0 118.596 4.547 9.005 9.005 0 015.9 8.18.75.75 0 01-1.5.045 7.5 7.5 0 00-14.993 0 .75.75 0 01-1.499-.044 9.005 9.005 0 015.9-8.181A5.494 5.494 0 013.5 8zM9 4a4 4 0 100 8 4 4 0 000-8z"/>
  <path d="M17.29 8c-.148 0-.292.01-.434.03a.75.75 0 11-.212-1.484 4.53 4.53 0 013.38 8.097 6.69 6.69 0 013.956 6.107.75.75 0 01-1.5 0 5.193 5.193 0 00-3.696-4.972l-.534-.16v-1.676l.41-.209A3.03 3.03 0 0017.29 8z"/>
</svg>
                    Journal
                  </a>
                </span>
                <ul class="submenu">
                  <li><a href="https://remain-nameless.github.io/Escupereum/Общество/Наука/Наука">#IT</a></li>
                  <li><a href="https://remain-nameless.github.io/Escupereum/tags/люди">#Obsidian</a></li>
                  {<li><a href="https://remain-nameless.github.io/Escupereum/Общество/Религия">#thoughts</a></li>}
                </ul>
              </li>
			  
			  <li>
                <span class="menu-title">
                  <a href="https://remain-nameless.github.io/Escupereum/Общество/Общество">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
  <path fill-rule="evenodd" d="M3.5 8a5.5 5.5 0 118.596 4.547 9.005 9.005 0 015.9 8.18.75.75 0 01-1.5.045 7.5 7.5 0 00-14.993 0 .75.75 0 01-1.499-.044 9.005 9.005 0 015.9-8.181A5.494 5.494 0 013.5 8zM9 4a4 4 0 100 8 4 4 0 000-8z"/>
  <path d="M17.29 8c-.148 0-.292.01-.434.03a.75.75 0 11-.212-1.484 4.53 4.53 0 013.38 8.097 6.69 6.69 0 013.956 6.107.75.75 0 01-1.5 0 5.193 5.193 0 00-3.696-4.972l-.534-.16v-1.676l.41-.209A3.03 3.03 0 0017.29 8z"/>
</svg>
                    Gallery
                  </a>
                </span>
              </li>
              <li>
                <a class="random-page-button">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16">
                    <g fill="currentColor">
                      <path d="M5 4a1 1 0 000 2h.01a1 1 0 000-2H5zM7 8a1 1 0 011-1h.01a1 1 0 010 2H8a1 1 0 01-1-1zM11.01 10a1 1 0 100 2h.01a1 1 0 100-2h-.01z"/>
                      <path fill-rule="evenodd" d="M3.25 1A2.25 2.25 0 001 3.25v9.5A2.25 2.25 0 003.25 15h9.5A2.25 2.25 0 0015 12.75v-9.5A2.25 2.25 0 0012.75 1h-9.5zM2.5 3.25a.75.75 0 01.75-.75h9.5a.75.75 0 01.75.75v9.5a.75.75 0 01-.75.75h-9.5a.75.75 0 01-.75-.75v-9.5z" clip-rule="evenodd"/>
                    </g>
                  </svg>
                  Random page
                </a>
              </li>
            </ul>
          </div>
        </div>
        <hr class="header-hr mobile-only" style="background-color: var(--lightgray); border-top: 1px var(--lightgray) solid; margin-top: 1.3rem" />
      </div>
    )
  }

  LinksHeader.css = style
  LinksHeader.afterDOMLoaded = script
  return LinksHeader
}) satisfies QuartzComponentConstructor