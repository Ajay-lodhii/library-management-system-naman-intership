document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        loadBooks();
    }
    if (window.location.pathname.includes('add-book.html')) {
        const editBookId = localStorage.getItem('editBookId');
        if (editBookId) {
            loadBookForEdit(editBookId);
        }
    }
});

async function submitBook() {
    const bookTitle = document.getElementById('book-title').value;
    const bookAuthor = document.getElementById('book-author').value;
    const bookIsbn = document.getElementById('book-isbn').value;
    const bookStatus = document.getElementById('book-status').value;
    const editBookId = localStorage.getItem('editBookId');

    if (!bookTitle || !bookAuthor || !bookIsbn || !bookStatus) {
        document.getElementById('book-message').textContent = 'Please fill in all required fields.';
        document.getElementById('book-message').style.color = 'red';
        return;
    }

    const bookData = {
        title: bookTitle,
        author: bookAuthor,
        isbn: bookIsbn,
        status: bookStatus,
    };

    try {
        const url = editBookId ? `http://localhost:3000/books/${editBookId}` : 'http://localhost:3000/books';
        const method = editBookId ? 'PUT' : 'POST';
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookData),
        });

        if (response.ok) {
            document.getElementById('book-message').textContent = editBookId ? 'Book updated successfully!' : 'Book added successfully!';
            document.getElementById('book-message').style.color = 'green';
            document.getElementById('book-title').value = '';
            document.getElementById('book-author').value = '';
            document.getElementById('book-isbn').value = '';
            document.getElementById('book-status').value = 'Available';
            if (editBookId) {
                localStorage.removeItem('editBookId');
                document.querySelector('.book-form h2').textContent = 'Add New Book';
                document.querySelector('.submit-button').textContent = 'Add Book';
            }
        } else {
            document.getElementById('book-message').textContent = `Error ${editBookId ? 'updating' : 'adding'} book.`;
            document.getElementById('book-message').style.color = 'red';
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('book-message').textContent = 'Error connecting to server.';
        document.getElementById('book-message').style.color = 'red';
    }
}

async function loadBooks() {
    try {
        const response = await fetch('http://localhost:3000/books');
        const books = await response.json();
        const tableBody = document.getElementById('book-table-body');
        tableBody.innerHTML = '';
        books.forEach(book => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.isbn}</td>
                <td>${book.status}</td>
                <td>
                    <button class="action-button edit-button" onclick="editBook(${book.id})">Edit</button>
                    <button class="action-button delete-button" onclick="deleteBook(${book.id})">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

async function loadBookForEdit(id) {
    try {
        const response = await fetch(`http://localhost:3000/books/${id}`);
        const book = await response.json();
        document.getElementById('book-title').value = book.title;
        document.getElementById('book-author').value = book.author;
        document.getElementById('book-isbn').value = book.isbn;
        document.getElementById('book-status').value = book.status;
        document.querySelector('.book-form h2').textContent = 'Edit Book';
        document.querySelector('.submit-button').textContent = 'Update Book';
    } catch (error) {
        console.error('Error:', error);
    }
}

async function editBook(id) {
    localStorage.setItem('editBookId', id);
    window.location.href = 'add-book.html';
}

async function deleteBook(id) {
    try {
        const response = await fetch(`http://localhost:3000/books/${id}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            loadBooks();
        } else {
            console.error('Error deleting book');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}