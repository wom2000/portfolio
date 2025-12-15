import Kitchen from '../components/kitchen';
import { useState } from 'react';

export default function KitchenPage() {
  const [showOrders, setShowOrders] = useState(true);

  return (
    <div>
      <h1>kitchen Area</h1>
      {showOrders && (
        <Kitchen
          onSuccess={() => {
            setShowOrders(true);
            fetchMenuItems();
          }}

        />
      )}
    </div>
  );
}
