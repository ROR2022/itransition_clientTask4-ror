"use client";
import React, { useState, MouseEvent, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { useRouter } from "next/navigation";
//import MedicalInformationIcon from "@mui/icons-material/MedicalInformation";
//import code icon from material ui
import CodeIcon from "@mui/icons-material/Code";
import { useSelector } from "react-redux";
import Image from "next/image";
import { dataAvatares } from "@/dataEnv/dataEnv";
import { useDispatch } from "react-redux";
import { DataUser, setUser } from "@/redux/userSlice";
import {
  LOCALSTORAGE_KEY,
  userSettingsLinks,
  mainNavbarLongText,
  mainNavbarShortText,
  mainLogoUser,
} from "@/dataEnv/dataEnv";
import { useLocalStorage } from "usehooks-ts";
//import { title } from 'process';

const basicPages = [
  { title: "About", url: "/about" },
  { title: "Contact", url: "/contact" },
];
const dataLoginPage = { title: "Login", url: "/login" };
const dataAdminPage = { title: "Admin", url: "/admin" };
const dataLogoutPage = { title: "Logout", url: "/logout" };
const settings = [...userSettingsLinks];

const MyNavbar = () => {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [pages, setPages] = useState(basicPages);
  const user = useSelector((state: any) => state.user);
  const router = useRouter();
  const [storedUser, setStoredUser] = useLocalStorage<DataUser>(
    LOCALSTORAGE_KEY,
    user
  );
  const dispatch = useDispatch();

  useEffect(() => {
    //console.log('user: ',user);
    if (user?.email !== "") {
      setPages([...basicPages, dataAdminPage, dataLogoutPage]);
    }
    if (!user || user?.email === "") {
      setPages([...basicPages, dataLoginPage]);
    }
  }, [user]);

  useEffect(() => {
    if (storedUser) {
      dispatch(setUser(storedUser));
    }
  }, [storedUser]);

  const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = (url: string) => {
    setAnchorElNav(null);
    if (url) {
      router.push(url);
    }
  };

  const handleCloseUserMenu = (url: string) => {
    setAnchorElUser(null);
    if (url) {
      router.push(url);
    }
  };

  return (
    <AppBar position="static" sx={{ bgcolor: "info.light" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {user?.email === "" ? (
            <>
              <CodeIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
              <Typography
                variant="h6"
                noWrap
                component="a"
                href="/"
                sx={{
                  mr: 2,
                  display: { xs: "none", md: "flex" },
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".02rem",
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                {mainNavbarLongText}
              </Typography>
            </>
          ) : (
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: "10px",
              }}
            >
              <Image
                style={{ borderRadius: "50%" }}
                src={
                  dataAvatares.find((avatar) => avatar.title === user?.avatar)
                    ?.url || "/avatar0.png"
                }
                alt="logo"
                width={50}
                height={50}
              />
              <Typography
                style={{
                  textDecoration: "none",
                }}
                variant="h5"
                noWrap
                component="a"
                href="/"
                sx={{ ml: 2 }}
              >
                {user?.username}
              </Typography>
            </Box>
          )}

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={() => handleCloseNavMenu("")}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page.title}
                  onClick={() => handleCloseNavMenu(page.url)}
                >
                  <Typography textAlign="center">{page.title}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {user?.email === "" ? (
            <>
              <CodeIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
              <Typography
                variant="h5"
                noWrap
                component="a"
                href="/"
                sx={{
                  mr: 2,
                  display: { xs: "flex", md: "none" },
                  flexGrow: 1,
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".1rem",
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                {mainNavbarShortText}
              </Typography>
            </>
          ) : (
            <Box
              sx={{
                width: "100%",
                display: { xs: "flex", md: "none" },
                justifyContent: "start",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <Image
                style={{ borderRadius: "50%" }}
                src={
                  dataAvatares.find((avatar) => avatar.title === user?.avatar)
                    ?.url || "/avatar0.png"
                }
                alt="logo"
                width={50}
                height={50}
              />
              <Typography
                style={{
                  textDecoration: "none",
                }}
                variant="h5"
                noWrap
                component="a"
                href="/"
                sx={{ ml: 2 }}
              >
                {user?.username}
              </Typography>
            </Box>
          )}

          <Box
            sx={{
              marginLeft: "50px",
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
            }}
          >
            {pages.map((page) => (
              <Button
                key={page.title}
                onClick={() => handleCloseNavMenu(page.url)}
                sx={{
                  my: 2,
                  color: "GrayText",
                  display: "block",
                  transition: "background-color 0.3s, color 0.3s", // Smooth transition for hover effects
                  "&:hover": {
                    backgroundColor: "primary.main", // Change background color on hover
                    color: "white", // Change text color on hover
                  },
                }}
              >
                {page.title}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open menu">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="logo User" src={mainLogoUser} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={() => handleCloseUserMenu("")}
            >
              {settings.map((setting) => (
                <MenuItem
                  key={setting.title}
                  onClick={() => handleCloseUserMenu(setting.url)}
                >
                  <Typography textAlign="center">{setting.title}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default MyNavbar;
