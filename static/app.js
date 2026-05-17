const STORAGE_KEY = 'inventoryAppItems';
const STATUSES = ['Available', 'Running Low', 'Out of Stock'];

const form = document.getElementById('item-form');
const nameInput = document.getElementById('name');
const quantityInput = document.getElementById('quantity');
const statusInput = document.getElementById('status');
const actionInput = document.getElementById('action');
const tableBody = document.getElementById('inventory-body');
const alertBox = document.getElementById('alert-box');

function loadItems() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveItems(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function showAlert(message, type = 'success') {
  alertBox.textContent = message;
  alertBox.className = `alert ${type}`;
  alertBox.style.display = 'block';
  setTimeout(() => {
    alertBox.style.display = 'none';
  }, 3000);
}

function createRow(item) {
  const row = document.createElement('tr');
  row.dataset.id = item.id;

  row.innerHTML = `
    <td>${item.id}</td>
    <td><input class="input-small name" value="${escapeHtml(item.name)}" /></td>
    <td><input type="number" min="0" class="input-small quantity" value="${item.quantity}" /></td>
    <td>
      <select class="select-small status">
        ${STATUSES.map(status => `<option value="${status}" ${status === item.status ? 'selected' : ''}>${status}</option>`).join('')}
      </select>
    </td>
    <td><input class="input-small action" value="${escapeHtml(item.action)}" placeholder="Action" /></td>
    <td class="actions"><button class="btn btn-success save">Save</button></td>
    <td class="actions"><button class="btn btn-delete delete">Delete</button></td>
  `;

  return row;
}

function renderItems() {
  const items = loadItems();
  tableBody.innerHTML = '';

  if (items.length === 0) {
    const emptyRow = document.createElement('tr');
    emptyRow.innerHTML = '<td colspan="7" class="empty-state">Ma jiraan alaabooyin hadda.</td>';
    tableBody.appendChild(emptyRow);
    return;
  }

  items.forEach(item => tableBody.appendChild(createRow(item)));
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function addItem(event) {
  event.preventDefault();

  const name = nameInput.value.trim();
  const quantity = Number(quantityInput.value);
  const status = statusInput.value;
  const action = actionInput.value.trim();

  if (!name) {
    showAlert('Fadlan geli magaca alaabta.', 'error');
    return;
  }

  const items = loadItems();
  const newId = items.length ? Math.max(...items.map(item => item.id)) + 1 : 1;

  items.push({
    id: newId,
    name,
    quantity: Number.isNaN(quantity) ? 0 : quantity,
    status,
    action,
  });

  saveItems(items);
  renderItems();
  form.reset();
  showAlert('Alaabta waa lagu daray inventory-ga.', 'success');
}

function updateItem(row) {
  const itemId = Number(row.dataset.id);
  const items = loadItems();
  const item = items.find(i => i.id === itemId);

  if (!item) {
    showAlert('Alaabta lama helin.', 'error');
    return;
  }

  item.name = row.querySelector('.name').value.trim() || item.name;
  item.quantity = Number(row.querySelector('.quantity').value) || 0;
  item.status = row.querySelector('.status').value;
  item.action = row.querySelector('.action').value.trim();

  saveItems(items);
  renderItems();
  showAlert('Alaabta waa la cusbooneysiiyay.', 'success');
}

function deleteItem(row) {
  const itemId = Number(row.dataset.id);
  const items = loadItems().filter(item => item.id !== itemId);
  saveItems(items);
  renderItems();
  showAlert('Alaabta waa la tirtiray.', 'success');
}

function handleTableClick(event) {
  const saveButton = event.target.closest('.save');
  const deleteButton = event.target.closest('.delete');

  if (saveButton) {
    const row = saveButton.closest('tr');
    updateItem(row);
  }

  if (deleteButton) {
    const row = deleteButton.closest('tr');
    deleteItem(row);
  }
}

function init() {
  STATUSES.forEach(status => {
    const option = document.createElement('option');
    option.value = status;
    option.textContent = status;
    statusInput.appendChild(option);
  });

  form.addEventListener('submit', addItem);
  tableBody.addEventListener('click', handleTableClick);
  renderItems();
}

init();
