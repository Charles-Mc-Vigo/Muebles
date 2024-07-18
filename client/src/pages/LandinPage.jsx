import React from "react";
import Nav from "../components/nav";
import Content from "../components/content";
export default function LandinPage() {
	return (
		<>
			<Nav />
			<div className="max-w-7xl mx-auto pt-10 bg-slate-600">
				<Content />
			</div>
		</>
	);
}
