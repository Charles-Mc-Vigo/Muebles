import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import Footer from "../components/Footer";
import Header from "../components/Header";

const TermsAndConditions = () => {
    const [isChecked, setIsChecked] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    const handleCheckboxChange = () => {
        setIsChecked((prev) => {
            const newChecked = !prev;
            return newChecked;
        });
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header isLogin={true} cartCount={true} />
            <main className="flex-grow max-w-auto mx-auto p-6 flex gap-4">
                <div className="flex-1 bg-gray-100 p-4 rounded-lg shadow-md">
                    <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
                    <h2 className="text-2xl font-semibold mt-6">INTRODUCTION</h2>
                    <p className="mb-4">
                        1.1 Welcome to the Muebles platform (the "Site"). Please take a
                        moment to read the following Terms of Service carefully before using
                        the Site or creating a Muebles account ("Account") to understand
                        your legal rights and obligations...
                    </p>
                    <h2 className="text-2xl font-semibold mt-6">
                        PRIVACY AND DATA SECURITY
                    </h2>
                    <p className="mb-4">
                        2.1 Muebles values your privacy and has provided the Muebles Privacy
                        Policy to explain how we handle your information...
                    </p>
                    <p className="mt-6">
                        I HAVE READ AND UNDERSTAND THESE TERMS AND CONDITIONS AND AGREE TO
                        ALL OF THE PROVISIONS CONTAINED ABOVE AND ANY REVISIONS TO THE SAME
                        HEREAFTER. BY CLICKING THE “SIGN UP” BUTTON DURING REGISTRATION, I
                        ACKNOWLEDGE MY ACCEPTANCE OF THESE TERMS AND CONDITIONS AND CONSENT
                        TO BE BOUND BY THEM IN THEIR ENTIRETY.
                    </p>
                </div>
                <div className="flex-1 bg-gray-100 p-4 rounded-lg shadow-md text-justify">
                    <h1 className="text-3xl font-bold mb-4">Installment Payment</h1>
                    <h2 className="text-2xl font-semibold mt-6">INSTALLMENT TERMS</h2>
                    <p className="mb-4">
                        Installment Payment Processing. The system will require a 50% down
                        payment from the customer. The remaining balance can be paid over a
                        minimum of 3 months, with an additional 3% interest applied only if
                        payments are not made on time. Integration with secure payment
                        gateways will ensure that online transactions are safe and reliable.
                    </p>
                    <h2 className="text-2xl font-semibold mt-6 text-justify">
                        Design Policy
                    </h2>
                    <p className="mb-4">
                        The Muebles System design cost policy specifies prices according to
                        the complexity of each design project. Depending on the amount of
                        complexity, personalization, and resources needed, each project is
                        evaluated and assigned a classification of easy, medium, or hard.
                        For easy designs, which involve minimal details, the cost is set at
                        ₱2,000. Medium designs, which require additional features or
                        moderately complex details, are priced at ₱3,000. For hard
                        designs—those involving intricate details, high customization, or
                        premium materials—the cost is ₱5,000.
                    </p>
                    {user && user.agreeToTerms ? (
                        <div className="flex items-center mt-4">
                            <input
                                type="checkbox"
                                id="termsCheckbox"
                                checked={isChecked}
                                onChange={handleCheckboxChange}
                                className="mr-2"
                            />
                            <label htmlFor="termsCheckbox" className="text-sm">
                                I have read and understood the terms and conditions.
                            </label>
                        </div>
                    ) : (
                        <div className="mt-4">
                            <button
                                disabled={!isChecked}
                                className={`flex items-center text-blue-500 hover:underline ${
                                    !isChecked ? "cursor-not-allowed opacity-50" : ""
                                }`}
                            >
                                <FaArrowLeft className="mr-2" />
                                Back to Sign Up
                            </button>
                        </div>
                    )}
                    <p className="text-sm mt-6">Last updated: 08/10/2024</p>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default TermsAndConditions;