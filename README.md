# PayWave — Paytm-style Payment App UI Demo

A beginner-friendly payment app interface built with **HTML, CSS and vanilla JavaScript**. It is intended as a portfolio/learning project and is not affiliated with Paytm.

## Features

- Responsive desktop and mobile layout
- Demo wallet balance with hide/show control
- Recent contact shortcuts
- Simulated send-money flow with form validation and review step
- Demo transaction history
- Receive and scan/pay placeholder flows
- Reset demo state
- No framework or build tools required

## Run locally

1. Download or extract this folder.
2. Open `index.html` in Chrome, Edge, Firefox, or another modern browser.
3. Click **Send money**, choose a contact or enter a name, enter an amount, and confirm the demo payment.

No dependencies or installation are needed.

## Files

- `index.html` — page structure
- `style.css` — layout, colors, responsiveness and modal styling
- `script.js` — interactions, validation, simulated balance and transaction history

## Push to GitHub

1. Sign in to GitHub and create a new repository named `paywave-payment-app`.
2. In the repository, choose **Add file → Upload files**.
3. Upload `index.html`, `style.css`, `script.js`, and `README.md` from this folder.
4. Commit the changes.

Alternatively, use GitHub Desktop to publish the project folder.

## Important limitations

This is a **front-end-only simulation**:
- No real money is sent or received.
- No UPI, bank, payment gateway, or account login is connected.
- The QR graphic is decorative; camera scanning is not implemented.
- Data is stored only in the current page session and resets on refresh.
- Do not add real personal information, bank details, credentials, API keys, or private company code.

For a production payment product, use an authorized payment provider and a secure backend, follow applicable regulations, and never handle payment credentials directly in a demo front end.
