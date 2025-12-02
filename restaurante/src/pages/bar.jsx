
import AddMenuItem from '../components/addItem';
import { useState} from 'react';
 
export default function Bar() {
  const [showAddForm, setShowAddForm] = useState(true);



  return (
    <div>
      <h1>Bar Area</h1>


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