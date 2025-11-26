import { useState, useEffect } from 'react';

export default function Kitchen() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    fetch("http://localhost:3000/orders")
      .then(response => response.json())
      .then(data => setOrders(data))
      .catch(err => console.error('Erro:', err));
  };

  const displayTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('pt-PT', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
const markAsReady = (timestamp) => {
  fetch(`http://localhost:3000/orders/${timestamp}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  })
    .then(response => response.json())
    .then(result => {fetchOrders()})
    .catch(err => console.error('Erro:', err));
};

  const pendingOrders = orders.filter(order => order.status === 'pending');

  return (
    <div>

      
      {pendingOrders.length === 0 && <p>No pending orders!</p>}

      <div className="orders-list">
        {pendingOrders.map((order) => (
  <div key={order.timestamp} className="order-card">
            <h3>{order.itemName}</h3>
            <p>Quantity: {order.quantity}</p>
            <p>Time: {displayTime(order.timestamp)}</p>
            <p className="status">Status: {order.status}</p>
            <button onClick={() => markAsReady(order.timestamp)}> Mark as Ready </button>
          </div>
        ))}
      </div>
    </div>
  );
}