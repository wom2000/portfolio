
import AddMenuItem from '../components/addItem';
import { useState} from 'react';
 
export default function Bar() {
  const [showAddForm, setShowAddForm] = useState(false);



  return (
    <div>
      <h1>Bar Area</h1>

      <button onClick={() => setShowAddForm(true)}>Add Item
      </button>

      {showAddForm && (
        <AddMenuItem
          onSuccess={() => {
            setShowAddForm(false);
            fetchMenuItems();
          }}
          onCancel={() => setShowAddForm(false)}
        />
      )}
    </div>
  );
}