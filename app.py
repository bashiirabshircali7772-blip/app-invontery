from flask import Flask, render_template, request, redirect, url_for, flash
import json
import os

app = Flask(__name__)
app.secret_key = 'inventory-secret-key'
DATA_FILE = 'inventory.json'
DEFAULT_STATUSES = ['Available', 'Running Low', 'Out of Stock']


def load_inventory():
    if not os.path.exists(DATA_FILE):
        save_inventory([])
    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)


def save_inventory(items):
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(items, f, indent=2, ensure_ascii=False)


def find_item(items, item_id):
    return next((item for item in items if item['id'] == item_id), None)


@app.route('/')
def home():
    items = load_inventory()
    return render_template('index.html', items=items, statuses=DEFAULT_STATUSES)


@app.route('/create', methods=['POST'])
def create_item():
    items = load_inventory()
    name = request.form.get('name', '').strip()
    quantity = request.form.get('quantity', '0').strip()
    status = request.form.get('status', 'Available').strip()
    action = request.form.get('action', '').strip()

    if not name:
        flash('Fadlan geli magaca alaabta.', 'error')
        return redirect(url_for('home'))

    try:
        quantity = int(quantity)
    except ValueError:
        quantity = 0

    new_id = max((item['id'] for item in items), default=0) + 1
    items.append({
        'id': new_id,
        'name': name,
        'quantity': quantity,
        'status': status,
        'action': action,
    })
    save_inventory(items)
    flash('Alaabta waa lagu daray inventory-ga.', 'success')
    return redirect(url_for('home'))


@app.route('/update/<int:item_id>', methods=['POST'])
def update_item(item_id):
    items = load_inventory()
    item = find_item(items, item_id)
    if not item:
        flash('Alaabta lama helin.', 'error')
        return redirect(url_for('home'))

    item['name'] = request.form.get(
        'name', item['name']).strip() or item['name']
    item['action'] = request.form.get('action', item['action']).strip()
    item['status'] = request.form.get('status', item['status']).strip()

    quantity = request.form.get('quantity', item['quantity'])
    try:
        item['quantity'] = int(quantity)
    except ValueError:
        item['quantity'] = item['quantity']

    save_inventory(items)
    flash('Alaabta waa la cusbooneysiiyay.', 'success')
    return redirect(url_for('home'))


@app.route('/delete/<int:item_id>', methods=['POST'])
def delete_item(item_id):
    items = load_inventory()
    items = [item for item in items if item['id'] != item_id]
    save_inventory(items)
    flash('Alaabta waa la tirtiray.', 'success')
    return redirect(url_for('home'))


@app.route('/status/<int:item_id>', methods=['POST'])
def change_status(item_id):
    items = load_inventory()
    item = find_item(items, item_id)
    if item:
        item['status'] = request.form.get('status', item['status']).strip()
        save_inventory(items)
        flash('Status-ka alaabta waa la cusbooneysiiyay.', 'success')
    return redirect(url_for('home'))


if __name__ == '__main__':
    app.run(debug=True, port=5000),
