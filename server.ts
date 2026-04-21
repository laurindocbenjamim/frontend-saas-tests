import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, "db.json");

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Helper functions for DB access
  const readDB = () => {
    try {
      const data = fs.readFileSync(DB_PATH, "utf-8");
      return JSON.parse(data);
    } catch (e) {
      return { users: [], logs: [], products: [], services: [], irs_submissions: [] };
    }
  };

  const writeDB = (data: any) => {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  };

  // API Routes
  app.get("/api/users", (req, res) => {
    const db = readDB();
    res.json(db.users);
  });

  app.post("/api/users", (req, res) => {
    const db = readDB();
    const { email } = req.body;
    
    // Check if email already exists
    if (db.users.some((u: any) => u.email.toLowerCase() === email.toLowerCase())) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const newUser = { ...req.body, id: Date.now().toString() };
    db.users.push(newUser);
    writeDB(db);
    res.status(201).json(newUser);
  });

  app.patch("/api/users/:id", (req, res) => {
    const { id } = req.params;
    const db = readDB();
    const index = db.users.findIndex((u: any) => u.id === id);
    
    if (index === -1) {
      return res.status(404).json({ error: "User not found" });
    }

    const { email } = req.body;
    if (email && db.users.some((u: any) => u.email.toLowerCase() === email.toLowerCase() && u.id !== id)) {
      return res.status(400).json({ error: "Email already in use" });
    }

    db.users[index] = { ...db.users[index], ...req.body };
    writeDB(db);
    res.json(db.users[index]);
  });

  app.delete("/api/users/:id", (req, res) => {
    const { id } = req.params;
    const db = readDB();
    const initialLength = db.users.length;
    db.users = db.users.filter((u: any) => u.id !== id);
    
    if (db.users.length === initialLength) {
      return res.status(404).json({ error: "User not found" });
    }

    writeDB(db);
    res.status(204).send();
  });

  app.get("/api/logs", (req, res) => {
    const db = readDB();
    res.json(db.logs);
  });

  app.post("/api/logs", (req, res) => {
    const db = readDB();
    const newLog = { ...req.body, id: Date.now().toString(), timestamp: new Date().toISOString() };
    db.logs.push(newLog);
    writeDB(db);
    res.status(201).json(newLog);
  });

  app.get("/api/products", (req, res) => {
    const db = readDB();
    res.json(db.products);
  });

  app.post("/api/products", (req, res) => {
    const db = readDB();
    const newProduct = { ...req.body, id: Date.now().toString() };
    db.products.push(newProduct);
    writeDB(db);
    res.status(201).json(newProduct);
  });

  app.get("/api/services", (req, res) => {
    const db = readDB();
    res.json(db.services);
  });

  app.post("/api/services", (req, res) => {
    const db = readDB();
    const newService = { ...req.body, id: Date.now().toString() };
    db.services.push(newService);
    writeDB(db);
    res.status(201).json(newService);
  });

  app.post("/api/irs-submission", (req, res) => {
    const db = readDB();
    const submission = { ...req.body, id: Date.now().toString(), submittedAt: new Date().toISOString() };
    db.irs_submissions.push(submission);
    writeDB(db);
    res.status(201).json(submission);
  });

  // Auth mock
  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    const db = readDB();
    const user = db.users.find((u: any) => u.email === email && u.password === password);
    if (user) {
      res.json({ user });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
