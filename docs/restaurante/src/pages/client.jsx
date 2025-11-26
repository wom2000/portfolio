// Client.jsx
import { useState } from 'react';
import MakeOrder from '../components/MakeOrder';
 
export default function Client() {
  const [showOrderForm, setShowOrderForm] = useState(false);

  return (
    <div>
      <h1>Client Area</h1>
      
      <button onClick={() => setShowOrderForm(true)}>
        Make New Order
      </button>

      {showOrderForm && (
        <MakeOrder 
          onSuccess={() => setShowOrderForm(false)}
          onCancel={() => setShowOrderForm(false)}
        />
      )}
    </div>
  );
}