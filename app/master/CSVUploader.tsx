import UploadButton from "./UploadButton";

const CSVUploader = () => {
  return (
    <div className="space-y-10">
      <h1 className="flex justify-center text-2xl">
        CSV Upload for Tire Price
      </h1>
      <div className="w-full max-w-md">
        <div className="flex space-x-10">
          <UploadButton tableName="tirePrice"> tirePrice </UploadButton>
          <UploadButton tableName="ServiceFees"> ServiceFees</UploadButton>
          <UploadButton tableName="CustomerTypePriceRate">
            {" "}
            CustomerTypePriceRate
          </UploadButton>
        </div>
      </div>
    </div>
  );
};

export default CSVUploader;
