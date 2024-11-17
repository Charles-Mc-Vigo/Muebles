import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

const TermsAndConditions = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (user) {
      setIsChecked(user.agreeToTerms);
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/users/data", {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Unable to get user data. Please try again later.");
      }
      const userData = await response.json();
      setUser(userData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleBackToSignUp = () => {
    if (isChecked) {
      navigate("/signup");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header isLogin={true} cartCount={true} />
      <main className="flex-grow max-w-auto mx-auto p-6 flex gap-4 max-h-screen flex-col sm:flex-row">
        {/* First Section */}
        <section className="flex-1 bg-gray-100 p-4 rounded-lg shadow-md overflow-y-auto sm:p-6 md:p-8 lg:p-10 xl:p-12 w-full sm:w-1/2">
          <div className="text-justify ">
            <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
            <h2 className="text-2xl font-semibold mt-6">INTRODUCTION</h2>
            <p className="mb-2">
              1.1 Welcome to the Muebles platform (the "Site"). Please take a
              moment to read the following Terms of Service carefully before
              using the Site or creating a Muebles account ("Account") to
              understand your legal rights and obligations. The "Services" we
              offer include: (a) the Site, (b) the services offered on the Site
              and through the Muebles client software, and (c) all related
              content such as information, linked pages, features, data, images,
              graphics, messages, software, and other materials ("Content"). Any
              new features added to the Services are also governed by these
              Terms of Service. These terms apply to your use of any Services
              provided by Muebles.
            </p>
            <p>
              1.2 We use cookies on our website. By accessing Muebles, you
              consent to the use of cookies in accordance with the Muebles
              Privacy Policy. Like most interactive websites, we use cookies to
              gather user details on each visit. They help enable specific
              functionalities and enhance the user experience by making the site
              easier to navigate.
            </p>
            <p>
              1.3 Before you can become a User of the Site, you need to read and
              agree to all the terms and conditions outlined in these Terms of
              Service and any related documents. Additionally, you must consent
              to the processing of your personal data as detailed in the Muebles
              Privacy Policy linked here.
            </p>
            <p>
              1.4 Muebles retains the right to alter, modify, suspend, or stop
              any part or all of this Site or its Services at any time, or with
              notice as required by local laws. Muebles may also set limits on
              certain features or restrict your access to parts of, or the
              entire, Site or Services at its sole discretion and without prior
              notice or liability, especially if you fail to comply with these
              Terms of Service.
            </p>
            <p>
              1.5 Muebles has the right to deny access or account creation for
              any reason. If you are under 18 or the legal age of consent,
              parental or guardian approval is required, and they must accept
              these terms. Parents or guardians are responsible for any use of
              the account by minors. If you do not accept these terms, please
              refrain from using the site or services.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mt-6">
              PRIVACY AND DATA SECURITY
            </h2>
            <p className="mb-4">
              2.1 Muebles values your privacy and has provided the Muebles
              Privacy Policy to explain how we handle your information. By
              accessing our Services or providing information, you: (a) agree to
              Muebles’ handling of your data as detailed in the Privacy Policy;
              (b) acknowledge shared ownership of your information with Muebles;
              and (c) commit not to share your information with third parties
              without Muebles’ written consent.
            </p>
            <p>
              2.2 Users who acquire another User’s personal data must follow
              relevant data protection laws, allow the original user to delete
              their data from the database, and permit them to review the
              collected information, all in compliance with applicable laws.
            </p>
            <p>
              2.3 Muebles reserves the right to modify or update these Terms and
              Conditions at any time. Any updates will be posted on this page,
              and it is your responsibility to check them regularly. Continued
              use of your account constitutes acceptance of the updated Terms.
            </p>
            <h2 className="text-2xl font-semibold mt-6">ACCOUNT</h2>
            <p className="mb-4">
              3.1 Users can terminate their Account by notifying Muebles in
              writing, including via email at help@support.muebles.ph. Your
              account will be terminated no sooner than twenty-four (24) hours
              after the termination request. Even after termination, Users
              remain responsible for any unfinished transactions, product
              shipments, payments, or similar issues. Users must contact Muebles
              only after resolving all pending transactions in accordance with
              these Terms of Service. Muebles will not be liable for any damages
              resulting from actions taken under this policy, and Users waive
              any claims related to such actions.
            </p>
            <p>
              3.2 Your account is intended for personal use only. You must not
              use it for any unlawful or unapproved activities. By using your
              account, you agree not to: (a) breach any local, state, national,
              or international laws; (b) misrepresent your identity or provide
              inaccurate information; and (c) engage in fraudulent, harmful, or
              abusive conduct.
            </p>
            <p>
              3.3 You may use the services or create an account regardless of
              your location, but orders can only be placed if the delivery
              address is within Marinduque. This means you can create an account
              and place orders from outside Marinduque, as long as the delivery
              address is located within Marinduque.
            </p>
            <p>
              3.4 You agree to: (a) keep your password private and only use your
              Email and password to log in, (b) your account may automatically
              log-out after three days you register or log-in, (b) promptly
              inform Muebles of any unauthorized access to your Account, User
              ID, or password, and (c) ensure that your Account information is
              correct and up-to-date. You are fully responsible for all actions
              taken under your User ID and Account, even if they were not done
              by you. Muebles will not be responsible for any loss or damage
              resulting from unauthorized use of your password or failure to
              follow this section.
            </p>
          </div>
          <div className="text-justify">
            <h1 className="text-2xl font-semibold mt-6">
              VIOLATION OF OUR TERMS OF SERVICE
            </h1>
            <p>
              4.1 Any misuse of the platform, including but not limited to the
              following, will be considered a violation of these Terms of
              Service: (a) Using multiple accounts to manipulate pricing,
              reviews, or any other aspect of the platform. (b) Withholding of
              payments or refunds related to transactions deemed to be in
              violation of the platform's policies. (c) Engaging in fraudulent
              activities, such as creating false orders or misrepresenting
              product information. (d) If you believe a User on our Site is
              violating these Terms of Service, please contact
              help@support.muebles.ph.
            </p>
            <h2 className="text-2xl font-semibold mt-6">
              PURCHASE AND PAYMENT
            </h2>
            <p>
              5.1 Muebles supports these following payment methods: (a) GCash
              Customers must upload a clear picture of the payment receipt
              showing the transaction number, date, and amount paid. Upload the
              receipt right after the payment to avoid any delays in processing
              the order. (b) Maya Customers must upload a clear and complete
              image of their transaction receipt when placing an order as proof
              of payment. Failure to provide a valid receipt may lead to order
              delays or cancellation. Muebles may reject orders if the receipt
              is unclear, incomplete, or contains discrepancies. (c) Full
              Payment Upon Delivery You can pay the balance amount for your
              order at the time of delivery. The payment is made directly to the
              courier upon receiving the product.
            </p>
            <p>
              5.2 Payment in full must be made prior to the shipment of the
              products.
            </p>
            <p>
              5.3 Buyers can change their chosen payment method for their
              purchase, but only before completing the payment.
            </p>
            <p>
              5.4 Muebles is not liable for any loss or damages resulting from
              incorrect shipping or payment information provided by the buyer or
              errors in remittance. Muebles reserves the right to verify the
              buyer's authorization to use a payment method, and may suspend or
              cancel the transaction if the authorization cannot be confirmed.
            </p>
            <h2 className="text-2xl font-semibold mt-6"> Design Policy</h2>
            <p className="mb-2">
              The Muebles System design cost policy specifies prices according
              to the complexity of each design project. Depending on the amount
              of complexity, personalization, and resources needed, each project
              is evaluated and assigned a classification of easy, medium, or
              hard. For easy designs, which involve minimal details, the cost is
              set at ₱2,000. Medium designs, which require additional features
              or moderately complex details, are priced at ₱3,000. For hard
              designs—those involving intricate details, high customization, or
              premium materials—the cost is ₱5,000.
            </p>
          </div>
        </section>

        <section className="flex-1 bg-gray-100 p-4 rounded-lg shadow-md overflow-y-auto sm:p-6 md:p-8 lg:p-10 xl:p-12 w-full sm:w-1/2 mt-4 sm:mt-0">
          <div className="text-justify">
            <h2 className="text-2xl font-semibold mt-6"> DELIVERY</h2>
            <p>
              7.1 Each order will have one delivery attempt to the designated
              address. Customers will receive a notification confirming the
              delivery date and time window as a reminder. Please ensure someone
              is available to receive the products. If delivery is missed, it
              will not be rescheduled. Delivery fees are non-refundable, and
              customers must pick up the item if delivery fails. For questions
              or assistance, contact Muebles customer support.
            </p>
            <p>
              7.2 We aim to process and dispatch all orders as swiftly as we
              can. The estimated delivery date is provided as a guideline and
              may change due to factors beyond our control, such as courier
              delays, customs processes or circumstances beyond one's control
            </p>
            <p>
              7.3 Please note that we are not responsible for any delays caused
              by incorrect or incomplete delivery information provided by the
              customer. It is the customer's responsibility to ensure that the
              shipping address is accurate at the time of purchase. In the event
              of a failed delivery attempt due to incorrect information.
            </p>
            <h2 className="text-2xl font-semibold mt-6">
              CANCELLATION, NO RETURN AND NO REFUND
            </h2>
            <p>
              8.1 Once an order has been placed and payment has been processed,
              the buyer cannot cancel the order. It is the buyer's
              responsibility to ensure that they are certain about their
              purchase before completing the transaction.
            </p>
            <p>
              8.2 All sales are final. We do not accept returns or offer refunds
              for any products purchased through our platform. By completing a
              purchase, the buyer acknowledges and agrees to this policy.
            </p>
            <p>
              8.3 In the event of any issues with the order, such as defects or
              incorrect items received, the buyer must contact our customer
              service within 7 days for assistance. We will assess the situation
              and may offer a resolution at our discretion, but no refunds or
              returns will be granted.
            </p>
            <h2 className="text-2xl font-semibold mt-6">
              {" "}
              FEEDBACK AND REVIEWS
            </h2>
            <p>
              9.1 Customers are encouraged to provide feedback and reviews
              regarding their experience with our products and services.
              Feedback can be submitted through the designated section on our
              website.
            </p>
            <p>
              9.2 All reviews should be honest, constructive, and respectful.
              Reviews must not contain any inappropriate language, personal
              attacks, or defamatory statements. We retain the right to review
              and delete any content that does not comply with these guidelines.
            </p>
            <p>
              9.3 You are entirely accountable for the content of your reviews.
              By submitting a review, you confirm that the information provided
              is accurate and that you have the right to share it.
            </p>
            <p>
              9.4 We may use customer feedback to improve our products,
              services, and customer experience. Your input is valuable to us,
              and we appreciate your contribution.
            </p>
            <p>
              9.5 Any personal information shared in reviews will be subject to
              our Privacy Policy. We will not publicly display any personal
              information without your consent.
            </p>
            <h2 className="text-2xl font-semibold mt-6">
              10. WARRANTY AND LIABILITY
            </h2>
            <p>
              10.1 JCKAME Furniture provides a warranty for its
              products/services that covers defects in materials and workmanship
              under normal use. This warranty remains effective for one year
              from the date of purchase. The warranty does not cover damages
              resulting from misuse, neglect, accidents, or unauthorized
              modifications
            </p>
            <p>
              10.2 JCKAME does not provide any warranty for products/services
              not manufactured by JCKAME. Such products/services are covered
              solely by the manufacturer’s warranty, if available.
            </p>
            <h2 className="text-2xl font-semibold mt-6">GENERAL PROVISIONS</h2>
            <p>
              11.1 Muebles may modify these Terms of Service at any time by
              posting the revised Terms of Service on this Site. By continuing
              to use this Site and/or receive any Services (including, for
              clarity, the ongoing provision of your Muebles Account) after the
              changes have been posted, you are considered to have accepted the
              updated Terms of Service.
            </p>
            <p>
              11.2 You are not permitted to assign, sublicense, transfer any
              rights granted to you under these terms, or delegate any of your
              obligations.
            </p>
            <p>
              11.3 If you have any questions or concerns regarding these Terms
              of Service or any matters mentioned within them or on the Site,
              feel free to contact us at: help@support.muebles.com.
            </p>
          </div>
          <div className="text-justify text-lg font-semibold mt-5">
            <p>
              I HAVE READ AND UNDERSTAND THESE TERMS AND CONDITIONS AND AGREE TO
              ALL OF THE PROVISIONS CONTAINED ABOVE AND ANY REVISIONS TO THE
              SAME HEREAFTER. BY CLICKING THE “SIGN UP” BUTTON DURING
              REGISTRATION, I ACKNOWLEDGE MY ACCEPTANCE OF THESE TERMS AND
              CONDITIONS AND CONSENT TO BE BOUND BY THEM IN THEIR ENTIRETY.
            </p>
            <div className="mt-4 flex items-center">
              <button
                className="flex items-center text-blue-500 hover:underline"
                onClick={handleBackToSignUp} 
              >
                <FaArrowLeft className="mr-2" />
                Back to Sign Up
              </button>
            </div>

            <p className="text-sm mt-6">Last updated: 11/10/2024</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TermsAndConditions;
