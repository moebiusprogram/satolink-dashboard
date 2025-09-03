//import React, { useState } from "react";
// import Send from "./send";
// import { NumericFormat as NumberFormat } from "react-number-format";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";

const AddressCards = () => {
  const handleAddClick = () => {
    console.log("pressed");
    // Open your modal here
  };

  return (
    <button
      style={{ height: "223px", width: "150px" }}
      type="button"
      onClick={handleAddClick}
      className="bg-gray-900 w-40 h-60 border-1 border-red-500 rounded-[22px] flex flex-col items-center justify-center
                     text-red-500 hover:border-red-400 active:scale-95 transition-all duration-200">
      <span className="text-3xl font-light mb-1">+</span>
      <span className="text-sm text-center">Add a new address</span>
    </button>
  );
};

export default AddressCards;
