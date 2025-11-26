# 🛠️ Dev Toolkit

[![Live Demo](https://img.shields.io/badge/demo-live-success?style=flat-square)](https://adarshjambhulkar.github.io/Dev-Toolkit/)
[![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)
[![Made with Love](https://img.shields.io/badge/made%20with-❤️-red?style=flat-square)](https://github.com/adarshjambhulkar)

**Dev Toolkit** is a powerful, privacy-focused, single-page web application that bundles essential developer tools into one modern interface. All processing happens locally in your browser—no data ever leaves your machine.

[🚀 Live Demo](https://adarshjambhulkar.github.io/Dev-Toolkit/) • [📖 Documentation](FEATURE-DOCUMENTATION.md) • [🐛 Report Bug](https://github.com/adarshjambhulkar/Dev-Toolkit/issues)

## ✨ Features

### 🔐 AES-CBC 256 Encryption & Decryption
- **Secure Encryption**: Uses Web Crypto API for AES-CBC 256-bit encryption
- **Auto-Generated IV**: Initialization vector automatically generated and prepended
- **Base64 Output**: Encrypted text in portable Base64 format
- **Password Visibility Toggle**: Show/hide secret keys
- **JSON Preview**: Automatic JSON parsing and visualization for decrypted data
- **Persistent Keys**: Secret keys saved locally for convenience

### 📋 JSON Formatter
- **Pretty Print**: Format minified JSON with proper indentation
- **Tree View**: Interactive expandable/collapsible JSON viewer
- **Stringify Mode**: Generate escaped JSON string literals for code
- **Copy Support**: One-click copy for formatted or stringified output
- **Syntax Validation**: Real-time JSON validation with error messages
- **Dark Mode Optimized**: Readable in both light and dark themes

### 🔍 JSON Compare
- **Visual Diff**: Side-by-side JSON comparison with highlighting
- **Color-Coded Changes**: 
  - 🟢 Green for additions
  - 🔴 Red for deletions
  - 🔵 Blue for modifications
- **Deep Comparison**: Handles nested objects and arrays
- **Export Delta**: Copy the raw diff object for further processing
- **Powered by jsondiffpatch**: Industry-standard diffing library

### 🎯 JSON to JSON Schema ✨ NEW
- **Auto-Generation**: Create JSON Schema from sample data
- **Multi-Version Support**: 
  - Draft 2020-12 (Latest)
  - Draft 2019-09
  - Draft-07
  - Draft-04
- **Smart Type Detection**: 
  - Distinguishes integers vs floats
  - Handles nested objects and arrays
  - Supports mixed-type arrays with `anyOf`
- **Format Recognition**: Auto-detects email, URI, date-time, UUID formats
- **Strict Mode**: Optional `additionalProperties: false` enforcement
- **Standards Compliant**: Follows [json-schema.org](https://json-schema.org/) specification
- **Copy & Export**: Ready-to-use schemas for API docs, validation, testing

### 🎨 User Experience
- **🌓 Dark/Light Mode**: Toggle theme with preference persistence
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **⚡ Fast & Lightweight**: No backend required, instant processing
- **🔔 Toast Notifications**: Non-intrusive feedback for all actions
- **💾 Local Storage**: Smart caching for keys and preferences
- **🔒 100% Private**: All processing happens locally—nothing sent to servers

## 🚀 Quick Start

No installation, build tools, or servers required—just open and use!

### Option 1: Use Online (Recommended)
Visit the [**Live Demo**](https://adarshjambhulkar.github.io/Dev-Toolkit/) and start using immediately.

### Option 2: Run Locally

**Clone the repository:**
```bash
git clone https://github.com/adarshjambhulkar/Dev-Toolkit.git
cd Dev-Toolkit
```

**Open in browser:**
```bash
# Windows
start index.html

# macOS
open index.html

# Linux
xdg-open index.html
```

**Or simply:** Double-click `index.html` to open in your default browser.

## 📖 Usage Examples

### Example 1: Encrypt Sensitive Data
1. Go to the **Decrypt** or **Encrypt** tab
2. Enter your secret key (will be saved locally)
3. Paste your plain text
4. Click **Encrypt** to get Base64-encoded output

### Example 2: Format Messy JSON
1. Go to **JSON Formatter** tab
2. Paste your minified or malformed JSON
3. Click **Format** to see a beautiful tree view
4. Use **Copy** to get properly formatted JSON

### Example 3: Generate API Schema
1. Go to **JSON to Schema** tab
2. Paste a sample JSON response from your API
3. Select your preferred schema version (Draft 2020-12 recommended)
4. Click **Generate Schema**
5. Copy the schema for use in OpenAPI, validation, or documentation

### Example 4: Compare JSON Objects
1. Go to **Compare JSON** tab
2. Paste two JSON objects in the side-by-side panels
3. Click **Compare** to see visual differences
4. Export the delta object if needed

## 🔒 Privacy & Security

**Your data never leaves your browser.** All operations are performed 100% client-side:

- ✅ **No Server Communication**: Zero network requests for data processing
- ✅ **No Analytics Tracking**: No Google Analytics, no user tracking
- ✅ **No Data Collection**: Nothing is logged or stored remotely
- ✅ **Open Source**: Full transparency—inspect the code yourself
- ✅ **Web Crypto API**: Uses browser-native cryptography (not custom implementations)

**⚠️ Important Notes:**
- Secret keys are stored in browser `localStorage` for convenience
- Clear your browser data to remove stored keys
- For highly sensitive data, always audit the source code first
- Use HTTPS when accessing the live demo for secure delivery

## 🌐 Browser Compatibility

| Browser | Minimum Version | Status |
|---------|----------------|--------|
| Chrome | 60+ | ✅ Fully Supported |
| Edge | 79+ | ✅ Fully Supported |
| Firefox | 60+ | ✅ Fully Supported |
| Safari | 13+ | ✅ Fully Supported |
| Opera | 47+ | ✅ Fully Supported |

**Requirements:** Modern browser with ES6+ and Web Crypto API support

## 📦 Tech Stack

All dependencies are loaded via CDN for zero-setup experience:

| Library | Version | Purpose |
|---------|---------|---------|
| [Bootstrap](https://getbootstrap.com/) | 4.5 | UI framework and responsive design |
| [jQuery](https://jquery.com/) | 3.5 | DOM manipulation and utilities |
| [jquery.json-viewer](https://github.com/abodelot/jquery.json-viewer) | Latest | Interactive JSON tree visualization |
| [jsondiffpatch](https://github.com/benjamine/jsondiffpatch) | Latest | JSON comparison and diffing |
| [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) | Native | Browser-native encryption (AES-CBC 256) |

**No Build Process Required** — Pure HTML/CSS/JavaScript with CDN dependencies

## 📂 Project Structure

```
📦 Dev-Toolkit
├── 📄 index.html                    # Single-page application (HTML, CSS, JS)
├── 📄 README.md                     # Project documentation (this file)
├── 📄 FEATURE-DOCUMENTATION.md      # Detailed feature documentation
├── 🖼️ favicon.ico                   # Browser favicon
└── 📄 LICENSE                       # MIT License (optional)
```

## 🎯 Use Cases

### For Frontend Developers
- Quick JSON formatting during debugging
- Generate schemas for TypeScript interfaces
- Compare API responses across versions
- Validate JSON structure before sending

### For Backend Developers
- Generate JSON Schema for API documentation
- Create OpenAPI specifications from sample data
- Test encryption/decryption workflows
- Debug JSON payloads from logs

### For DevOps Engineers
- Compare configuration files (JSON format)
- Validate config structure against schemas
- Encrypt/decrypt sensitive configuration values
- Quick diff of deployment manifests

### For API Designers
- Generate schemas from example responses
- Document request/response formats
- Validate JSON against business rules
- Create contract tests

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Report Bugs**: Open an issue describing the bug and steps to reproduce
2. **Suggest Features**: Share ideas for new tools or improvements
3. **Submit Pull Requests**: Fork, create a feature branch, and submit PR
4. **Improve Documentation**: Help make docs clearer and more comprehensive
5. **Share**: Star ⭐ the repo and share with fellow developers

### Development Guidelines
- Follow existing code patterns and conventions
- Maintain the single-file architecture for simplicity
- Ensure dark mode compatibility for all UI changes
- Test across major browsers (Chrome, Firefox, Edge, Safari)
- Keep dependencies to a minimum
- Add descriptive comments for complex logic

## 🐛 Known Issues

- Large JSON files (>10MB) may cause performance issues in the browser
- Some very old browsers may not support Web Crypto API

## 🗺️ Roadmap

Future enhancements under consideration:

- [ ] **XML to JSON** converter
- [ ] **Base64 Encode/Decode** utility
- [ ] **JWT Decoder** with signature verification
- [ ] **Regex Tester** with syntax highlighting
- [ ] **Hash Generator** (MD5, SHA-256, SHA-512)
- [ ] **URL Encoder/Decoder**
- [ ] **Color Picker** and converter
- [ ] **Markdown Preview**
- [ ] **CSV to JSON** converter
- [ ] **Export/Import** tool configurations
- [ ] **Keyboard Shortcuts** for power users

Vote for features by creating or 👍 issues!

## 📜 License

This project is licensed under the **MIT License** - free to use, modify, and distribute.

```
MIT License - Copyright (c) 2025 Dev Toolkit Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software.
```

## 💖 Acknowledgments

- Built with ❤️ by [Adarsh Jambhulkar](https://github.com/adarshjambhulkar)
- Inspired by the developer community's need for privacy-focused tools
- Thanks to all open-source library maintainers
- JSON Schema specification by [json-schema.org](https://json-schema.org/)

## 📞 Support

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/adarshjambhulkar/Dev-Toolkit/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/adarshjambhulkar/Dev-Toolkit/discussions)
- ⭐ **Star the Repo**: Show your support!

---

<div align="center">

**[⬆ Back to Top](#-dev-toolkit)**

Made with ❤️ for developers, by developers

[![GitHub](https://img.shields.io/badge/GitHub-adarshjambhulkar-181717?style=flat-square&logo=github)](https://github.com/adarshjambhulkar)

</div>
