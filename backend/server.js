const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const DB_PATH = path.join(__dirname, "db.json");

app.use(cors());
app.use(express.json());

// Helper: Read database
function readDB() {
  const data = fs.readFileSync(DB_PATH, "utf8");
  return JSON.parse(data);
}

// Helper: Write database
function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf8");
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

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
