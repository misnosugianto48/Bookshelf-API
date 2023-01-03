const { nanoid } = require('nanoid');
const books = require('./books');

// menambah buku
const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };
  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }
  books.push(newBook);
  const isSuccess = books.filter((mybook) => mybook.id === id).length > 0;
  if (!isSuccess) {
    const response = h.response({
      status: 'error',
      message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;
  }
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
};

// menampilkan buku
const getAllBookHandler = (request, h) => {
  const { name, reading, finished } = request.query;
  let filterBooks = books; // ambil data dari array books

  if (name) {
    // cari buku berdasarkan nama
    filterBooks = filterBooks.filter((mybook) =>
      mybook.name.toLowerCase().includes(name.toLowerCase()));
  }

  if (reading) {
    // cari buku berdasarkan status dibaca
    if (reading === '0') {
      filterBooks = filterBooks.filter((mybook) => mybook.reading === false);
    } else if (reading === '1') {
      filterBooks = filterBooks.filter((mybook) => mybook.reading === true);
    }
  }

  if (finished) {
    // Filter buku berdasarkan status sudah selesai dibaca atau belum
    if (finished === '0') {
      filterBooks = filterBooks.filter((mybook) => mybook.finished === false);
    } else if (finished === '1') {
      filterBooks = filterBooks.filter((mybook) => mybook.finished === true);
    }
  }

  const response = h.response({
    status: 'success',
    data: {
      books: filterBooks.map((mybook) => ({
        id: mybook.id,
        name: mybook.name,
        publisher: mybook.publisher,
      })),
    },
  });
  response.code(200);
  return response;
};

// menampilkan dengan id
const getBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const book = books.filter((mybook) => mybook.id === id)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

// mengubah catatan
// eslint-disable-next-line consistent-return
const editBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();

  const index = books.findIndex((mybook) => mybook.id === id);
  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }
  if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }
  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }
};

// menghapus buku
const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const index = books.findIndex((mybook) => mybook.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBookHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
