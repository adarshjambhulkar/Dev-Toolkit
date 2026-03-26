# Dev Toolkit

A versatile, offline-first collection of developer utilities built with **React 19**, **TypeScript**, and **Vite**. 

This single-page application (SPA) provides a sleek, modern interface with dark/light mode support, designed to help developers quickly perform common tasks without relying on external servers or worrying about data privacy. **All processing is entirely local in your browser.**

## 🛠 Available Tools

### Cryptography
- **AES-CBC 256 Encrypt:** Securely encrypt plain text using a secret key.
- **AES-CBC 256 Decrypt:** Decrypt Base64-encoded cipher text back to plain text.
- **Base64 Encode / Decode:** Quickly encode text to Base64 (`btoa`) or decode it back to text (`atob`) with full Unicode support.

### JSON Tools
- **JSON Formatter:** Format, prettify, or stringify JSON data.
- **JSON Compare:** Diff two JSON objects side-by-side to easily spot changes.
- **JSON to Schema:** Automatically generate a JSON Schema from a sample JSON payload.
- **JSON Serialize / Deserialize:** Convert objects to JSON strings and vice versa.

### Text & Utilities
- **Character Counter:** Count characters, words, sentences, lines, and more. Includes a frequency analysis of top characters.
- **Code → String:** Quickly escape blocks of code (HTML, SQL, JS, etc.) and wrap them into string literals (double quotes, single quotes, or backticks).

## ✨ Features
- **Privacy First:** No backend, no API calls. Your data never leaves your machine.
- **Modern Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS v4.
- **Beautiful UI:** Built with `shadcn/ui`, Radix UI primitives, and Framer Motion animations.
- **Responsive Design:** Fully usable on desktop and mobile devices.
- **Theming:** Seamless Light and Dark mode.

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js installed (v18+ recommended).

### Installation
1. Clone the repository
2. Install the dependencies:
   ```bash
   npm install
   ```

### Development
Start the development server with Hot Module Replacement (HMR):
```bash
npm run dev
```

### Production Build
Build the application for production:
```bash
npm run build
```

To locally preview the production build:
```bash
npm run preview
```

## 🏗 Architecture
The project follows a specific feature-based, code-split architecture detailed in [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md). All new tools are lazy-loaded via React Router and wrapped in Suspense to ensure optimal bundle sizing.

---

Built with ❤️ by [Adarsh Jambhulkar](https://www.linkedin.com/in/adarshjambhulkar/)