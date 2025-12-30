import React from "react";
import {
  useDeleteOrderMutation,
  useGetAllOrdersQuery,
} from "../../redux/features/orders/ordersApi";

const AdminOrders = () => {
  const {
    data: orders = [],
    isLoading,
    isError,
    error,
  } = useGetAllOrdersQuery();
  const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation();
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      await deleteOrder(id).unwrap();
      // No need to update local state, RTK Query will refetch
    } catch (err) {
      alert("Failed to delete order");
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError)
    return <div>{error?.data?.message || "Failed to fetch orders"}</div>;
  const orderList = Array.isArray(orders) ? orders : [];

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">All User Orders</h2>
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr>
            <th className="border px-4 py-2">Order ID</th>
            <th className="border px-4 py-2">User</th>
            <th className="border px-4 py-2">Date</th>
            <th className="border px-4 py-2">Total</th>
            <th className="border px-4 py-2">Books</th>
            <th className="border px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {orderList.map((order) => (
            <tr key={order._id}>
              <td className="border px-4 py-2">{order._id}</td>
              <td className="border px-4 py-2">{order.email}</td>
              <td className="border px-4 py-2">
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString()
                  : "-"}
              </td>
              <td className="border px-4 py-2">${order.totalPrice}</td>
              <td className="border px-4 py-2">
                {order.products && order.products.length > 0
                  ? order.products
                      .map((item) =>
                        item.book && item.book.title
                          ? `${item.book.title} (x${item.quantity})`
                          : item.book
                      )
                      .join(", ")
                  : "-"}
              </td>
              <td className="border px-4 py-2">
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                  onClick={() => handleDelete(order._id)}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrders;
