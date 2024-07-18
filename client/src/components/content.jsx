import React from "react";

export default function content() {
	return (
		<div className="flex">
			<div>
				<h1 className="text-4xl sm:text-6xl lg:text-7xl">
					Discover the Beauty of Handcrafted Wood Furniture!
				</h1>
			</div>
			<div className="">
				<img
					src="/furniture.jpg"
					alt="furniture"
					style={{ width: "100%", maxWidth: "800px", height: "auto" }}
				/>
			</div>
		</div>
	);
}
