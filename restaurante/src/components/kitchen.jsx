import { useEffect, useState } from "react";

export default function Kitchen() {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch("http://localhost:3000/orders")
            .then((res) => res.json())
            .then((data) => setOrders(data))
            .catch(() => setError("Erro ao buscar pedidos"));
    }, []);

    function markInProgress(timestamp) {
        fetch(`http://localhost:3000/orders/${timestamp}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "em confeção" }),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Erro ao atualizar estado");
                setOrders(prev =>
                    prev.map(order =>
                        order.timestamp === timestamp
                            ? { ...order, status: "em confeção" }
                            : order
                    )
                );
            })
            .catch(() => setError("Erro ao atualizar estado"));
    }

    function completeOrder(timestamp) {
        fetch(`http://localhost:3000/orders/${timestamp}`, {
            method: "DELETE",
        })
            .then(res => {
                if (!res.ok) throw new Error("Erro ao remover pedido");
                setOrders(prev => prev.filter(order => order.timestamp !== timestamp));
            })
            .catch(() => setError("Erro ao remover pedido"));
    }


    return (
        <div>
            <h2>Pedidos da Cozinha</h2>
            {error && <p>{error}</p>}
            {orders.length === 0 && <p>Nenhum pedido disponível</p>}
            <ul>
                {orders.map((order) => (
                    <li key={order.timestamp}>
                        <p>Cliente: {order.name}</p>
                        <p>Hora: {new Date(order.timestamp).toLocaleTimeString()}</p>
                        <p>Status: {order.status}</p>
                        <p>Itens:</p>
                        <ul>
                            {order.items.map((item, index) => (
                                <li key={index}>
                                    {item.name} ({item.category})
                                </li>
                            ))}
                        </ul>
                        {order.status === "pending" && (
                            <button onClick={() => markInProgress(order.timestamp)}>
                                Em Confeção
                            </button>
                        )}
                        {order.status === "em confeção" && (
                            <button onClick={() => completeOrder(order.timestamp)}>
                                Concluído
                            </button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
