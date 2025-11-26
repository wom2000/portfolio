import { useState, useEffect } from 'react';

export default function MakeOrder({ onSuccess, onCancel }) {
  const [menuItems, setMenuItems] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3000/menu")
      .then(response => response.json())
      .then(data => {
        setMenuItems(data);
      })
      .catch(err => {
        console.error('Erro ao carregar menu:', err);
      });
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    setError('');

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    const order = {
      itemName: data.item,
      quantity: parseInt(data.quantity),
      status: 'pending',
      timestamp: new Date().toISOString()
    };

    fetch("http://localhost:3000/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    })
      .then(response => response.json())
      .then(result => {
        console.log('Pedido criado:', result);
        setSuccess(true);
        event.target.reset();
        setTimeout(() => onSuccess(), 2000);
      })
      .catch(err => {
        console.error('Erro:', err);
        setError('Erro ao criar pedido.');
      });
  }

  return (
    <div className="make-order">
      <h2>Make Order</h2>

      {success && <p className="success">Order placed successfully!</p>}
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="item">Menu Item:</label>
          <select id="item" name="item" required>
            <option value="">Select an item...</option>
            {menuItems.map((item, index) => (
              <option key={index} value={item.name}>
                {item.name} ({item.category}) - {item.description}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="quantity">Quantity:</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            min="1"
            defaultValue="1"
            required
          />
        </div>

        <button type="submit">Place Order</button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </form>
    </div>
  );
}