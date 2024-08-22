import React, { useState } from "react";

interface CustomAlertProps {
  message: string;
  onPush: () => void;
  onClose: () => void;
}

interface AlertButtonProps {
  message: string;
  onPush: () => void;
  children: React.ReactNode;
}

const CustomAlert: React.FC<CustomAlertProps> = ({
  message,
  onPush,
  onClose,
}) => (
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
            onClick={onPush}
            className="w-full rounded-md bg-blue-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            {" "}
            OK{" "}
          </button>
          <button id="cancelButton" className="sr-only" onClick={onClose} />
          <label
            htmlFor="cancelButton"
            className="absolute -right-3 -top-3 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-red-600 bg-red-300 text-center font-bold text-black"
          >
            X
          </label>
        </div>
      </div>
    </div>
  </div>
);

const AlertButton: React.FC<AlertButtonProps> = ({
  message,
  onPush,
  children,
}) => {
  const [showAlert, setAlert] = useState<boolean>(false);

  const handleShowAlert = (): void => {
    setAlert(true);
  };

  const handleExe = (): void => {
    setAlert(false);
    onPush();
  };

  const handleCloseAlert = (): void => {
    setAlert(false);
  };

  return (
    <div className="mt-5">
      <button
        onClick={handleShowAlert}
        className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
      >
        {children}
      </button>
      {showAlert && (
        <CustomAlert
          message={message}
          onPush={handleExe}
          onClose={handleCloseAlert}
        />
      )}
    </div>
  );
};
export default AlertButton;
