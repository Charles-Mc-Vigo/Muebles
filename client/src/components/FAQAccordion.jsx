import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const AccordionItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="border-b border-teal-500  ">
      <button
        onClick={toggleAccordion}
        className="flex justify-between items-center w-full py-4 text-left focus:outline-none overflow-hidden "
      >
        <h3 className="text-2xl font-medium text-black font-sans">{question}</h3>
        <span className="text-lg text-black">
          {isOpen ? <FaChevronUp /> : <FaChevronDown />}
        </span>
      </button>
      {isOpen && (
        <div className="py-4 text-black font-sans text-xl ">
          {answer}
        </div>
      )}
    </div>
  );
};

const FAQAccordion = () => {
  const faqItems = [
    {
      question: "How do I place an order?",
      answer: "To place an order, simply browse our collection, add items to your cart, and proceed to checkout.",
    },
    {
      question: "I have successfully placed an order online, what are the next steps?",
      answer: "You will receive a confirmation email with your order details. Your order will be processed and shipped within 1-2 business days.",
    },
    {
      question: "What are the payment methods I can choose from?",
      answer: "We only accept Cash/E-wallet as payment methods.",
    },
    {
      question: "Any questions?",
      answer: "Feel free to contact our customer support team at any time. We're here to help!",
    },
  ];

  return (
    <div className="max-w-2xl mx-auto bg-gray-100 p-6 rounded-lg shadow-md ">
      {faqItems.map((item, index) => (
        <AccordionItem key={index} question={item.question} answer={item.answer} />
      ))}
    </div>
  );
};

export default FAQAccordion;
