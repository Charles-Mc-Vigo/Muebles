import React from "react";
import { useGLTF } from "@react-three/drei";

export function Table({
    selectedTableTop,
    selectedTableLeg,
    selectedTableWood,
}) {
    const { nodes, materials } = useGLTF("/Models/Table.glb");

    // Determine material based on selected wood
    const selectedMaterial = {
        "Acacia": materials.Acacia,
        "Mahogany": materials.Mahogany,
        "Narra": materials.Narra,
        "default": materials.Brown
    }[selectedTableWood] || materials.Brown;

    const getTableLeg = () => {
        switch (selectedTableLeg) {
            case "Design 1":
                return {
                    geometry: nodes.Table1_Leg1_Brown.geometry,
                    position: [0, -0.3, 0],
                    rotation: [1.571, -0.001, -3.139],
                    scale: [0.245, 5.459, 0.23],
                };
            case "Design 2":
                return {
                    geometry: nodes.Table2_Leg2_Brown.geometry,
                    position: [0, -0.3, 0],
                    rotation: [1.571, -0.001, -3.139],
                    scale: [0.245, 5.459, 0.23],
                };
            default:
                return {
                    geometry: nodes.Table1_Leg1_Brown.geometry,
                    position: [0, -0.3, 0],
                    rotation: [1.571, -0.001, -3.139],
                    scale: [0.245, 5.459, 0.23],
                };
        }
    };

    const getTableTop = () => {
        switch (selectedTableTop) {
            case "Design 1":
                return {
                    geometry: nodes.Table1_top1_Brown.geometry,
                    position: [-2, 0, 0],
                    scale: [-2.843, -0.137, -6.388],
                };
            case "Design 2":
                return {
                    geometry: nodes.Table2_top2_Brown.geometry,
                    position: [-2, 0, 0],
                    scale: [-2.843, -0.137, -6.388],
                };
            case "Design 3":
                return {
                    geometry: nodes.Table3_top3_Brown.geometry,
                    position: [-2, 0, 0],
                    scale: [-2.843, -0.137, -6.388],
                };
            default:
                return {
                    geometry: nodes.Table1_top1_Brown.geometry,
                    position: [-2, 0, 0],
                    scale: [-2.843, -0.137, -6.388],
                };
        }
    };

    const tableTop = getTableTop();
    const tableLeg = getTableLeg();

    return (
        <group dispose={null}>
            <mesh
                geometry={tableTop.geometry}
                material={selectedMaterial}
                position={tableTop.position}
                scale={tableTop.scale}
            />
            <mesh
                geometry={tableLeg.geometry}
                material={selectedMaterial}
                position={tableLeg.position}
                rotation={tableLeg.rotation}
                scale={tableLeg.scale}
            />
        </group>
    );
}

useGLTF.preload("/Models/Table.glb");