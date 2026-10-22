/* PayWave demo — all money movement is simulated in the browser. */
const startingBalance = 12450;
let balance = startingBalance;
let balanceVisible = true;
let transactions = [
  { name: "Priya Reddy", note: "Lunch split", amount: 250, type: "debit", time: "Today, 12:42 PM", status: "Demo successful" },
  { name: "Monthly savings", note: "Added to wallet", amount: 1500, type: "credit", time: "Yesterday, 8:15 PM", status: "Demo successful" },
  { name: "Aarav Sharma", note: "Movie tickets", amount: 420, type: "debit", time: "Yesterday, 6:30 PM", status: "Demo successful" }
];

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);
const rupees = (value) => new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);

function renderBalance() {
  $("#balance").textContent = balanceVisible ? rupees(balance) : "••••••";
  $("#toggle-balance").textContent = balanceVisible ? "◉" : "◎";
  $("#toggle-balance").setAttribute("aria-label", balanceVisible ? "Hide balance" : "Show balance");
}

function renderTransactions() {
  const list = $("#transaction-list");
  if (!transactions.length) {
    list.innerHTML = '<div class="empty-state">No transactions yet. Try a demo payment to see it here.</div>';
    return;
  }
  list.innerHTML = transactions.map((tx) => `
    <article class="transaction">
      <div class="tx-icon" aria-hidden="true">${tx.type === "credit" ? "↓" : "↗"}</div>
      <div class="tx-details">
        <div class="tx-name">${escapeHTML(tx.name)}</div>
        <div class="tx-meta">${escapeHTML(tx.note)} · ${escapeHTML(tx.time)}</div>
      </div>
      <div class="tx-amount ${tx.type}">${tx.type === "credit" ? "+" : "−"}₹${rupees(tx.amount)}<span class="tx-status">${escapeHTML(tx.status)}</span></div>
    </article>`).join("");
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => toast.classList.remove("show"), 2600);
}

function openModal(content) {
  $("#modal-content").innerHTML = content;
  $("#modal-backdrop").hidden = false;
  document.body.style.overflow = "hidden";
  const firstInput = $("#modal-content input");
  if (firstInput) setTimeout(() => firstInput.focus(), 30);
}
function closeModal() {
  $("#modal-backdrop").hidden = true;
  document.body.style.overflow = "";
}
$("#modal-close").addEventListener("click", closeModal);
$("#modal-backdrop").addEventListener("click", (event) => {
  if (event.target === $("#modal-backdrop")) closeModal();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !$("#modal-backdrop").hidden) closeModal();
});

function showSendForm(prefill = "") {
  openModal(`
    <p class="eyebrow">PAYWAVE · DEMO</p>
    <h2 id="modal-title">Send money</h2>
    <p class="modal-copy">Try a simulated payment. No money will be transferred.</p>
    <form id="send-form">
      <div class="field"><label for="recipient">Recipient name</label><input id="recipient" name="recipient" maxlength="60" placeholder="e.g. Priya Reddy" value="${escapeHTML(prefill)}" required /></div>
      <div class="field"><label for="amount">Amount (₹)</label><input id="amount" name="amount" type="number" min="1" max="50000" step="1" placeholder="Enter amount" required /></div>
      <div class="demo-notice">Demo wallet balance: ₹${rupees(balance)}. The demo allows payments up to ₹50,000.</div>
      <button class="primary-button" type="submit">Review payment</button>
    </form>`);
  $("#send-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const recipient = $("#recipient").value.trim();
    const amount = Number($("#amount").value);
    if (!recipient) return showToast("Enter a recipient name.");
    if (!Number.isFinite(amount) || amount <= 0 || amount > 50000) return showToast("Enter an amount from ₹1 to ₹50,000.");
    if (amount > balance) return showToast("Insufficient demo wallet balance.");
    showPaymentReview(recipient, amount);
  });
}

function showPaymentReview(recipient, amount) {
  openModal(`
    <p class="eyebrow">PLEASE REVIEW</p>
    <h2 id="modal-title">Confirm demo payment</h2>
    <p class="modal-copy">Check the details before simulating this payment.</p>
    <div class="amount-preview">₹${rupees(amount)}</div>
    <p><strong>To:</strong> ${escapeHTML(recipient)}</p>
    <p><strong>From:</strong> PayWave demo wallet</p>
    <div class="demo-notice">This is a local simulation. It does not send real money or contact a bank.</div>
    <button class="primary-button" id="confirm-payment">Confirm demo payment</button>
    <button class="secondary-button" id="back-to-form" style="margin-top:10px">Go back</button>`);
  $("#confirm-payment").addEventListener("click", () => {
    balance = Math.round((balance - amount) * 100) / 100;
    transactions.unshift({
      name: recipient, note: "Demo payment", amount, type: "debit",
      time: new Date().toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }),
      status: "Demo successful"
    });
    renderBalance();
    renderTransactions();
    showPaymentSuccess(recipient, amount);
  });
  $("#back-to-form").addEventListener("click", () => showSendForm(recipient));
}

