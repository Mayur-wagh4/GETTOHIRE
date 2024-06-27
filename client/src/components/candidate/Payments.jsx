import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
const payment = () => {
  const navigate = useNavigate();

  const data = {
    name: "Mayurssss",
    amount: 100,
    number: "1234567891",
    MUID: "MUID" + Date.now(),
    transactionId: "T" + Date.now(),
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    let res = await axios
      .post("http://localhost:3000/api-v1/payment/initiate", { ...data })
      .then((res) => {
        console.log(res);
        if (res.data && res.data.data.instrumentResponse.redirectInfo.url) {
          window.location.href =
            res.data.data.instrumentResponse.redirectInfo.url;
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <form onSubmit={handlePayment}>
      <div className="col-12 ">
        <p className="fs-5">
          <strong>Name:</strong> {data.name}
        </p>
      </div>
      <div className="col-12 ">
        <p className="fs-5">
          <strong>Number:</strong> {data.number}
        </p>
      </div>
      <div className="col-12 ">
        <p className="fs-5">
          <strong>Amount:</strong> {data.amount}Rs
        </p>
      </div>
      <div className="col-12 center">
        <button className="w-100 " type="submit">
          Pay Now
        </button>
      </div>
    </form>
  );
};

export default payment;
