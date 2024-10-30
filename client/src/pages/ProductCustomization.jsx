import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

const Model = () => {
	const { scene } = useGLTF("/Models/ChairModels.glb");
	return <primitive object={scene} scale={1} position={[0, -1, 0]} />;
};

const ProductCustomization = () => {
	return (
		<>
			<div className="w-screen h-screen bg-slate-500">
				{/* Full screen canvas */}
				<Canvas camera={{ position: [0, 2, 10], fov: 50 }}>
					<ambientLight intensity={0.5} />
					<pointLight position={[10, 10, 10]} />
					<Model />
					<OrbitControls target={[0, 0, 0]} />
				</Canvas>
			</div>
		</>
	);
};

export default ProductCustomization;
