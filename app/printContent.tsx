import React, { useEffect, useState } from "react";
import { PrintData, ServiceFee } from "@/utils/interface";
import { getServiceFees } from "@/utils/supabaseFunctions";

interface Props {
  printData: PrintData;
}

// Forward ref needs to be typed correctly
const PrintContent = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
  // Component display name
  PrintContent.displayName = "PrintContent";
  const { printData } = props;

  const [serviceFees, setServiceFees] = useState<ServiceFee[]>([]);

  // Fetch service fees asynchronously
  const fetchServiceFees = async () => {
    const res = await getServiceFees();
    setServiceFees(res as ServiceFee[]);
  };

  // Use effect to trigger the fetch on component mount
  useEffect(() => {
    fetchServiceFees();
  }, []);

  return (
    <div ref={ref} className="m-8">
      <h1>This is print content</h1>
      <h2>Fetch Test Result here</h2>
      <p>ServiceFees.laborFee</p>
      {serviceFees.map((data, index) => (
        <div key={index}>{data.laborFee}</div>
      ))}


      <h2>Print Data</h2>
      <p>Customer Name: {printData.customerName}</p>
      <p>Car Model: {printData.carModel}</p>
      <p>Expiry Date: {printData.expiryDate.toString()}</p>
      <p>Number of Tires: {printData.numberOfTires}</p>
      <p>Wheel Name: {printData.wheel.name}</p>
      <p>Wheel Size: {printData.wheel.size}</p>
      <p>Wheel Quantity: {printData.wheel.quantity}</p>
      <p>Wheel Price: {printData.wheel.price}</p>
      <p>Extra Options:</p>
      {printData.extraOptions.map((option, index) => (
        <div key={index}>
          <p>Option: {option.option}</p>
          <p>Price: {option.price}</p>
          <p>Quantity: {option.quantity}</p>
        </div>
      ))}
      <p>Checkbox State:</p>
      <p>Labor Fee: {printData.checkBoxState.laborFee ? "True" : "False"}</p>
      <p>Removal Fee: {printData.checkBoxState.removalFee ? "True" : "False"}</p>
      <p>
        Tire Storage Fee: {printData.checkBoxState.tireStorageFee ? "True" : "False"}
      </p>
      <p>
        Tire Disposal Fee: {printData.checkBoxState.tireDisposalFee ? "True" : "False"}
      </p>
      <p>Discount Rate:</p>
      <p>Labor Fee: {printData.discountRate.laborFee}</p>
      <p>Removal Fee: {printData.discountRate.removalFee}</p>
      <p>Tire Storage Fee: {printData.discountRate.tireStorageFee}</p>
      <p>{printData.ids}</p>




    </div>
  );
});

export default PrintContent;
