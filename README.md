# Instaling Solver

**Instaling Solver** is a Chrome extension that automates learning on [Instaling](https://instaling.pl). It helps quickly fill in answers using a personal word database and configurable typing delays.

---

## Features

- Automatically types answers for questions.
- Supports a personal word database (`wordDatabase`) – the extension learns correct answers over time.
- Configurable typing delay between characters:
  - `Mean`
  - `Uniform`
  - `Triangular`
  - `Normal (clipped)`
  - `Exponential`
  - `Bimodal`
  - `Gamma`
  - `Perlin (smooth noise)`
- Simple settings interface via popup.

---

## Installation

1. Clone the repository or download the extension files.
2. Open Chrome and go to `chrome://extensions/`.
3. Enable **Developer mode** in the top right corner.
4. Click **Load unpacked** and select the folder containing the extension files.

---

## Usage

1. Open the Instaling learning page.
2. Click the extension icon to open the settings popup.
3. Configure:
   - Base delay (`midDelay`)
   - Delay variation (`deltaDelay`)
   - Delay type (`deltaType`)
4. Save settings.
5. The extension will automatically type answers for your session, updating the word database as needed.

---

## Notes

- The extension uses your personal word database to improve answer accuracy.
- Typing delay types allow for more human-like input simulation.
- Works only on pages matching `*://instaling.pl/ling2/html_app/app.php*`.
