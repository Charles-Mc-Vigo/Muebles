import React from "react";
import Header from "../components/Header";

export default function Home() {
	return (
		<>
			<Header showLogin={false} category={true} />
			<div className="lg:max-w-7xl bg-slate-400 mx-auto">
        <h1 className="text-center text-5xl">This is a home page</h1>
      </div>
		</>
	);
}
