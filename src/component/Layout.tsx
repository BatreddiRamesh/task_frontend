import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Outlet, useNavigate } from 'react-router-dom';

export default function Layout() {
    const navigate=useNavigate();
  
    const logout = () => {
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("token");
        navigate("/");
      };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            News
          </Typography>
          <Button color="inherit" onClick={()=>navigate("/")} sx={{fontWeight:"bold", backgroundColor: "#4661E6",
            '&:hover': {
              backgroundColor: "#7C91F9",
            }}}>Login</Button>
            <Button color="inherit" onClick={()=>navigate("/register")} sx={{fontWeight:"bold", backgroundColor: "#4661E6",
            '&:hover': {
              backgroundColor: "#7C91F9",
            }}}>Register</Button>
            <Button color="inherit" onClick={logout} sx={{fontWeight:"bold", backgroundColor: "#4661E6",
            '&:hover': {
              backgroundColor: "#7C91F9",
            }}}>Logout</Button>
        </Toolbar>
      </AppBar>
      <Outlet/>
    </Box>
  );
}