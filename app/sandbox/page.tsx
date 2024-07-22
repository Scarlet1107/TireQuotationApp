"use client";
import React, { useRef } from "react";
import ReactToPrint from "react-to-print";
import { ComponentToPrint } from "./ComponentToPrint";

const App = () => {
  const componentRef = useRef(null);
  const [content, setContent] = React.useState(100);

  return (
    <div>
      <div>
        <button
          onClick={() => setContent(content + 100)}
          className="ml-4 mt-4 flex justify-center rounded bg-blue-500 px-4 py-2 hover:bg-blue-600"
        >
          Click to increase number
        </button>
        <p className="text-xl">{content}</p>
        <ReactToPrint
          trigger={() => (
            <button className="ml-4 mt-4 flex justify-center rounded bg-blue-500 px-4 py-2 hover:bg-blue-600">
              Print this out!
            </button>
          )}
          
          content={() => componentRef.current}
        />
      </div>
      <div className="border-2 w-1/2">
        <ComponentToPrint ref={componentRef} content={content} />
      </div>
    </div>
  );
};

export default App;


