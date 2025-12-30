import React from "react";
import { FiShoppingCart } from "react-icons/fi";
import { useParams } from "react-router-dom";

import { getImgUrl } from "../../utils/getImgUrl";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import Swal from "sweetalert2";
import { useFetchBookByIdQuery } from "../../redux/features/books/booksApi";

const SingleBook = () => {
  const { id } = useParams();
  const { data: book, isLoading, isError } = useFetchBookByIdQuery(id);

  const dispatch = useDispatch();

  const handleAddToCart = (product) => {
    Swal.fire({
      title: "Add to cart?",
      text: `Do you want to add \"${product.title}\" to your cart?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        // Ensure stripePriceId is included for Stripe checkout
        dispatch(
          addToCart({ ...product, stripePriceId: product.stripePriceId })
        );
      }
    });
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error happending to load book info</div>;
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6 mt-10 flex flex-col md:flex-row gap-8">
      <div className="md:w-1/2 flex items-center justify-center">
        <img
          src={`${getImgUrl(book.coverImage)}`}
          alt={book.title}
          className="w-full max-w-xs rounded object-contain border"
        />
      </div>
      <div className="md:w-1/2 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">{book.title}</h1>
          <p className="text-base text-gray-700 mb-2">
            by <span className="font-semibold">{book.author || "admin"}</span>
          </p>
          <div className="mb-2 text-sm text-gray-500">
            Category: {book.category}
          </div>
          <div className="mb-2 text-sm text-gray-500">
            Published: {new Date(book?.createdAt).toLocaleDateString()}
          </div>
          <p className="text-xl font-semibold mb-4">
            ${book.newPrice}{" "}
            <span className="text-base text-gray-400 line-through ml-2">
              ${book.oldPrice}
            </span>
          </p>
          <p className="text-gray-700 mb-6 leading-relaxed">
            {book.description}
          </p>
        </div>
        <button
          onClick={() => handleAddToCart(book)}
          className="mt-4 w-full bg-gray-800 hover:bg-gray-900 text-white font-medium py-2 rounded flex items-center justify-center gap-2 text-base transition"
        >
          <FiShoppingCart className="text-lg" />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default SingleBook;
