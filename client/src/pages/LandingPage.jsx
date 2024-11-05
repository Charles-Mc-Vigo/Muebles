import React from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";


const  LandingPage = () => {
	return(
		<div>
			<div> 
			<Header isLogin={true}  /> </div>
			<div>
				<Hero/>
			</div>
		</div>
		
	)
};

export default LandingPage;