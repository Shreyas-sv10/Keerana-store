// ========== LOGIN SYSTEM ==========
const loginPage = document.getElementById("login-page");
const dashboard = document.getElementById("dashboard");
const logoutBtn = document.getElementById("logout-btn");

// Dummy credentials
const USERNAME = "admin";
const PASSWORD = "1234";

document.getElementById("login-form").addEventListener("submit", (e) => {
  e.preventDefault();
  let user = document.getElementById("username").value;
  let pass = document.getElementById("password").value;

  if (user === USERNAME && pass === PASSWORD) {
    alert("Login Successful ✅");
    loginPage.classList.add("hidden");
    dashboard.classList.remove("hidden");
    logoutBtn.classList.remove("hidden");
    document.getElementById("user-name").innerText = user;
    updateStats();
  } else {
    alert("Invalid Credentials ❌");
  }
});

logoutBtn.addEventListener("click", () => {
  loginPage.classList.remove("hidden");
  dashboard.classList.add("hidden");
  logoutBtn.classList.add("hidden");
});

// ========== DATA STORAGE ==========
let items = JSON.parse(localStorage.getItem("items")) || [];
let records = JSON.parse(localStorage.getItem("records")) || [];

// Save data to localStorage
function saveData() {
  localStorage.setItem("items", JSON.stringify(items));
  localStorage.setItem("records", JSON.stringify(records));
}

// ========== ADMIN PANEL ==========
const itemForm = document.getElementById("item-form");
const itemsTable = document.getElementById("items-table");
const billItemSelect = document.getElementById("bill-item");

itemForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let name = document.getElementById("item-name").value.trim();
  let price = parseFloat(document.getElementById("item-price").value);

  if (name && price > 0) {
    let existing = items.find((it) => it.name.toLowerCase() === name.toLowerCase());
    if (existing) {
      existing.price = price;
      alert("Item Updated ✅");
    } else {
      items.push({ name, price });
      alert("Item Added ✅");
    }
    saveData();
    renderItems();
    itemForm.reset();
    updateStats();
  }
});

// Render items in table + billing dropdown
function renderItems() {
  itemsTable.innerHTML = "";
  billItemSelect.innerHTML = `<option value="">-- Select Item --</option>`;
  items.forEach((item, index) => {
    itemsTable.innerHTML += `
      <tr>
        <td>${item.name}</td>
        <td>₹${item.price}</td>
        <td><button onclick="deleteItem(${index})">Delete</button></td>
      </tr>
    `;
    billItemSelect.innerHTML += `<option value="${item.name}">${item.name} - ₹${item.price}/Kg</option>`;
  });
}
function deleteItem(index) {
  if (confirm("Are you sure to delete this item?")) {
    items.splice(index, 1);
    saveData();
    renderItems();
    updateStats();
  }
}

// ========== BILLING ==========
const billForm = document.getElementById("bill-form");
const billOutput = document.getElementById("bill-output");

billForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let buyer = document.getElementById("buyer-name").value.trim();
  let itemName = document.getElementById("bill-item").value;
  let qty = parseFloat(document.getElementById("bill-quantity").value);

  if (!buyer || !itemName || qty <= 0) {
    alert("Please fill all fields correctly ❌");
    return;
  }

  let item = items.find((it) => it.name === itemName);
  let total = item.price * qty;
  let date = new Date().toLocaleString();

  // Show Bill
  billOutput.innerHTML = `
    <h3>Bill Generated ✅</h3>
    <p><strong>Buyer:</strong> ${buyer}</p>
    <p><strong>Item:</strong> ${itemName}</p>
    <p><strong>Quantity:</strong> ${qty} Kg</p>
    <p><strong>Total:</strong> ₹${total.toFixed(2)}</p>
    <p><em>${date}</em></p>
  `;

  // Save record
  records.push({ buyer, item: itemName, qty, total, date });
  saveData();
  updateStats();
});

// ========== RECORDS ==========
const searchInput = document.getElementById("search-buyer");
const searchBtn = document.getElementById("search-btn");
const recordsTable = document.getElementById("records-table");

searchBtn.addEventListener("click", () => {
  let query = searchInput.value.trim().toLowerCase();
  renderRecords(query);
});

function renderRecords(query = "") {
  recordsTable.innerHTML = "";
  records
    .filter((rec) => rec.buyer.toLowerCase().includes(query))
    .forEach((rec) => {
      recordsTable.innerHTML += `
        <tr>
          <td>${rec.buyer}</td>
          <td>${rec.item}</td>
          <td>${rec.qty} Kg</td>
          <td>₹${rec.total.toFixed(2)}</td>
          <td>${rec.date}</td>
        </tr>
      `;
    });
}

// ========== DASHBOARD STATS ==========
function updateStats() {
  document.getElementById("total-items").innerText = items.length;
  document.getElementById("total-customers").innerText = new Set(records.map(r => r.buyer)).size;
  document.getElementById("total-bills").innerText = records.length;
  let revenue = records.reduce((sum, r) => sum + r.total, 0);
  document.getElementById("total-revenue").innerText = "₹" + revenue.toFixed(2);
}

// Initial render on load
renderItems();
renderRecords();
updateStats();
