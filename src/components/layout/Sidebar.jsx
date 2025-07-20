import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Toolbar,
  Box,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  ShoppingCart as ProductsIcon,
  Receipt as OrdersIcon,
  BarChart as AnalyticsIcon,
  Settings as SettingsIcon,
  Category as CategoryIcon,
  Build as EngineerIcon,
  Storefront as ShopIcon,
  Campaign as AdsIcon,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

const drawerWidth = 240;

const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
  { text: "Shop", icon: <ShopIcon />, path: "/shop" },
  { text: "Products", icon: <ProductsIcon />, path: "/products" },
  { text: "Engineer", icon: <EngineerIcon />, path: "/engineers" },
  { text: "Ads", icon: <AdsIcon />, path: "/ads" },
  { text: "Orders", icon: <OrdersIcon />, path: "/orders" },
  { text: "Analytics", icon: <AnalyticsIcon />, path: "/analytics" },
  { text: "Settings", icon: <SettingsIcon />, path: "/settings" },
];

const Sidebar = ({ open, onClose }) => {
  const navigate = useNavigate();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
      }}>
      <Toolbar />
      <Box sx={{ overflow: "auto" }}>
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => navigate(item.path)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
        <Divider />
      </Box>
    </Drawer>
  );
};

export default Sidebar;
