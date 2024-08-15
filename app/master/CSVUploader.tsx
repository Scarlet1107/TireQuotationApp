import UploadButton from "./UploadButton";

const CSVUploader = () => {
  return (
    <div className="items-center space-y-10">
      <h1 className="flex justify-center text-2xl">
        CSV Upload for Tire Price
      </h1>
      <div className="w-full max-w-md">
        <div className="flex justify-center space-x-10">
          <UploadButton />
          <UploadButton />
        </div>
      </div>
    </div>
  );
};

export default CSVUploader;
