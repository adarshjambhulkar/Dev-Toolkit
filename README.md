# Dev Toolkit

[Live Demo](https://adarshjambhulkar.github.io/Dev-Toolkit/) ↗️

Dev Toolkit is a lightweight, single-page web utility that bundles several everyday developer tools into one convenient interface.

## Features

| Tool                                    | Description                                                                                                                                                                           |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **AES-CBC 256 Encryption / Decryption** | Encrypt or decrypt text entirely in the browser using the Web Crypto API. An IV is generated automatically and prepended to the ciphertext (Base-64).                                 |
| **JSON Formatter**                      | • Pretty-print JSON as an expandable/collapsible tree.<br>• _Stringify_ produces a minified, escaped JSON string literal.<br>• Copy buttons for both formatted and stringified views. |
| **JSON Compare**                        | Visual diff of two JSON objects via `jsondiffpatch`; additions, removals, and modifications are color-coded. Copy the raw delta if required.                                          |
| **Dark / Light Mode**                   | Toggle theme; preference saved in `localStorage`.                                                                                                                                     |
| **Persistent Secret Key**               | AES secret key is stored locally so you don't need to retype it.                                                                                                                      |
| **Toast Notifications**                 | Non-blocking Bootstrap toasts for all user feedback.                                                                                                                                  |

## Getting Started

No build tools or servers are necessary—everything runs client-side.

1. Clone or download this repository.
2. Open `index.html` in a modern browser (Chrome, Edge, Firefox).

```powershell
# Windows example
double-click index.html

# OR via PowerShell
Start-Process index.html
```

## Security Notice

All processing (encryption, diffing) is performed locally and nothing is transmitted over the network. Still, inspect the code before using the toolkit with highly sensitive data.

## External Dependencies (via CDN)

- Bootstrap 4.5
- jQuery 3.5
- jquery.json-viewer
- jsondiffpatch

## File Structure

```
📦 Dev-Toolkit
├── index.html   # Main SPA containing HTML, CSS & JS
└── README.md    # Project documentation
```

## License

MIT — free to use, modify, and distribute.
