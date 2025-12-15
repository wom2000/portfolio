import express from "express";
import bodyParser from "body-parser";
import fs from "node:fs/promises";

const app = express();

app.use(express.static("./images"));
app.use(bodyParser.json());


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

//rota de registo
app.post("/signup", async (req, res) => {
  const fileContent = await fs.readFile("./data/users.json");
  const users = JSON.parse(fileContent);

  const newUser = req.body;
  users.push(newUser);

  await fs.writeFile("./data/users.json", JSON.stringify(users, null, 2));
  res.status(200).json({ message: "User Inserted!" });
});



//rota de login
app.post("/login", async (req, res) => {
  const fileContent = await fs.readFile("./data/users.json");
  const users = JSON.parse(fileContent);

  const email = req.body.email;
  const password = req.body.password;

  const login = users.find((u) => u.email === email && u.password === password);

  if (!login) {
    return res.status(422).json({
      message: "Invalid credentials.",
      errors: { credentials: "Invalid email or password entered." },
    });
  }


  const AuthUser = {
    name: login.name,
    role: login.role,
  };

  res.json(AuthUser);
});
app.get("/menu", async (req, res) => {
  const fileContent = await fs.readFile("./data/menu.json");
  const menuItems = JSON.parse(fileContent);
  res.json(menuItems);
});

//rota de menu 
app.post("/menu", async (req, res) => {
  const fileContent = await fs.readFile("./data/menu.json");
  const menuItems = JSON.parse(fileContent);

  const newMenuItem = req.body;
  menuItems.push(newMenuItem);

  await fs.writeFile("./data/menu.json", JSON.stringify(menuItems, null, 2));
  res.status(200).json({ message: "Menu item inserted!" });
});

//rota de pedidos
app.get("/orders", async (req, res) => {
  const fileContent = await fs.readFile("./data/orders.json");
  const orders = JSON.parse(fileContent);
  res.json(orders);
});
app.post("/orders", async (req, res) => {
  const fileContent = await fs.readFile("./data/orders.json");
  const orders = JSON.parse(fileContent);

  const newOrder = req.body;
  orders.push(newOrder);

  await fs.writeFile("./data/orders.json", JSON.stringify(orders, null, 2));
  res.status(200).json({ message: "Order inserted!" });
});

app.put("/orders/:timestamp", async (req, res) => {
  const fileContent = await fs.readFile("./data/orders.json");
  const orders = JSON.parse(fileContent);

  const timestamp = req.params.timestamp;
const order = orders.find(order => order.timestamp === timestamp);

if (order) {
  order.status = req.body.status;
  await fs.writeFile("./data/orders.json", JSON.stringify(orders, null, 2));
  res.status(200).json({ message: "Order updated!" });
} else {
  res.status(404).json({ message: "Order not found" });
}
});
app.delete("/orders/:timestamp", async (req, res) => {
  const fileContent = await fs.readFile("./data/orders.json");
  let orders = JSON.parse(fileContent);

  const timestamp = req.params.timestamp;

  const index = orders.findIndex(order => order.timestamp === timestamp);

  if (index !== -1) {
    orders.splice(index, 1);
    await fs.writeFile("./data/orders.json", JSON.stringify(orders, null, 2));
    res.status(200).json({ message: "Order removed!" });
  } else {
    res.status(404).json({ message: "Order not found" });
  }
});

app.use((req, res) => {
  res.status(404).json({ message: "404 - Not Found" });
});

app.listen(3000);
