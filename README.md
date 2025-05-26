Anagramix

Anagramix is a mobile-first, no-scroll React app for building and playing anagrams. It features:
	•	Count-Up Letter Selection: Choose 9 letters via vowel/consonant buttons or enter custom text.
	•	Drag & Drop Workspace: Arrange letters in upper and lower rows with click or touch.
	•	Swipe Alignment: Swipe tile rows to top, middle, or bottom with smooth animations.
	•	Lock & Space Controls: Lock tiles in place; insert spaces easily.
	•	Dark Mode & Safe Areas: Full-screen layout respects mobile safe insets, with a dark theme.

⸻

🚀 Quick Start
	1.	Clone the repo:

git clone https://github.com/YOUR_USERNAME/anagram-builder-app.git
cd anagram-builder-app


	2.	Install dependencies:

npm install


	3.	Run in development mode (hot reload):

npm run dev


	4.	Build for production:

npm run build


	5.	Preview the production build locally:

npm run serve    # requires `npm install -g serve`



⸻

🛠️ Features

Countdown Builder
	•	Vowel / Consonant Buttons: Randomly pull letters from a weighted pool.
	•	Custom Input: Enter your own word to start the game.
	•	Start Game: Unlocks when 9 letters are chosen or a custom word is entered.

Anagram Workspace
	•	Upper & Lower Rows: Click or drag letters between rows to form an anagram.
	•	Swipe Alignment: Swipe each row to top, middle, or bottom with animated transforms.
	•	Placeholders & Glow: Removed letters leave placeholders; clicking them pulses the missing tile.
	•	Lock & Space: Lock tiles in place; use the Space button to insert blanks.

⸻

🎨 Styling & Accessibility
	•	React + TypeScript powered by Vite starter.
	•	Tailwind CSS utility-first styling, fully responsive.
	•	WCAG 2.2 AA color contrast, aria-pressed states, and 44×44 dp tap targets.
	•	Full dark mode with safe-area support (env(safe-area-inset-*)).

⸻

📦 Deployment

This app can be deployed to GitHub Pages or any static host. Example (GitHub Pages):
	1.	Install the deploy helper:

npm install --save-dev gh-pages


	2.	Add to package.json:

"homepage": "https://YOUR_USERNAME.github.io/anagram-builder-app",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}


	3.	Run:

npm run deploy



⸻

🤝 Contributing

Contributions welcome! Feel free to open issues or submit pull requests for new features, bug fixes, or improvements.

⸻

📄 License

This project is MIT licensed.

Happy anagramming! 🧩
