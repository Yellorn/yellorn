import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Stats } from '@react-three/drei';
import {
  Box,
  Paper,
  Typography,
  Fab,
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

// Mock data for development
const mockAgents = [
  { id: '1', name: 'Genesis Agent Alpha', position: [0, 0, 0], color: '#00ff88' },
  { id: '2', name: 'Particle Explorer', position: [5, 2, -3], color: '#0088ff' },
  { id: '3', name: 'Geometric Entity', position: [-3, 1, 4], color: '#ff8800' },
];

const AgentCube: React.FC<{ agent: any }> = ({ agent }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <mesh
      position={agent.position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.2 : 1}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={agent.color}
        transparent
        opacity={hovered ? 0.8 : 0.6}
        wireframe={false}
      />
    </mesh>
  );
};

const UniverseViewer: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  return (
    <Box sx={{ position: 'relative', height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
      {/* 3D Universe Canvas */}
      <Canvas
        camera={{ position: [10, 10, 10], fov: 60 }}
        style={{ background: 'radial-gradient(circle, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)' }}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.3} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <pointLight position={[-10, -10, -5]} color="#0088ff" intensity={0.5} />

          {/* Universe Grid */}
          <Grid
            position={[0, -0.5, 0]}
            args={[50, 50]}
            cellSize={1}
            cellThickness={0.5}
            cellColor="#00ff88"
            sectionSize={10}
            sectionThickness={1}
            sectionColor="#ffffff"
            fadeDistance={30}
            fadeStrength={1}
            infiniteGrid
          />

          {/* Agent Embodiments */}
          {mockAgents.map((agent) => (
            <AgentCube key={agent.id} agent={agent} />
          ))}

          {/* Controls */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={5}
            maxDistance={100}
          />

          {/* Performance stats (development only) */}
          <Stats />
        </Suspense>
      </Canvas>

      {/* UI Overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          left: 16,
          zIndex: 1000,
        }}
      >
        <Paper
          sx={{
            p: 2,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
            borderRadius: 2,
            minWidth: 200,
          }}
        >
          <Typography variant="h6" color="primary" gutterBottom>
            Yellorn Genesis Shard
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Digital Universe for AI Embodiment
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip label={`${mockAgents.length} Agents`} size="small" color="primary" />
            <Chip label="3D Mode" size="small" variant="outlined" />
            <Chip label="Real-time" size="small" variant="outlined" />
          </Box>
        </Paper>
      </Box>

      {/* Agent List Drawer */}
      <Fab
        color="primary"
        aria-label="menu"
        sx={{ position: 'absolute', bottom: 16, right: 16, zIndex: 1000 }}
        onClick={toggleDrawer}
      >
        <MenuIcon />
      </Fab>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer}
        PaperProps={{
          sx: {
            width: 320,
            backgroundColor: 'rgba(26, 26, 26, 0.95)',
            backdropFilter: 'blur(20px)',
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" color="primary">
            Active Agents
          </Typography>
          <IconButton onClick={toggleDrawer} color="inherit">
            <CloseIcon />
          </IconButton>
        </Box>

        <List>
          {mockAgents.map((agent) => (
            <ListItem key={agent.id} divider>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  backgroundColor: agent.color,
                  borderRadius: '50%',
                  mr: 2,
                }}
              />
              <ListItemText
                primary={agent.name}
                secondary={`Position: ${agent.position.join(', ')}`}
                primaryTypographyProps={{ color: 'primary' }}
                secondaryTypographyProps={{ color: 'text.secondary' }}
              />
            </ListItem>
          ))}
        </List>

        <Box sx={{ p: 2, mt: 'auto' }}>
          <Fab
            color="primary"
            variant="extended"
            size="medium"
            sx={{ width: '100%' }}
            onClick={() => {
              // Navigate to agent creation
              window.location.href = '/agents';
            }}
          >
            <AddIcon sx={{ mr: 1 }} />
            Register as Agent
          </Fab>
        </Box>
      </Drawer>
    </Box>
  );
};

export default UniverseViewer;
