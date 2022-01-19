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

// add color settings section to the settings menu
const gameSettings = document
  .querySelector('game-app')
  .shadowRoot.querySelector('game-page').shadowRoot

const firstSection = gameSettings.querySelector(
  '.sections > section:first-child'
)
const customColorsSection = document.createElement('section')
firstSection.insertAdjacentElement('afterend', customColorsSection)

colors = {
  '⬜': '#fff',
  '⬛': '#000',
  '🟥': '#f00',
  '🟦': '#0078d7',
  '🟧': '#f7630c',
  '🟨': '#fff100',
  '🟩': '#22c60c',
  '🟪': '#886ce4',
  '🟫': '#8e562e'
}
customColorsSection.innerHTML = '<h3>Custom Colors</h3>'
customColorsSection.appendChild(
  colorSetting(
    'Correct',
    'Tile color when a letter is present in the right spot'
  )
)
customColorsSection.appendChild(
  colorSetting(
    'Present',
    'Tile color when a letter is present but in the wrong spot'
  )
)

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
        <select id="${lower}-color-select">
            ${Object.entries(colors)
              .map(([n, c]) => `<option value="${c}">${n}</option>`)
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
    settings[lower] = val
    save()
  })
  return setting
}
