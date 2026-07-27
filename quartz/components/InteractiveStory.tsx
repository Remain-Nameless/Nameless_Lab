import { QuartzComponentConstructor } from "./types"

export default (() => {
  function InteractiveStory() {
    return null
  }

  InteractiveStory.afterDOMLoaded = `
    (function() {
      const isMobile = () => window.matchMedia("(max-width: 768px)").matches;

      function initStory(container) {
        const steps = Array.from(container.querySelectorAll('.step'));
        if (steps.length === 0) return;

        const stepMap = new Map();
        steps.forEach(step => {
          const id = step.getAttribute('data-id');
          if (id) stepMap.set(id, step);
        });

        const storyArea = document.createElement('div');
        storyArea.className = 'story-content';
        const logArea = document.createElement('div');
        logArea.className = 'story-log';
        container.innerHTML = '';
        container.appendChild(storyArea);
        container.appendChild(logArea);

        const toggleButton = document.createElement('button');
        toggleButton.className = 'story-animation-toggle';
        toggleButton.textContent = '⏵';
        toggleButton.title = 'Отключить анимацию';
        storyArea.appendChild(toggleButton);

        let animationsEnabled = true;
        let currentAnimationTimeout = null;
        let currentStepChoices = [];

        function setAnimationsEnabled(enabled) {
          animationsEnabled = enabled;
          toggleButton.textContent = enabled ? '⏵' : '⏸';
          toggleButton.title = enabled ? 'Отключить анимацию' : 'Включить анимацию';
        }

        toggleButton.addEventListener('click', (e) => {
          e.stopPropagation();
          if (animationsEnabled) {
            if (currentAnimationTimeout) {
              clearTimeout(currentAnimationTimeout);
              currentAnimationTimeout = null;
              const textDiv = storyArea.querySelector('.story-text');
              if (textDiv) {
                const fullText = textDiv.getAttribute('data-fulltext');
                if (fullText) textDiv.textContent = fullText;
              }
              if (!storyArea.querySelector('.story-choices') && currentStepChoices.length > 0) {
                showChoices(currentStepChoices);
              }
            }
            setAnimationsEnabled(false);
          } else {
            setAnimationsEnabled(true);
          }
        });

        let currentStepId = steps[0].getAttribute('data-id');

        function addToLog(message) {
          const p = document.createElement('p');
          p.textContent = message;
          logArea.appendChild(p);
          // scroll to top to show newest (optional)
          // logArea.scrollTop = 0;
        }

        function scrollToTop() {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        function animateText(element, text, speed, callback) {
          if (!animationsEnabled) {
            element.textContent = text;
            if (callback) callback();
            return;
          }
          let i = 0;
          element.textContent = '';
          element.setAttribute('data-fulltext', text);
          function addChar() {
            if (i < text.length) {
              element.textContent += text.charAt(i);
              i++;
              currentAnimationTimeout = setTimeout(addChar, speed);
            } else {
              currentAnimationTimeout = null;
              if (callback) callback();
            }
          }
          currentAnimationTimeout = setTimeout(addChar, speed);
        }

        function showChoices(choicesArray) {
          const oldChoicesDiv = storyArea.querySelector('.story-choices');
          if (oldChoicesDiv) oldChoicesDiv.remove();

          if (choicesArray.length === 0) return;

          const choicesDiv = document.createElement('div');
          choicesDiv.className = 'story-choices';
          storyArea.appendChild(choicesDiv);

          const isMobileDevice = isMobile();

          choicesArray.forEach((choice, idx) => {
            const choiceText = choice.innerText.trim();
            const nextId = choice.getAttribute('data-next');
            const choiceDiv = document.createElement('div');
            choiceDiv.className = 'choice';
            const arrowSpan = document.createElement('span');
            arrowSpan.className = 'choice-arrow';
            arrowSpan.textContent = '>';
            const textSpan = document.createElement('span');
            textSpan.className = 'choice-text';
            textSpan.textContent = choiceText;

            choiceDiv.appendChild(arrowSpan);
            choiceDiv.appendChild(textSpan);

            choiceDiv.addEventListener('mouseenter', () => {
              if (!isMobileDevice) textSpan.style.textDecoration = 'underline';
            });
            choiceDiv.addEventListener('mouseleave', () => {
              if (!isMobileDevice) textSpan.style.textDecoration = 'none';
            });

            choiceDiv.addEventListener('click', () => {
              const textDiv = storyArea.querySelector('.story-text');
              const fullText = textDiv ? textDiv.getAttribute('data-fulltext') || textDiv.textContent : '';
              addToLog(fullText);
              addToLog('> ' + choiceText);
              choicesDiv.style.display = 'none';
              scrollToTop();
              if (nextId) {
                showStep(nextId);
              } else {
                addToLog('❓ Дальнейших шагов нет.');
              }
            });

            if (isMobileDevice) {
              choiceDiv.style.opacity = '1';
            } else {
              choiceDiv.style.opacity = '0';
              choiceDiv.style.transform = 'translateX(-10px)';
              setTimeout(() => {
                choiceDiv.style.transition = 'all 0.2s';
                choiceDiv.style.opacity = '1';
                choiceDiv.style.transform = 'translateX(0)';
              }, idx * 80);
            }

            choicesDiv.appendChild(choiceDiv);
          });
        }

        function showStep(stepId) {
          const step = stepMap.get(stepId);
          if (!step) {
            addToLog('❓ История закончилась.');
            return;
          }

          const textNodes = Array.from(step.childNodes).filter(node => node.nodeType === Node.ELEMENT_NODE && !node.classList?.contains('choices'));
          let fullText = '';
          for (let node of textNodes) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              fullText += node.innerText + ' ';
            }
          }
          fullText = fullText.trim();

          const choicesList = step.querySelector('.choices');
          const choices = choicesList ? Array.from(choicesList.querySelectorAll('li')) : [];
          currentStepChoices = choices;

          storyArea.innerHTML = '';
          storyArea.appendChild(toggleButton);
          const textDiv = document.createElement('div');
          textDiv.className = 'story-text';
          storyArea.appendChild(textDiv);

          const speed = isMobile() ? 8 : 18;

          animateText(textDiv, fullText, speed, () => {
            if (choices.length === 0) {
              addToLog(fullText);
            } else {
              showChoices(choices);
            }
          });
        }

        showStep(currentStepId);
      }

      function initAllStories() {
        document.querySelectorAll('.interactive-story').forEach(initStory);
      }

      function addStyles() {
        if (document.getElementById('interactive-story-styles')) return;
        const style = document.createElement('style');
        style.id = 'interactive-story-styles';
        style.textContent = \`
          .interactive-story {
            margin: 2rem 0;
            border-left: none;
            padding-left: 0;
            position: relative;
          }
          .story-content {
            margin-bottom: 2rem;
            position: relative;
          }
          .story-animation-toggle {
            position: absolute;
            top: -0.5rem;
            right: 0;
            background: rgba(0,0,0,0.05);
            border: none;
            border-radius: 4px;
            font-size: 0.8rem;
            padding: 0.2rem 0.4rem;
            cursor: pointer;
            opacity: 0.4;
            transition: opacity 0.2s;
            color: var(--dark);
          }
          .story-animation-toggle:hover {
            opacity: 0.9;
          }
          .story-text {
            font-size: 1.2rem;
            line-height: 1.5;
            margin-bottom: 1rem;
          }
          .story-choices {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            margin-top: 1rem;
          }
          .choice {
            display: flex;
            align-items: baseline;
            gap: 0.5rem;
            cursor: pointer;
            font-size: 1rem;
            transition: all 0.2s;
          }
          .choice-arrow {
            font-family: monospace;
            font-weight: bold;
            color: var(--secondary);
            transition: transform 0.1s;
          }
          .choice-text {
            transition: text-decoration 0.1s;
          }
          .choice:hover .choice-arrow {
            transform: translateX(4px);
          }
          .story-log {
            margin-top: 2rem;
            padding-top: 1rem;
            border-top: 1px solid var(--lightgray);
            font-size: 0.9rem;
            color: var(--gray);
            max-height: 200px;
            overflow-y: auto;
            display: flex;
            flex-direction: column-reverse;
          }
          .story-log p {
            margin: 0.2rem 0;
          }
          @media (max-width: 768px) {
            .story-choices {
              gap: 0.8rem;
            }
            .choice {
              opacity: 1 !important;
              transform: none !important;
            }
          }
        \`;
        document.head.appendChild(style);
      }

      function init() {
        addStyles();
        initAllStories();
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
      } else {
        init();
      }
      document.addEventListener('nav', init);
    })();
  `

  return InteractiveStory
}) satisfies QuartzComponentConstructor