import React from "react";

interface ComponentToPrintProps {
  content: number;
}

const ComponentToPrint = React.forwardRef<
  HTMLDivElement,
  ComponentToPrintProps
>(function ComponentToPrint(props, ref) {
  const { content } = props;

  return (
    <div ref={ref} className="mt-4 flex justify-center">
      <div>
        <h1 className="flex justify-center text-2xl">
          Hello, this is a component to print!
        </h1>
        <p className="mt-6 flex justify-center text-xl">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quia laborum
          blanditiis unde repudiandae nemo, inventore, quo animi nulla optio
          maiores culpa deleniti voluptas alias. Maxime officia sunt recusandae
          dolorum amet neque ad nemo quidem, sequi, ipsam suscipit corporis.
          Distinctio sapiente provident ipsa odit nihil?
        </p>
        <p className="mt-4 text-xl">The number is {content}</p>
      </div>
    </div>
  );
});

export { ComponentToPrint };
