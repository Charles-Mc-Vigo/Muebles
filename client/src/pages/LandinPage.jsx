import React from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";

export default function LandinPage() {
	return (
		<>
			<Header showLogin={true}/>
			<Hero />
		</>
	);
}
