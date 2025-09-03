import React, { useState } from "react";
import Send from "./send";
import { NumericFormat as NumberFormat } from "react-number-format";
import { SatsInput } from "./satsInput";

import { Button } from "@/components/ui/button";

const PaymentForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    recipient: "",
    amount: "",
    description: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!formData.recipient.trim()) {
      newErrors.recipient = "Recipient email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.recipient)) {
      newErrors.recipient = "Invalid email format";
    }

    if (!formData.amount || parseInt(formData.amount) <= 0) {
      newErrors.amount = "Amount must be a positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar error cuando se modifica el campo
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleAmountChange = (rawValue: string) => {
    const cleanValue = rawValue.replace(/\D/g, "");

    setFormData((prev) => ({
      ...prev,
      amount: cleanValue,
    }));

    if (errors.amount) {
      setErrors((prev) => ({ ...prev, amount: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6  text-white p-6 rounded-lg shadow-lg">
      {/* Recipient */}
      <div className="space-y-2">
        <label htmlFor="recipient" className="block text-sm font-medium">
          Recipient
        </label>
        <input
          id="recipient"
          name="recipient"
          type="email"
          value={formData.recipient}
          onChange={handleChange}
          className={`w-full px-4 py-3 bg-gray-800 ${
            errors.recipient ? "border-red-500" : ""
          } rounded-lg transition`}
          placeholder="user@satolink.app"
        />
        {errors.recipient && (
          <div className="text-red-400 text-sm mt-1">{errors.recipient}</div>
        )}
        <div className="text-xs text-gray-400">
          Email address of the Satolink user
        </div>
      </div>

      {/* Amount */}
      <div className="space-y-2">
        <label htmlFor="amount" className="block text-sm font-medium">
          Amount (sats)
        </label>
        <div className="relative">
          <SatsInput
            value={formData.amount}
            onChange={handleAmountChange}
            placeholder="1000"
          />
          <button
            type="button"
            onClick={() => {
              const newValue = formData.amount
                ? parseInt(formData.amount) + 100
                : 100;
              setFormData((prev) => ({ ...prev, amount: newValue.toString() }));
            }}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded text-white text-sm transition">
            +
          </button>
        </div>
        {errors.amount && (
          <div className="text-red-400 text-sm mt-1">{errors.amount}</div>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-3 bg-gray-800  rounded-lg focus:outline-none  transition resize-none"
          placeholder="What's this payment for?"
        />
        <div className="text-xs text-gray-400">
          Optional note for the recipient
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="button"
        onClick={handleSubmit}
        className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition focus:outline-none  ">
        Send Payment
      </button>

      {/* Info Box */}
      <div className="mt-6 p-4 bg-gray-800 border border-gray-700 rounded-lg">
        <div className="flex items-start">
          <svg
            className="w-5 h-5 text-green-500 mr-2 mt-0.5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <div className="text-sm font-medium text-green-400">
              Instant Transfers
            </div>
            <div className="text-sm text-gray-400">
              Payments between Satolink users are instant and free of fees
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
