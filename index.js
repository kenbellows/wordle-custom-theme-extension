const LS_KEY = '--wordle-custom-colors'
const settings = JSON.parse(localStorage.getItem(LS_KEY)) || {}

function save() {
  localStorage.setItem(LS_KEY, JSON.stringify(settings))
}

if (settings.correct) {
  document.body.style.setProperty('--color-correct', settings.correct)
}
if (settings.present) {
  document.body.style.setProperty('--color-present', settings.present)
}

const gameApp = document.querySelector('game-app').shadowRoot

// watch for the settings modal and add our settings
const contentSlot = gameApp
  .querySelector('game-page')
  .shadowRoot.querySelector('slot[name="content"]')
contentSlot.addEventListener('slotchange', () => {
  const content = contentSlot.assignedElements()[0]
  if (content?.tagName === 'GAME-SETTINGS') {
    initSettings(content)
  }
})

// watch for the stats modal and hack the Share button
const modalSlot = gameApp
  .querySelector('game-modal')
  .shadowRoot.querySelector('slot')
modalSlot.addEventListener('slotchange', () => {
  const modalContent = modalSlot.assignedElements()[0]
  if (modalContent?.tagName === 'GAME-STATS') {
    const shareButton = modalContent.shadowRoot.querySelector('#share-button')
    if (shareButton) {
      initShareButton(shareButton)
    }
  }
})

/** add color settings section to the settings menu */
function initSettings(gameSettings) {
  const firstSection = gameSettings.shadowRoot.querySelector(
    '.sections > section:first-child'
  )
  const customColorsSection = document.createElement('section')
  firstSection.insertAdjacentElement('afterend', customColorsSection)

  customColorsSection.innerHTML = '<h3>Custom Colors</h3>'
  customColorsSection.appendChild(
    colorSetting(
      'Present',
      'Tile color when a letter is present but in the wrong spot'
    )
  )
  customColorsSection.appendChild(
    colorSetting(
      'Correct',
      'Tile color when a letter is present in the right spot'
    )
  )
}

const colors = {
  '#fff': '⬜',
  '#000': '⬛',
  '#f00': '🟥',
  '#0078d7': '🟦',
  '#f7630c': '🟧',
  '#fff100': '🟨',
  '#22c60c': '🟩',
  '#886ce4': '🟪',
  '#8e562e': '🟫'
}
function colorSetting(title, description) {
  const setting = document.createElement('div')
  setting.classList.add('setting')
  const lower = title.toLowerCase()
  setting.innerHTML = `
    <div class="text">
        <div class="title">${title}</div>
        <div class="description">${description}</div>
    </div>
    <div class="control">
        <select id="${lower}-color-select" style="padding: 4px 0">
            ${Object.entries(colors)
              .map(([c, n]) => `<option value="${c}">${n}</option>`)
              .join('')}
        </select>
    </div>
  `
  const select = setting.querySelector('select')
  if (settings[lower]) {
    select.value = settings[lower]
  }
  select.addEventListener('change', () => {
    document.body.style.setProperty(`--color-${lower}`, select.value)
    settings[lower] = select.value
    save()
  })
  return setting
}

async function updateClipboardColors() {
  const text = await navigator.clipboard.readText()
  await navigator.clipboard.writeText(
    text
      .replaceAll('🟨', '-')
      .replaceAll('🟦', '-')
      .replaceAll('🟩', '+')
      .replaceAll('🟧', '+')
      .replaceAll('-', colors[settings.present])
      .replaceAll('+', colors[settings.correct])
  )
}
function initShareButton(shareButton) {
  shareButton.addEventListener('click', () =>
    setTimeout(updateClipboardColors, 100)
  )
}
