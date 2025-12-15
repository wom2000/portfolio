import { useState} from 'react';
import './bar.css'

export default function AddMenuItem({ onSuccess, onCancel }) {

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setError('');

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    const menuItem = {
      name: data.name,
      category: data.category,
    };
    
    
    fetch("http://localhost:3000/menu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(menuItem),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao adicionar item');
        }
        return response.json();
      })
      .then(result => {
        setSuccess(true);
        event.target.reset();
        onSuccess();
      })
      .catch(error => {
        console.log('erro', error);
        setError('Erro ao adicionar item ao menu');
      });
  }
  function handleCancel(event) {
    event.target.form.reset();
    setError('');
    setSuccess(false);
    if (onCancel) {
      onCancel();
    }
  }
  return (
    <div className="add-menu-item">
      <h2>Add Item to Menu</h2>

      {success && <p className="success">Item add with success</p>}
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            required
          />
        </div>

        <div>
          <label htmlFor="category">Category:</label>
          <select id="category" name="category" required>
            <option value="">Select one</option>
            <option value="entry">Entry</option>
            <option value="main">Main Dish</option>
            <option value="dessert">Dessert</option>
          </select>
        </div>

        <button type="submit">Add Item</button>
        <button type="button" onClick={handleCancel}>
          Cancel
        </button>
      </form>
    </div>
  );
}