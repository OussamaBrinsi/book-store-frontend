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
            // This file has been removed. The EmbeddedStripeCheckout component is no longer used. Use StripeCheckoutForm for all Stripe payments.
      } finally {
