import React, { useEffect, useRef, useState } from "react";
import getBaseUrl from "../utils/baseURL";

// This component mounts the Stripe Embedded Checkout UI
const EmbeddedStripeCheckout = ({
  priceId,
  quantity = 1,
  onSuccess,
  onError,
}) => {
  const checkoutRef = useRef(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        const res = await fetch(
          `${getBaseUrl()}/api/stripe/create-checkout-session`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ priceId, quantity }),
          }
        );
        const data = await res.json();
        setClientSecret(data.clientSecret);
      } catch (err) {
        onError && onError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchClientSecret();
  }, [priceId, quantity, onError]);

  useEffect(() => {
    if (!clientSecret || !window.Stripe) return;
    const stripe = window.Stripe(
      "pk_test_51SjgkZ1g36i1SaPdrRED6XOrEtT3KIsLlf3C0kwwZxpiNt43gCxYTYzgeaSXhWBuWQLItcxkDn6LtddGAP1Z0wh200P4faPsXj"
    );
    const checkout = stripe.initEmbeddedCheckout({
      clientSecret,
    });
    checkout.mount(checkoutRef.current);
  }, [clientSecret]);

  if (loading) return <div>Loading payment...</div>;
  return <div id="checkout" ref={checkoutRef} style={{ minHeight: 500 }} />;
};

export default EmbeddedStripeCheckout;
