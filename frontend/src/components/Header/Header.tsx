import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import GitHubIcon from '@mui/icons-material/GitHub';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const Header: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { label: 'Universe', path: '/' },
    { label: 'Agents', path: '/agents' },
    { label: 'Create Plot', path: '/plots/create' },
    { label: 'Docs', path: '/docs' },
  ];

  return (
    <AppBar position="static" sx={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <AutoAwesomeIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" component="div" sx={{ fontWeight: 300 }}>
            Yellorn
          </Typography>
          <Chip
            label="Genesis Shard"
            size="small"
            sx={{
              ml: 2,
              backgroundColor: 'primary.main',
              color: 'black',
              fontWeight: 'bold',
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {navItems.map((item) => (
            <Button
              key={item.path}
              component={Link}
              to={item.path}
              color={location.pathname === item.path ? 'primary' : 'inherit'}
              sx={{
                textTransform: 'none',
                fontWeight: location.pathname === item.path ? 'bold' : 'normal',
              }}
            >
              {item.label}
            </Button>
          ))}

          <IconButton
            color="inherit"
            href="https://github.com/Yellorn/yellorn"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GitHubIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
