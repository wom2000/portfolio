// Client.jsx
import { useState } from 'react';
import MakeOrder from '../components/MakeOrder';
 
export default function Client() {
  const [showOrderForm, setShowOrderForm] = useState(true);

  return (
    <div>
      <h1>Client Area</h1>

      {showOrderForm && (
        <MakeOrder 
          onSuccess={() => setShowOrderForm(true)}
          onCancel={() => setShowOrderForm(false)}
        />
      )}
    </div>
  );
}