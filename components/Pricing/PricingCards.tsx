import NumberFormat from "react-number-format";

export default function PricingCard({ applicantType, description }) {
  const bgColor =
    applicantType.toLowerCase() === "idle"
      ? "bg-idle-normal"
      : "bg-active-normal";
  const textColor =
    applicantType.toLowerCase() === "idle" ? "text-normal" : "text-active-dark";

  return (
    <div className="shadow-md  block md:flex w-auto rounded-md  flex-col">
      <div className={`py-4 bg-orange-100 rounded-t-md`}>
        <p className={`text-2xl text-center font-semibold ${textColor}`}>
          {applicantType} Applicants
        </p>
      </div>
      <div className="bg-white p-6  text-center rounded-b-md max-w-full">
        <h3 className=" text-2xl font-extrabold text-dark sm:text-3xl">
          <div className=" space-x-4 flex flex-wrap items-center justify-center text-5xl  font-extrabold text-dark">
            <span className="w-full">
              {" "}
              <NumberFormat
                className="font-bold text-dark"
                value={3}
                displayType={"text"}
                decimalScale={2}
                thousandSeparator={true}
                fixedDecimalScale
                prefix={"$"}
              />
            </span>
            <span className="text-lg  mt-2 font-normal text-normal">
              / per applicant / per month
            </span>
          </div>
        </h3>
        {description}
      </div>
    </div>
  );
}
