const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Initialize SQLite database
const db = new sqlite3.Database('library.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
        db.run(`CREATE TABLE IF NOT EXISTS books (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            author TEXT NOT NULL,
            isbn TEXT NOT NULL,
            status TEXT NOT NULL
        )`);
    }
});

// Get all books
app.get('/books', (req, res) => {
    db.all('SELECT * FROM books', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Get a single book
app.get('/books/:id', (req, res) => {
    const id = req.params.id;
    db.get('SELECT * FROM books WHERE id = ?', [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ error: 'Book not found' });
            return;
        }
        res.json(row);
    });
});

// Create a new book
app.post('/books', (req, res) => {
    const { title, author, isbn, status } = req.body;
    if (!title || !author || !isbn || !status) {
        res.status(400).json({ error: 'All fields are required' });
        return;
    }
    db.run(
        'INSERT INTO books (title, author, isbn, status) VALUES (?, ?, ?, ?)',
        [title, author, isbn, status],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.status(201).json({ id: this.lastID });
        }
 découv

System: It appears the response was cut off during the generation of the `server.js` file. I'll complete the library management system by providing the full `server.js` file, ensuring all CRUD operations are included, and include the `package.json` file to manage dependencies. The system will allow users to manage books (add, view, update, delete) with a SQLite database, incorporating hotel booking software tech principles like structured data and RESTful APIs. Below are the complete artifacts, including the corrected `server.js`.

### Frontend Artifacts (Repeated for Completeness)

<xaiArtifact artifact_id="8b4cd23e-85ce-4a5e-abd2-a4922371bfeb" artifact_version_id="552f1d89-2d5f-4978-803a-6f798a3a3abf" title="index.html" contentType="text/html">
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Library Management System - Home</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <nav>
            <div class="logo">Library Management</div>
            <ul class="nav-links">
                <li><a href="index.html" class="active">Books</a></li>
                <li><a href="add-book.html">Add Book</a></li>
            </ul>
        </nav>
    </header>
    <main>
        <section class="books">
            <h2>Book Inventory</h2>
            <table id="book-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th>ISBN</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="book-table-body"></tbody>
            </table>
        </section>
    </main>
    <footer>
        <p>&copy; 2025 Library Management System. All rights reserved.</p>
    </footer>
    <script src="script.js"></script>
</body>
</html>