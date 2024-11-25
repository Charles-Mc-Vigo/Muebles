import React from "react";
import { useGLTF } from "@react-three/drei";

export function Chair({ selectedBackrest, selectedSeat }) {
	const { nodes, materials } = useGLTF("/Models/ChairModels.glb");

	// Function to get the appropriate backrest node and material based on selection
	const getBackrestNode = () => {
		switch (selectedBackrest) {
			case 1:
				return {
					geometry: nodes.BackRestD1.geometry,
					material: materials["Material.002"],
					position: [0.08, 0.854, 0.871],
				};
			case 2:
				return {
					geometry: nodes.BackRestD2.geometry,
					material: materials["Material.002"],
					position: [0.07, 0.859, 0.88],
				};
			case 3:
				return {
					geometry: nodes.BackRestD3.geometry,
					material: materials["Material.002"],
					position: [0.07, 0.859, 0.88],
				};
			case 4:
				return {
					geometry: nodes.BackRestD4.geometry,
					material: materials["Material.002"],
					position: [0.07, 0.859, 0.88],
				};
			default:
				return {
					geometry: nodes.Back_Rest.geometry,
					material: materials["Material.001"],
					position: [0.07, 0.859, 0.88],
				};
		}
	};

	// Function to get the appropriate seat node and material based on selection
	const getSeatNode = () => {
		switch (selectedSeat) {
			case 1:
				return {
					geometry: nodes.ChairSeatD1.geometry,
					material: materials.Material,
					position: [0, -0.119, 0],
					scale: [1.2, 0.066, 1.2],
				};
			case 2:
				return {
					geometry: nodes.ChairSeatD2.geometry,
					material: nodes.ChairSeatD2.material || materials.Material,
					position: [0, -0.119, 0],
					scale: [1.2, 0.066, 1.2],
				};
			case 3:
				return {
					geometry: nodes.ChairSeatD3.geometry,
					material: nodes.ChairSeatD3.material || materials.Material,
					position: [0, -0.119, 0],
					scale: [1.2, 0.066, 1.2],
				};
			case 4:
				return {
					geometry: nodes.ChairSeatD4.geometry,
					material: nodes.ChairSeatD4.material || materials.Material,
					position: [0, -0.119, 0],
					scale: [1.2, 0.066, 1.2],
				};
			default:
				return {
					geometry: nodes.Chair_Seat.geometry,
					material: materials.Material,
					position: [0, -0.119, 0],
					scale: [1.2, 0.066, 1.2],
				};
		}
	};

	// Get the appropriate nodes and materials
	const backrest = getBackrestNode();
	const seat = getSeatNode();

	return (
		<group dispose={null}>
			{/* Dynamic Seat */}
			<mesh
				geometry={seat.geometry}
				material={seat.material}
				position={seat.position}
				scale={seat.scale}
			/>
			<mesh
				geometry={nodes.Chair_Leg1.geometry}
				material={materials["Material.002"]}
				position={[0.861, -0.229, 0.798]}
				scale={0.175}
			/>
			<mesh
				geometry={nodes.Chair_Leg2.geometry}
				material={materials["Material.002"]}
				position={[0.884, -0.23, -0.929]}
				scale={0.175}
			/>
			<mesh
				geometry={nodes.Chair_Leg4.geometry}
				material={materials["Material.002"]}
				position={[-0.841, -0.249, 0.705]}
				scale={0.175}
			/>
			<mesh
				geometry={nodes.Chair_Leg3.geometry}
				material={materials["Material.002"]}
				position={[-0.847, -0.269, -0.89]}
				scale={0.175}
			/>
			{/* Dynamic Backrest */}
			<mesh
				geometry={backrest.geometry}
				material={backrest.material}
				position={backrest.position}
				rotation={[-1.613, 0, 0]}
			/>
		</group>
	);
}

useGLTF.preload("/Models/ChairModels.glb");
