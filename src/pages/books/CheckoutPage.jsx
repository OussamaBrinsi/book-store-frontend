import StripeProviderWrapper from "../../components/StripeProviderWrapper";
import StripeCheckoutForm from "../../components/StripeCheckoutForm";
import { useNavigate } from "react-router-dom";
import { useCreateOrderMutation } from "../../redux/features/orders/ordersApi";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import { useSelector } from "react-redux";
import fallbackBookImg from "../../assets/books/book-1.png";
import { getImgUrl } from "../../utils/getImgUrl";

// Helper: Validate card order fields
function validateCardOrder(watch, formData, cartItems, debug = false) {
  const name = watch("name") || formData.name;
  const city = watch("city") || formData.address.city;
  const country = watch("country") || formData.address.country;
  const state = watch("state") || formData.address.state;
  const zipcode = watch("zipcode") || formData.address.zipcode;
  const phone = watch("phone") || formData.phone;
  const missing = [];
  if (!name) missing.push("name");
  if (!city) missing.push("city");
  if (!country) missing.push("country");
  if (!state) missing.push("state");
  if (!zipcode) missing.push("zipcode");
  if (!phone) missing.push("phone");
  if (!cartItems || cartItems.length === 0) missing.push("cartItems");
  if (debug) return missing;
  return missing.length === 0;
}

