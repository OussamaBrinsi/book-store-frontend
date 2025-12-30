import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const ShippingDetailsPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    // Save shipping details to state, context, or backend as needed
    // For now, just navigate to order confirmation or summary
    navigate("/orders");
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Shipping Address</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1">Full Name</label>
          <input
            {...register("name", { required: true })}
            className="w-full border rounded p-2"
          />
          {errors.name && (
            <span className="text-red-500 text-sm">Name is required</span>
          )}
        </div>
        <div>
          <label className="block mb-1">Address</label>
          <input
            {...register("address", { required: true })}
            className="w-full border rounded p-2"
          />
          {errors.address && (
            <span className="text-red-500 text-sm">Address is required</span>
          )}
        </div>
        <div>
          <label className="block mb-1">City</label>
          <input
            {...register("city", { required: true })}
            className="w-full border rounded p-2"
          />
          {errors.city && (
            <span className="text-red-500 text-sm">City is required</span>
          )}
        </div>
        <div>
          <label className="block mb-1">Country</label>
          <input
            {...register("country", { required: true })}
            className="w-full border rounded p-2"
          />
          {errors.country && (
            <span className="text-red-500 text-sm">Country is required</span>
          )}
        </div>
        <div>
          <label className="block mb-1">Zip Code</label>
          <input
            {...register("zipcode", { required: true })}
            className="w-full border rounded p-2"
          />
          {errors.zipcode && (
            <span className="text-red-500 text-sm">Zip code is required</span>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Continue
        </button>
      </form>
    </div>
  );
};

export default ShippingDetailsPage;
