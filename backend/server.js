const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const DB_PATH = path.join(__dirname, "db.json");

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

// Root route for serving index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// Helper: Read database
function readDB() {
  try {
    const data = fs.readFileSync(DB_PATH, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading DB:", error);
    return [];
  }
}

// Helper: Write database
function writeDB(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf8");
  } catch (error) {
    console.error("Error writing DB:", error);
  }
}

// Get all books
app.get("/books", (req, res) => {
  const books = readDB();
  res.json(books);
});

// Add a new book
app.post("/books", (req, res) => {
  const books = readDB();
  const newBook = { id: Date.now(), ...req.body };
  books.push(newBook);
  writeDB(books);
  res.status(201).json(newBook);
});

// Update a book by ID
app.put("/books/:id", (req, res) => {
  const books = readDB();
  const id = parseInt(req.params.id);
  const index = books.findIndex((b) => b.id === id);

  if (index !== -1) {
    books[index] = { ...books[index], ...req.body };
    writeDB(books);
    res.json(books[index]);
  } else {
    res.status(404).json({ error: "Book not found" });
  }
});

// Delete a book by ID
app.delete("/books/:id", (req, res) => {
  const books = readDB();
  const id = parseInt(req.params.id);
  const updatedBooks = books.filter((b) => b.id !== id);
  writeDB(updatedBooks);
  res.status(204).end();
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
