import { useState, useEffect, useContext } from 'react';
import '../components/client.css'
import Menu from '../components/MakeOrder'
import { AuthContext } from '../contexts/AuthContext';

export default function MakeOrder({ onSuccess }) {
  const { user } = useContext(AuthContext);
  const [AvailableItems, setAvailableItems] = useState([]);
  const [userItems, setUserItems] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3000/menu')
      .then((response) => response.json())
      .then((resData) => {
        console.log('Menu recebido:', resData);
        setAvailableItems(resData.menu || resData);
      })
      .catch((error) => console.error('Erro ao buscar menu:', error));
  }, []);

  function handleSubmit() {
    if (userItems.length === 0) return;

    const order = {
      name: user?.name,
      timestamp: new Date().toISOString(),
      items: userItems,
      status: "pending"
    };

    fetch("http://localhost:3000/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    })
      .then(res => res.json())
      .then(() => {
        setSuccess(true);
        setUserItems([]);
      })
      .catch(() => setError("Erro ao enviar pedido"));
  }


  function handleSelectItem(selectedItem) {
    setUserItems((prevItems) => {
      if (!prevItems.some((item) => item.name === selectedItem.name)) {
        return [selectedItem, ...prevItems];
      }
      return prevItems;
    });
  }

  function handleRemoveItem(selectedItem) {
    setUserItems((prevItems) =>
      prevItems.filter((item) => item.name !== selectedItem.name)
    );
  }

  return (
    <>
      <main>
        <Menu
          title="Menu"
          menu={AvailableItems}
          fallbackText="No menu available"
          onSelectItem={handleSelectItem}
          selectedItems={userItems}
          buttonText="add"
        />

        <Menu
          title="Your Order"
          menu={userItems}
          fallbackText="Select items from the menu"
          onSelectItem={handleRemoveItem}
          selectedItems={[]}
          buttonText="remove"
        />

        {userItems.length > 0 && (
          <button onClick={handleSubmit}>Enviar Pedido</button>
        )}

        {error && <p>{error}</p>}
        {success && <p style={{ color: 'green' }}>Pedido enviado com sucesso!</p>}
      </main>
    </>
  );
}