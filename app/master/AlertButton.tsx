import React, { useState } from "react";

interface CustomAlertProps {
  message: string;
  onClose: () => void;
}

const CustomAlert: React.FC<CustomAlertProps> = ({ message, onClose }) => (
  <div
    className="fixed inset-0 h-full w-full overflow-y-auto bg-gray-600 bg-opacity-50"
    id="my-model"
  >
    <div className="relative top-20 my-auto w-96 rounded-md border bg-white p-5 shadow-lg">
      <div className="mt-3 text-center">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          {message}
        </h3>
        <div className="mt-2 px-7 py-3">
          <button
            onClick={onClose}
            className="w-full rounded-md bg-blue-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            {" "}
            OK{" "}
          </button>
        </div>
      </div>
    </div>
  </div>
);

const AlertButton: React.FC = () => {
  const [showAlert, setAlert] = useState<boolean>(false);

  const handleShowAlert = (): void => {
    setAlert(true);
  };

  const handleCloseAlert = (): void => {
    setAlert(false);
  };

  return (
    <div>
      <button
        onClick={handleShowAlert}
        className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
      >
        delete Button
      </button>
      {showAlert && (
        <CustomAlert
          message="This is a warning message!"
          onClose={handleCloseAlert}
        />
      )}
    </div>
  );
};
export default AlertButton;
