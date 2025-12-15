
import '../components/client.css'

export default function Menu({ title, menu, fallbackText, onSelectItem, selectedItems = [], buttonText = 'add' }) {
  const orderByCategory = (items) => {
    const groups = {};
    items.forEach(item => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push(item);
    });
    return groups;
  };

  const groupedMenu = menu ? orderByCategory(menu) : {};
  const order = ['entry', 'main', 'dessert'];
  return (
    <section className="menu">
      <h2>{title}</h2>
      {(!menu || menu.length === 0) && <p className="fallback-text">{fallbackText}</p>}
      {menu && menu.length > 0 && (
        <>
          {order.map(category => (
            groupedMenu[category] && groupedMenu[category].length > 0 && (
              <div key={category} className="categoria-grupo">
                <h3 className="categoria-titulo">{category}</h3>
                <ul className="orders">
                  {groupedMenu[category].map((item, index) => (
                    <li key={item.name || index} className="menu-item">

                      <h4>{item.name}</h4>
                      <button onClick={() => onSelectItem(item)}>
                        {buttonText}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )
          ))}
        </>
      )}
    </section>
  );
}