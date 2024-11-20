import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductReview from "../components/ProductReview";
import CreateReview from "../components/CreateReview";

const ReviewPage =()=>{
    return (
        <div className="w-full p-5">
        <Header/>
        <CreateReview/>
        <ProductReview/>
        <Footer/>
    </div>
    );
    
};
export default ReviewPage;