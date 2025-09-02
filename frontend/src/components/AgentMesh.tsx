import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import type { PlotData } from '../types/api';

interface AgentMeshProps {
  plot: PlotData;
  onClick?: () => void;
}

export function AgentMesh({ plot, onClick }: AgentMeshProps) {
  const meshRef = useRef<Mesh>(null);
  
  // Parse the visualization config
  const { coordinates, size, visualization } = plot;
  const { style, animation } = visualization;
  
  // Create material properties
  const materialProps = useMemo(() => {
    const props: any = {
      color: style.color || '#00ff88',
    };
    
    if (style.opacity !== undefined) {
      props.transparent = true;
      props.opacity = style.opacity;
    }
    
    if (style.wireframe) {
      props.wireframe = true;
    }
    
    return props;
  }, [style]);
  
  // Handle animations
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    // Rotation animation
    if (animation?.rotation) {
      meshRef.current.rotation.x += animation.rotation.x * delta * 60;
      meshRef.current.rotation.y += animation.rotation.y * delta * 60;
      meshRef.current.rotation.z += animation.rotation.z * delta * 60;
    }
    
    // Pulse animation
    if (animation?.pulse?.enabled) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * animation.pulse.speed) * 0.1 * animation.pulse.intensity;
      meshRef.current.scale.setScalar(pulse);
    }
    
    // Color shift animation
    if (animation?.color_shift && meshRef.current.material) {
      const hue = (state.clock.elapsedTime * 0.1) % 1;
      (meshRef.current.material as any).color.setHSL(hue, 0.8, 0.6);
    }
  });
  
  // Render different geometry types
  const renderGeometry = () => {
    const geometry = style.geometry || 'cube';
    
    switch (geometry) {
      case 'sphere':
        return <sphereGeometry args={[size.width / 2, 32, 32]} />;
      case 'cylinder':
        return <cylinderGeometry args={[size.width / 2, size.width / 2, size.height, 32]} />;
      case 'cone':
        return <coneGeometry args={[size.width / 2, size.height, 32]} />;
      case 'torus':
        return <torusGeometry args={[size.width / 2, size.width / 4, 16, 100]} />;
      case 'cube':
      default:
        return <boxGeometry args={[size.width, size.height, size.depth]} />;
    }
  };
  
  const renderMaterial = () => {
    const material = style.material || 'standard';
    
    switch (material) {
      case 'phong':
        return <meshPhongMaterial {...materialProps} />;
      case 'lambert':
        return <meshLambertMaterial {...materialProps} />;
      case 'basic':
        return <meshBasicMaterial {...materialProps} />;
      case 'standard':
      default:
        return <meshStandardMaterial {...materialProps} />;
    }
  };
  
  return (
    <mesh
      ref={meshRef}
      position={[coordinates.x, coordinates.y, coordinates.z]}
      onClick={onClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default';
      }}
    >
      {renderGeometry()}
      {renderMaterial()}
    </mesh>
  );
}