function showPaymentSuccess(recipient, amount) {
  openModal(`
    <div class="success-content">
      <div class="success-mark">✓</div>
      <p class="eyebrow">DEMO TRANSACTION COMPLETE</p>
      <h2 id="modal-title">Payment simulated!</h2>
      <div class="amount-preview">₹${rupees(amount)}</div>
      <p class="modal-copy">A demo payment to <strong>${escapeHTML(recipient)}</strong> has been added to your transaction history. No real money moved.</p>
      <button class="primary-button" id="done-button">Done</button>
    </div>`);
  $("#done-button").addEventListener("click", closeModal);
}

function showReceive() {
  openModal(`
    <p class="eyebrow">PAYWAVE · DEMO</p><h2 id="modal-title">Receive money</h2>
    <p class="modal-copy">This sample QR graphic is decorative only and cannot receive payments.</p>
    <div class="qr-demo" aria-label="Decorative demo QR graphic"><span>DEMO ONLY</span></div>
    <p style="text-align:center;font-weight:750">Mounika · paywave.demo</p>
    <div class="demo-notice">For your portfolio: real QR/UPI receiving would require a regulated payment provider and secure backend integration.</div>
    <button class="primary-button" id="receive-done">Got it</button>`);
  $("#receive-done").addEventListener("click", closeModal);
}

function showScan() {
  openModal(`
    <p class="eyebrow">PAYWAVE · DEMO</p><h2 id="modal-title">Scan & pay</h2>
    <p class="modal-copy">Camera scanning is not connected in this front-end demo.</p>
    <div class="qr-demo" aria-label="Illustrative scan area"><span>SCAN DEMO</span></div>
    <div class="demo-notice">No camera is opened and no QR code is processed. Use Send money to try the simulated payment flow.</div>
    <button class="primary-button" id="scan-send">Try a demo payment</button>`);
  $("#scan-send").addEventListener("click", () => showSendForm());
}

function showFeatures() {
  openModal(`
    <p class="eyebrow">PROJECT FEATURES</p><h2 id="modal-title">Explore PayWave</h2>
    <p class="modal-copy">This portfolio project demonstrates responsive UI, DOM manipulation, form validation, a mock payment flow, transaction rendering and safe HTML output.</p>
    <ul style="color:#526176;font-size:12px;line-height:2;padding-left:19px">
      <li>Responsive desktop and mobile layout</li>
      <li>Balance hide/show control</li>
      <li>Contact shortcuts</li>
      <li>Payment review and confirmation</li>
      <li>Live transaction history in the current session</li>
    </ul>
    <div class="demo-notice">Refreshing the page resets the demo data. Do not use real account or payment details.</div>
    <button class="primary-button" id="features-done">Close</button>`);
  $("#features-done").addEventListener("click", closeModal);
}

function handleAction(action) {
  if (action === "send") return showSendForm();
  if (action === "receive") return showReceive();
  if (action === "scan") return showScan();
  if (action === "history") {
    $("#transactions-section").scrollIntoView({ behavior: "smooth", block: "start" });
    showToast("Showing recent demo transactions.");
  }
}

$$("[data-action]").forEach((button) => button.addEventListener("click", () => handleAction(button.dataset.action)));
$$(".contact").forEach((button) => button.addEventListener("click", () => showSendForm(button.dataset.name)));
$("#toggle-balance").addEventListener("click", () => { balanceVisible = !balanceVisible; renderBalance(); });
$("#learn-more").addEventListener("click", showFeatures);
$("#all-contacts").addEventListener("click", () => showToast("All demo contacts are shown here."));
$("#clear-history").addEventListener("click", () => {
  balance = startingBalance;
  transactions = [];
  balanceVisible = true;
  renderBalance();
  renderTransactions();
  showToast("Demo reset. Starting balance restored.");
});
$$("[data-nav='home']").forEach((button) => button.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" })));

$("#today-label").textContent = new Date().toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric" }).toUpperCase();
renderBalance();
renderTransactions();
