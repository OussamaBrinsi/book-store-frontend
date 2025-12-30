import React from "react";
import { useLocation } from "react-router-dom";
import { useFetchAllBooksQuery } from "../redux/features/books/booksApi";
import BookCard from "../pages/books/BookCard";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const SearchResults = () => {
  const query = useQuery();
  const searchTerm = query.get("q")?.toLowerCase() || "";
  const { data: books = [], isLoading } = useFetchAllBooksQuery();

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm) ||
      (book.author && book.author.toLowerCase().includes(searchTerm))
  );

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="py-10">
      <h2 className="text-2xl font-semibold mb-6">
        Search Results for "{searchTerm}"
      </h2>
      {filteredBooks.length === 0 ? (
        <div>No books found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
