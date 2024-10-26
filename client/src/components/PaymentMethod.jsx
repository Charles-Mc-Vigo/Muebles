import React from "react";
import Header from "./Header";
import Footer from "./Footer";

const PaymentMethod = () => {
  return (
    <section className="bg-white py-10">
      <Header />
      <div className="container mx-auto px-4 mt-5">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">
          About Our Payment Method
        </h2>
        <p className="text-lg md:text-xl text-gray-700 mb-5 font-semibold text-justify">
          We offer a flexible payment method to ensure a smooth shopping
          experience. You can choose between online transactions and
          over-the-counter payments.
        </p>
        <div className="mx-auto bg-gray-100 p-6 rounded-lg shadow-md mb-6 flex flex-col items-center text-black">
          {/* Online Payment with GCash */}
          <h3 className="text-xl md:text-2xl font-semibold mb-4">
            Online Payment with GCash
          </h3>
          <p className="text-black text-justify text-lg md:text-xl mb-2">
            Make hassle-free payments directly from your mobile device using
            GCash. Simply choose GCash at checkout and follow the prompts to
            complete your transaction securely. Enjoy the convenience of online
            payments and receive instant confirmation of your order!
          </p>
          {/* Over-the-Counter Payments */}
          <h3 className="text-xl md:text-2xl font-semibold mb-4">
            Over-the-Counter Payments
          </h3>
          <p className="text-black text-justify text-lg md:text-xl mb-2">
            Prefer to pay in person? You can also make payments over the counter
            at select locations. Just visit our partner outlets to complete your
            purchase. Our team will assist you with the payment process to
            ensure a seamless experience.
          </p>
        </div>
        <div className="mt-6 text-justify mb-5 text-black text-lg md:text-xl">
          <p className="mb-2">
            To secure your order, a 50% down payment is required upon finalizing
            the transaction. The remaining 50% is due upon delivery.
            Alternatively, customers may choose to pay in full.
          </p>
          <p className="mb-2">
            Payments can be made via cash, GCash, or online transactions. After
            making an e-payment, please provide proof of payment at least one
            day before production begins. Failure to do so may result in the
            termination of the order.
          </p>
          <p>
            The transaction is considered complete only upon delivery of the
            product and receipt of full payment or installment. If payment is
            not received, the organization may take legal action. Customers are
            required to provide their delivery address or choose to pick up the
            furniture from the store.
          </p>
        </div>
      </div>
      <Footer />
    </section>
  );
};

export default PaymentMethod;