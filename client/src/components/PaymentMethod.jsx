import React from "react";
import Header from "./Header";
import Footer from "./Footer";

const PaymentMethod = () => {
  return (
    <div>
      <section className="bg-white max-w-full">
        <Header />
        <div className="m-5 border flex flex-col items-center justify-center text-center border-green-500 rounded-xl p-5">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            About Our Payment Method
          </h1>
          <p className="text-lg md:text-xl text-black mb-5 font-medium">
            We offer a flexible payment method to ensure a smooth shopping
            experience. You can choose between online transactions and
            over-the-counter payments.
          </p>
        </div>
        <section>
          <div className="grid grid-cols-2 gap-4">
            <div className="container rounded-xl shadow-xl bg-gray-100 max-w-4xl m-5 p-5 flex items-center border-green-500 border">
              <div className="flex-1">
                <h3 className="text-xl md:text-2xl font-semibold mb-2">
                  Online Payment with GCash
                </h3>
                <p className="text-black text-justify text-lg md:text-xl mb-2">
                  Make hassle-free payments directly from your mobile device
                  using GCash. Simply choose GCash at checkout and follow the
                  prompts to complete your transaction securely. Enjoy the
                  convenience of online payments and receive instant
                  confirmation of your order!
                </p>
              </div>
            </div>
            <div className="container rounded-xl shadow-xl bg-gray-100 max-w-4xl m-5 p-5 flex items-center border-green-500 border">
              <div className="flex-1">
                <h3 className="text-xl md:text-2xl font-semibold mb-2">
                  Over-the-Counter Payments
                </h3>
                <p className="text-black text-justify text-lg md:text-xl mb-2">
                  If you prefer the convenience of in-person payments, you can
                  easily complete your transaction at our store. Simply visit
                  any of our locations, where our friendly team will assist you
                  through the payment process, ensuring a seamless and
                  hassle-free experience from start to finish.
                </p>
              </div>
            </div>
          </div>
        </section>
        <div className="m-5 shadow-xl bg-white rounded-xl border border-green-500 flex flex-col items-center justify-center text-center p-10">
          <p className="text-black font-medium text-justify text-lg md:text-xl mb-2">
            To secure your order, a 50% down payment is required upon finalizing
            the transaction. The remaining 50% is due upon delivery.
            Alternatively, customers may choose to pay in full. Payments can be
            made via cash, GCash, or online transactions. After making an
            e-payment, please provide proof of payment at least one day before
            production begins. Failure to do so may result in the termination of
            the order. The transaction is considered complete only upon delivery
            of the product and receipt of full payment or installment. If
            payment is not received, the organization may take legal action.
            Customers are required to provide their delivery address or choose
            to pick up the furniture from the store.
          </p>
        </div>

        <Footer />
      </section>
    </div>
  );
};

export default PaymentMethod;
