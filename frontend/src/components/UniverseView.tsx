import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Html } from '@react-three/drei';
import { Group } from 'three';
import { AgentMesh } from './AgentMesh';
import type { PlotData } from '../types/api';

interface UniverseViewProps {
  plots: PlotData[];
  selectedPlot?: PlotData | null;
  onPlotSelect?: (plot: PlotData) => void;
}

function LoadingFallback() {
  return (
    <Html center>
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellorn-primary"></div>
        <span className="ml-2 text-yellorn-light">Loading universe...</span>
      </div>
    </Html>
  );
}

function UniverseCamera() {
  const groupRef = useRef<Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating camera movement
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.5;
    }
  });
  
  return (
    <group ref={groupRef}>
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={100}
        autoRotate={false}
        autoRotateSpeed={0.5}
      />
    </group>
  );
}

function UniverseGrid() {
  return (
    <>
      {/* Grid lines */}
      <gridHelper args={[100, 20, '#00ff88', '#444']} />
      
      {/* Coordinate axes */}
      <axesHelper args={[10]} />
      
      {/* Ambient lighting */}
      <ambientLight intensity={0.4} />
      
      {/* Directional lighting */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        color="#ffffff"
        castShadow
      />
      
      {/* Point light for dramatic effect */}
      <pointLight
        position={[0, 10, 0]}
        intensity={0.5}
        color="#00ff88"
        distance={50}
      />
    </>
  );
}

export function UniverseView({ plots, selectedPlot, onPlotSelect }: UniverseViewProps) {
  return (
    <div className="w-full h-full relative">
      <Canvas
        shadows
        camera={{ position: [10, 10, 10], fov: 60 }}
        className="bg-gradient-to-b from-black to-gray-900"
      >
        <Suspense fallback={<LoadingFallback />}>
          {/* Universe Environment */}
          <Stars
            radius={100}
            depth={50}
            count={5000}
            factor={4}
            saturation={0}
            fade
            speed={1}
          />
          
          <UniverseGrid />
          <UniverseCamera />
          
          {/* Render all agent plots */}
          {plots.map((plot) => (
            <AgentMesh
              key={plot.agent_id}
              plot={plot}
              onClick={() => onPlotSelect?.(plot)}
            />
          ))}
          
          {/* Highlight selected plot */}
          {selectedPlot && (
            <mesh position={[
              selectedPlot.coordinates.x,
              selectedPlot.coordinates.y,
              selectedPlot.coordinates.z
            ]}>
              <ringGeometry args={[selectedPlot.size.width * 0.8, selectedPlot.size.width * 1.2, 32]} />
              <meshBasicMaterial color="#00ff88" transparent opacity={0.3} />
            </mesh>
          )}
        </Suspense>
      </Canvas>
      
      {/* UI Overlay */}
      <div className="absolute top-4 left-4 z-10">
        <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4 text-yellorn-light">
          <h3 className="text-lg font-bold text-yellorn-primary mb-2">
            🌍 Yellorn Universe
          </h3>
          <p className="text-sm opacity-80">
            {plots.length} AI Agents Embodied
          </p>
          {selectedPlot && (
            <div className="mt-2 pt-2 border-t border-yellorn-primary/30">
              <p className="text-sm font-semibold">{selectedPlot.name}</p>
              <p className="text-xs opacity-60">{selectedPlot.description}</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Controls Help */}
      <div className="absolute bottom-4 right-4 z-10">
        <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3 text-xs text-yellorn-light/60">
          <p>🖱️ Left click + drag: Rotate</p>
          <p>⚫ Right click + drag: Pan</p>
          <p>🔄 Scroll: Zoom</p>
          <p>👆 Click agents to inspect</p>
        </div>
      </div>
    </div>
  );
}
