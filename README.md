# Nsikak Menim Portfolio

Welcome to the **Nsikak Menim Portfolio**, a static, responsive, and accessible site showcasing my data-driven Python projects, web-scraping tools, machine learning demos, and more. Built with HTML5, Tailwind CSS, and vanilla JavaScript, the site features:

* **Dark/Light Mode Toggle**: Class-based dark mode with system-preference detection and persistent user selection.
* **Filterable Projects & Blog**: Accessible buttons with keyboard navigation and smooth show/hide animations.
* **Responsive Navigation**: Static header with mobile-friendly toggle menu.
* **Performance & SEO**: Preconnect hints, lazy-loading images, single-line CSP, and Open Graph metadata.
* **Analytics & Consent**: Cookie-consent banner controlling Google Analytics initialization with privacy settings.

## 📁 Repository Structure

```text
my-portfolio/
├── css/
│   └── style.css           # Custom overrides and social icon sizing
├── images/                 # Static assets (icons, profile, og-image)
├── js/
│   └── main.js             # Mobile menu, dark-mode, filters, analytics, consent
├── index.html              # Main entry point with <header>, <main>, <footer> landmarks
├── README.md               # This documentation
└── requirements.txt        # Python dependencies for featured projects
```

## 🚀 Local Development

1. **Clone** the repo:

   ```bash
   ```

git clone [https://github.com/weirdmenim/my-portfolio.git](https://github.com/weirdmenim/my-portfolio.git)
cd my-portfolio

````
2. **Install a static server** (optional, for live reload):
   ```bash
npm install -g live-server
# or use Python's built-in server:
# python3 -m http.server 8000
````

3. **Start** the server:

   ```bash
   ```

live-server --open=./index.html

````
4. **Visit** `http://localhost:8080` (or `http://localhost:8000`).

## ⚙️ Configuration

- **Google Analytics**: In `index.html` and `js/main.js`, replace `G-Z30T46JGHS` with your Measurement ID.
- **Content Security Policy**: Updated in the `<head>` meta; adjust domains as needed.

## 🐍 Python Projects Requirements

This portfolio highlights various Python-based tools. To run any local clones of those projects, install dependencies listed in `requirements.txt`:

```bash
pip install -r requirements.txt
````

> **requirements.txt** includes: data analysis (pandas, numpy), visualization (matplotlib, seaborn, plotly), web scraping (beautifulsoup4, scrapy), ML (scikit-learn, tensorflow, keras), web APIs (flask, fastapi, uvicorn).

## 🤝 Contribution

Feel free to open issues, submit PRs, or propose enhancements. For project-specific code, navigate to each linked GitHub repo under the “Projects” section.

---

*Built by Nsikak Menim*