const CheckoutPage = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const totalPrice = cartItems
    .reduce((acc, item) => acc + item.newPrice * (item.quantity || 1), 0)
    .toFixed(2);
  const { currentUser } = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();
  const navigate = useNavigate();

  const [isChecked, setIsChecked] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  // Always build orderData from form and cart state
  const [formData, setFormData] = useState({
    name: currentUser?.displayName || "",
    email: currentUser?.email || "",
    address: {
      city: "",
      country: "",
      state: "",
      zipcode: "",
    },
    phone: "",
    cartItems: cartItems.map((item) => ({ ...item })),
    totalPrice: totalPrice,
  });

  // Helper: Get order data for card payment
  function getCardOrderData() {
    return {
      name: watch("name") || formData.name,
      email: currentUser?.email,
      address: {
        city: watch("city") || formData.address.city,
        country: watch("country") || formData.address.country,
        state: watch("state") || formData.address.state,
        zipcode: watch("zipcode") || formData.address.zipcode,
      },
      phone: Number(watch("phone") || formData.phone),
      cartItems: cartItems.map((item) => ({ ...item })),
      totalPrice: totalPrice,
    };
  }

  async function onSubmit(data) {
    const newOrder = {
      name: data.name,
      email: currentUser?.email,
      address: {
        city: data.city,
        country: data.country,
        state: data.state,
        zipcode: data.zipcode,
      },
      phone: data.phone,
      cartItems: cartItems.map((item) => ({ ...item })),
      totalPrice: totalPrice,
    };
    setFormData(newOrder);
    if (paymentMethod === "cash") {
      try {
        await createOrder(newOrder).unwrap();
        navigate("/orders");
      } catch (error) {
        console.error("Error place an order", error);
        alert("Failed to place an order");
      }
    }
    // For card, StripeCheckoutForm will handle order creation after payment
  }

  return (
    <section className="min-h-screen flex items-center justify-center py-8 bg-gray-50">
      <div className="w-full max-w-2xl mx-auto bg-white rounded shadow p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Checkout</h2>
        {/* Only use form for cash payment */}
        {paymentMethod === "cash" ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-blue-700 mb-1"
                >
                  Full Name
                </label>
                <input
                  {...register("name", { required: true })}
                  type="text"
                  name="name"
                  id="name"
                  className="h-11 border border-blue-200 rounded-lg px-4 w-full bg-blue-50 focus:ring-2 focus:ring-blue-300"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-blue-700 mb-1"
                >
                  Email Address
                </label>
                <input
                  {...register("email", { required: true })}
                  type="email"
                  name="email"
                  id="email"
                  className="h-11 border border-blue-200 rounded-lg px-4 w-full bg-blue-50 focus:ring-2 focus:ring-blue-300"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-semibold text-blue-700 mb-1"
                >
                  Phone Number
                </label>
                <input
                  {...register("phone", { required: true })}
                  type="text"
                  name="phone"
                  id="phone"
                  className="h-11 border border-blue-200 rounded-lg px-4 w-full bg-blue-50 focus:ring-2 focus:ring-blue-300"
                  placeholder="Enter your phone number"
                />
              </div>
              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-semibold text-blue-700 mb-1"
                >
                  City
                </label>
                <input
                  {...register("city", { required: true })}
                  type="text"
                  name="city"
                  id="city"
                  className="h-11 border border-blue-200 rounded-lg px-4 w-full bg-blue-50 focus:ring-2 focus:ring-blue-300"
                  placeholder="City"
                />
              </div>
              <div>
                <label
                  htmlFor="state"
                  className="block text-sm font-semibold text-blue-700 mb-1"
                >
                  State / Province
                </label>
                <input
                  {...register("state", { required: true })}
                  type="text"
                  name="state"
                  id="state"
                  className="h-11 border border-blue-200 rounded-lg px-4 w-full bg-blue-50 focus:ring-2 focus:ring-blue-300"
                  placeholder="State"
                />
              </div>
              <>
                <div>
                  <label
                    htmlFor="country"
                    className="block text-sm font-semibold text-blue-700 mb-1"
                  >
                    Country / Region
                  </label>
                  <input
                    {...register("country", { required: true })}
                    type="text"
                    name="country"
                    id="country"
                    className="h-11 border border-blue-200 rounded-lg px-4 w-full bg-blue-50 focus:ring-2 focus:ring-blue-300"
                    placeholder="Country"
                  />
                </div>
                <div>
                  <label
                    htmlFor="zipcode"
                    className="block text-sm font-semibold text-blue-700 mb-1"
                  >
                    Zipcode
                  </label>
                  <input
                    {...register("zipcode", { required: true })}
                    type="text"
                    name="zipcode"
                    id="zipcode"
                    className="h-11 border border-blue-200 rounded-lg px-4 w-full bg-blue-50 focus:ring-2 focus:ring-blue-300"
                    placeholder="Zipcode"
                  />
                </div>
              </>
              <div className="flex items-center mt-2">
                <input
                  onChange={(e) => setIsChecked(e.target.checked)}
                  type="checkbox"
                  name="billing_same"
                  id="billing_same"
                  className="mr-2"
                />
                <label htmlFor="billing_same" className="text-gray-700 text-sm">
                  I agree to the terms
                </label>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  type="button"
                  className={`flex-1 px-4 py-2 rounded border ${
                    paymentMethod === "cash"
                      ? "bg-blue-500 text-white"
                      : "bg-white text-blue-700 border-blue-500"
                  }`}
                  onClick={() => setPaymentMethod("cash")}
                >
                  Cash On Delivery
                </button>
                <button
                  type="button"
                  className={`flex-1 px-4 py-2 rounded border ${
                    paymentMethod === "card"
                      ? "bg-blue-500 text-white"
                      : "bg-white text-blue-700 border-blue-500"
                  }`}
                  onClick={() => setPaymentMethod("card")}
                >
                  Pay by Card
                </button>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  disabled={!isChecked}
                  className="bg-blue-500 text-white px-6 py-2 rounded disabled:opacity-60"
                  type="submit"
                >
                  Place Order
                </button>
              </div>
            </div>
          </form>
        ) : (
          // Card payment UI (no form submit)
          <div className="grid grid-cols-1 gap-4">
            {/* ...all the same input fields as above, but not inside a <form> ... */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-blue-700 mb-1"
              >
                Full Name
              </label>
              <input
                {...register("name", { required: true })}
                type="text"
                name="name"
                id="name"
                className="h-11 border border-blue-200 rounded-lg px-4 w-full bg-blue-50 focus:ring-2 focus:ring-blue-300"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-blue-700 mb-1"
              >
                Email Address
              </label>
              <input
                {...register("email", { required: true })}
                type="email"
                name="email"
                id="email"
                className="h-11 border border-blue-200 rounded-lg px-4 w-full bg-blue-50 focus:ring-2 focus:ring-blue-300"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-semibold text-blue-700 mb-1"
              >
                Phone Number
              </label>
              <input
                {...register("phone", { required: true })}
                type="text"
                name="phone"
                id="phone"
                className="h-11 border border-blue-200 rounded-lg px-4 w-full bg-blue-50 focus:ring-2 focus:ring-blue-300"
                placeholder="Enter your phone number"
              />
            </div>
            <div>
              <label
                htmlFor="city"
                className="block text-sm font-semibold text-blue-700 mb-1"
              >
                City
              </label>
              <input
                {...register("city", { required: true })}
                type="text"
                name="city"
                id="city"
                className="h-11 border border-blue-200 rounded-lg px-4 w-full bg-blue-50 focus:ring-2 focus:ring-blue-300"
                placeholder="City"
              />
            </div>
            <div>
              <label
                htmlFor="state"
                className="block text-sm font-semibold text-blue-700 mb-1"
              >
                State / Province
              </label>
              <input
                {...register("state", { required: true })}
                type="text"
                name="state"
                id="state"
                className="h-11 border border-blue-200 rounded-lg px-4 w-full bg-blue-50 focus:ring-2 focus:ring-blue-300"
                placeholder="State"
              />
            </div>
            <div>
              <label
                htmlFor="country"
                className="block text-sm font-semibold text-blue-700 mb-1"
              >
                Country / Region
              </label>
              <input
                {...register("country", { required: true })}
                type="text"
                name="country"
                id="country"
                className="h-11 border border-blue-200 rounded-lg px-4 w-full bg-blue-50 focus:ring-2 focus:ring-blue-300"
                placeholder="Country"
              />
            </div>
            <div>
              <label
                htmlFor="zipcode"
                className="block text-sm font-semibold text-blue-700 mb-1"
              >
                Zipcode
              </label>
              <input
                {...register("zipcode", { required: true })}
                type="text"
                name="zipcode"
                id="zipcode"
                className="h-11 border border-blue-200 rounded-lg px-4 w-full bg-blue-50 focus:ring-2 focus:ring-blue-300"
                placeholder="Zipcode"
              />
            </div>
            <div className="flex items-center mt-2">
              <input
                onChange={(e) => setIsChecked(e.target.checked)}
                type="checkbox"
                name="billing_same"
                id="billing_same"
                className="mr-2"
              />
              <label htmlFor="billing_same" className="text-gray-700 text-sm">
                I agree to the terms
              </label>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                type="button"
                className={`flex-1 px-4 py-2 rounded border ${
                  paymentMethod === "cash"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-blue-700 border-blue-500"
                }`}
                onClick={() => setPaymentMethod("cash")}
              >
                Cash On Delivery
              </button>
              <button
                type="button"
                className={`flex-1 px-4 py-2 rounded border ${
                  paymentMethod === "card"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-blue-700 border-blue-500"
                }`}
                onClick={() => setPaymentMethod("card")}
              >
                Pay by Card
              </button>
            </div>
            <div className="mt-4">
              <StripeProviderWrapper>
                <StripeCheckoutForm
                  amount={totalPrice}
                  disabled={!isChecked}
                  orderData={getCardOrderData()}
                  createOrder={createOrder}
                  navigate={navigate}
                />
              </StripeProviderWrapper>
            </div>
          </div>
        )}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
          <div className="flex flex-col gap-2">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-3 border-b last:border-b-0 py-2"
              >
                <img
                  src={
                    item.coverImage
                      ? getImgUrl(item.coverImage)
                      : item.image
                      ? item.image
                      : fallbackBookImg
                  }
                  alt={item.title}
                  className="w-14 h-20 object-cover rounded border bg-white"
                  style={{ objectFit: "cover" }}
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-800 truncate">
                    {item.title}
                  </div>
                  <div className="text-xs text-gray-500">
                    Qty: {item.quantity || 1}
                  </div>
                </div>
                <div className="font-bold text-blue-600">
                  ${(item.newPrice * (item.quantity || 1)).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mt-4 border-t pt-4">
            <span className="font-semibold text-gray-700">Total</span>
            <span className="text-lg font-bold text-blue-700">
              ${totalPrice}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckoutPage;
