import Kitchen from '../components/kitchen';
import { useState } from 'react';

export default function KitchenPage() {
 const [showOrders, setShowOrders] = useState(false);
 
   return (
     <div>
       <h1>kitchen Area</h1>
 
       <button onClick={() => setShowOrders(true)}>Show Orders
       </button>
 
       {showOrders && (
         <Kitchen
           onSuccess={() => {
             setShowOrders(false);
             fetchMenuItems();
           }}
           onCancel={() => setShowAddForm(false)}
         />
       )}
     </div>
   );
}
