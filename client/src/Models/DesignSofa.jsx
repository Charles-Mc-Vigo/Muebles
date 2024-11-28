import React from "react";
import { useGLTF } from "@react-three/drei";

export function Sofa({ 
    selectedBackrest = "Design 1", 
    selectedArmrest = "Design 1", 
    selectedSofaWood = "Brown" 
}) {
    const { nodes, materials } = useGLTF("/Models/DesignSofa.glb");

    // Debugging material log
    console.log("Available Materials:", Object.keys(materials));

    // Material mapping with fallbacks
    const woodMaterials = {
        "Acacia": materials.Acacia || materials["Acacia.001"] || materials.Brown,
        "Narra": materials.Narra || materials["Narra.001"] || materials.Brown,
        "Mahogany": materials.Mahiogany || materials["Mahiogany.001"] || materials.Brown,
        "Brown": materials.Brown
    };

    const getSofaBackrest = () => {
        const backrestDesigns = {
            "Design 1": {
                geometry: nodes.Backrest1.geometry,
                position: [0.145, 0.268, -1.188],
                scale: [0.84, 0.579, 0.632],
            },
            "Design 2": {
                geometry: nodes.Backrest2.geometry,
                position: [-0.07, 0.063, -1.235],
                rotation: [0.018, 0.001, 0.008],
                scale: [1.288, 1, 1.282],
            },
            "Design 3": {
                geometry: nodes.Backrest3.geometry,
                position: [-1.839, 3.436, -1.145],
                scale: [1.389, 1, 1],
            },
            "Design 4": {
                geometry: nodes.Backrest4.geometry,
                position: [-0.444, 0.75, -1.193],
                rotation: [1.453, Math.PI / 2, 0],
                scale: [0.008, 0.001, 0.008],
            }
        };

        return backrestDesigns[selectedBackrest] || backrestDesigns["Design 1"];
    };

    const getSofaArmrest = () => {
        const armrestDesigns = {
            "Design 1": {
                geometry: nodes.Armrest1.geometry,
                position: [1.876, 0.425, 0],
                rotation: [0, 0, -0.014],
                scale: [0.71, 0.781, 1.141],
            },
            "Design 2": {
                geometry: nodes.Armrest2_.geometry,
                position: [-0.499, 0.912, -1.203],
                rotation: [-1.571, 1.568, 3.023],
                scale: [0.008, 0.001, 0.008],
            }
        };

        return armrestDesigns[selectedArmrest] || armrestDesigns["Design 1"];
    };

    const sofaBackrest = getSofaBackrest();
    const sofaArmrest = getSofaArmrest();

    // Select material based on wood type
    const selectedMaterial = woodMaterials[selectedSofaWood] || materials.Brown;

    return (
        <group dispose={null}>
            <mesh
                geometry={sofaArmrest.geometry}
                material={selectedMaterial}
                position={sofaArmrest.position}
                rotation={sofaArmrest.rotation}
                scale={sofaArmrest.scale}
            />
            <mesh
                geometry={sofaBackrest.geometry}
                material={selectedMaterial}
                position={sofaBackrest.position}
                rotation={sofaBackrest.rotation}
                scale={sofaBackrest.scale}
            />
        </group>
    );
}

useGLTF.preload("/Models/DesignSofa.glb");