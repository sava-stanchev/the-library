import booksData from '../data/books.js';
import {useState} from 'react';

const Books = () => {
  const [books, setBooks] = useState(booksData);

  return(
    <div className="App">
      <div id="books">
        <div className="content">
          {books.map((book) => (
            <div id='BookContainer' className='mouse_over'>
              <img src={book.poster} />
              <h2>{book.title}</h2>
              <h3>{book.publishing_year}</h3>
              <button type="button" className="book-details-link" data-book-id={book.id}>View Details</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
};

export default Books;