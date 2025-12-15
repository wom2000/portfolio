import AddMenuItem from '../components/addItem';
import { useState, useEffect } from 'react';

export default function Bar() {
  const [showAddForm, setShowAddForm] = useState(true);
  const [menuItems, setMenuItems] = useState([]);

  const fetchMenuItems = () => {
    fetch('http://localhost:3000/menu')
    .then(response => response.json())
    .then(menu => {
      setMenuItems(menu);
    }) 
    .catch (error => {
      console.error('Erro ao carregar menu:', error);
    })
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const entries = menuItems.filter(item => item.category === 'entry');
  const mains = menuItems.filter(item => item.category === 'main');
  const desserts = menuItems.filter(item => item.category === 'dessert');

  return (
    <div>
      <h1>Bar Area</h1>

      {showAddForm && (
        <AddMenuItem
          onSuccess={() => {
            setShowAddForm(true);
            fetchMenuItems();
          }}
          onCancel={() => setShowAddForm(true)}
        />
      )}

      <h2>Menu Items</h2>

      <h3>Entries</h3>
      <ul>
        {entries.length > 0 ? (
          entries.map(item => (
            <li key={item.id}>{item.name}</li>
          ))
        ) : (
          <li>No entries</li>
        )}
      </ul>

      <h3>Main Dishes</h3>
      <ul>
        {mains.length > 0 ? (
          mains.map(item => (
            <li key={item.id}>{item.name}</li>
          ))
        ) : (
          <li>No main dishes</li>
        )}
      </ul>

      <h3>Desserts</h3>
      <ul>
        {desserts.length > 0 ? (
          desserts.map(item => (
            <li key={item.id}>{item.name}</li>
          ))
        ) : (
          <li>No desserts</li>
        )}
      </ul>
    </div>
  );
}