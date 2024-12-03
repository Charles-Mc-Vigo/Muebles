/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
	  extend: {
		colors: {
		  oliveGreen: '#52734F', // Custom color for olive green
		  teal: {
			600: '#008080', // Define your specific teal shade here if it's custom
		  }
		},
	  },
	},
	plugins: [],
  };
  