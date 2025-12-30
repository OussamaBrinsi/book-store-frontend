import Swal from "sweetalert2";
import React from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useDispatch } from "react-redux";
import { clearCart } from "../redux/features/cart/cartSlice";
import getBaseUrl from "../utils/baseURL";

const StripeCheckoutForm = ({
  amount,
  disabled,
  orderData,
  createOrder,
  navigate,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      await Swal.fire({
        title: "Payment Error",
        text: "Card input is not ready. Please refresh the page and try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }
    // 1. Call backend to create PaymentIntent
    let data;
    try {
      const res = await fetch(
        `${getBaseUrl()}/api/stripe/create-checkout-session`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            priceId: orderData?.stripePriceId,
            quantity: orderData?.quantity || 1,
          }),
        }
      );
      data = await res.json();
    } catch (err) {
      await Swal.fire({
        title: "Network Error",
        text: "Failed to connect to payment server. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
      console.error("PaymentIntent fetch error:", err);
      return;
    }
    if (!data.clientSecret) {
      await Swal.fire({
        title: "Payment Error",
        text: data.error || "Failed to get client secret",
        icon: "error",
        confirmButtonText: "OK",
      });
      console.error("PaymentIntent error:", data);
      return;
    }
    // 2. Confirm card payment
    let result;
    try {
      result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });
    } catch (err) {
      await Swal.fire({
        title: "Payment Error",
        text: err.message || "Failed to process card payment.",
        icon: "error",
        confirmButtonText: "OK",
      });
      console.error("Stripe confirmCardPayment error:", err);
      return;
    }
    if (result.error) {
      await Swal.fire({
        title: "Payment Error",
        text: result.error.message,
        icon: "error",
        confirmButtonText: "OK",
      });
      console.error("Stripe payment error:", result.error);
      return;
    }
    if (result.paymentIntent && result.paymentIntent.status === "succeeded") {
      // 3. Create order in backend and wait for completion before clearing cart and navigating
      if (orderData && createOrder) {
        try {
          await createOrder(orderData).unwrap();
          dispatch(clearCart());
          await Swal.fire({
            title: "Order Placed!",
            text: "Your payment and order were successful.",
            icon: "success",
            confirmButtonText: "OK",
          });
          navigate("/orders");
        } catch (err) {
          await Swal.fire({
            title: "Order Error",
            text:
              err?.data?.message ||
              err.message ||
              "Failed to create order after payment.",
            icon: "error",
            confirmButtonText: "OK",
          });
          console.error("Order creation exception:", err, orderData);
        }
      } else {
        console.error("Order details missing after payment", orderData);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement className="p-2 border rounded" />
      {!stripe && (
        <div className="text-red-600 text-sm">
          Stripe is not loaded. Please check your internet connection and Stripe
          publishable key.
        </div>
      )}
      <button
        type="submit"
        disabled={!stripe || disabled}
        className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        Place Order
      </button>
    </form>
  );
};

export default StripeCheckoutForm;
