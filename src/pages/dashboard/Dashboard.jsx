import React from 'react';
import { useState,useEffect } from 'react';
import { 
  Grid, 
  Paper, 
  Typography, 
  Box,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Chip,
  useTheme
} 
from '@mui/material';
import axios from 'axios';
import { 
  ShoppingCart as ProductsIcon,
  People as CustomersIcon,
  Receipt as OrdersIcon,
  AttachMoney as RevenueIcon,
  TrendingUp as SalesIcon,
  AccessTime as PendingIcon,
  CheckCircle as CompletedIcon,
  LocalShipping as ShippedIcon,
  Star as StarIcon,
  Warning as WarningIcon,
  SentimentSatisfied as PositiveIcon,
  SentimentNeutral as NeutralIcon,
  SentimentDissatisfied as NegativeIcon,
  Storefront as ShopIcon,
  Build as EngineerIcon,
  Campaign as AdsIcon,
  Group as UsersIcon,
  CheckCircle as ActiveIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import Layout from '../../components/layout/Layout';

// Custom styled components
const GradientPaper = styled(Paper)(({ theme, color }) => ({
  padding: theme.spacing(3),
  color: theme.palette.common.white,
  background: `linear-gradient(135deg, ${color} 0%, ${theme.palette.primary.dark} 100%)`,
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[6],
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[10]
  }
}));

const GlassPaper = styled(Paper)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[4],
  padding: theme.spacing(3)
}));

const StatCard = ({ icon, title, value, color, progress, trend }) => {
  return (
    <GradientPaper color={color}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="subtitle2" sx={{ opacity: 0.8, letterSpacing: 1 }}>
            {title}
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 800, mt: 1, mb: 1 }}>
            {value}
          </Typography>
          {progress && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LinearProgress 
                variant="determinate" 
                value={progress} 
                sx={{ 
                  flexGrow: 1,
                  height: 8,
                  borderRadius: 3,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: 'white'
                  }
                }}
              />
              <Typography variant="caption" sx={{ ml: 1, fontWeight: 600 }}>
                {progress}%
              </Typography>
            </Box>
          )}
          {trend && (
            <Chip 
              label={trend} 
              size="small" 
              sx={{ 
                mt: 1,
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontWeight: 600
              }}
            />
          )}
        </Box>
        <Box sx={{
          backgroundColor: 'rgba(255,255,255,0.2)',
          borderRadius: '50%',
          width: 64,
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {React.cloneElement(icon, { sx: { fontSize: 32 } })}
        </Box>
      </Box>
    </GradientPaper>
  );
};

const RecentOrderItem = ({ id, customer, date, amount, status }) => {
  const statusConfig = {
    'Completed': { icon: <CompletedIcon color="success" />, color: 'success.main' },
    'Pending': { icon: <PendingIcon color="warning" />, color: 'warning.main' },
    'Shipped': { icon: <ShippedIcon color="info" />, color: 'info.main' }
  };

  return (
    <>
      <ListItem sx={{ py: 1.5 }}>
        <ListItemAvatar>
          <Avatar sx={{ 
            bgcolor: 'primary.main',
            fontWeight: 600
          }}>
            {id.substring(1, 3)}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography variant="subtitle2" fontWeight={600}>
              Order {id}
            </Typography>
          }
          secondary={
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
              <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                {customer}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                • {date}
              </Typography>
            </Box>
          }
        />
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          flexDirection: 'column',
          textAlign: 'right'
        }}>
          <Typography variant="subtitle2" fontWeight={700}>
            {amount}
          </Typography>
          <Chip
            label={status}
            size="small"
            icon={statusConfig[status].icon}
            sx={{ 
              mt: 0.5,
              backgroundColor: statusConfig[status].color,
              color: 'white',
              fontSize: '0.7rem'
            }}
          />
        </Box>
      </ListItem>
      <Divider variant="inset" component="li" />
    </>
  );
};

const Dashboard = () => {
  const theme = useTheme();
   const [stats, setStats] = useState({
    totalProducts: 0,
    totalShops: 0,
    totalEngineers: 0,
    activeEngineers: 0,
    totalAds: 0,
    totalUsers: 0,
  });
  console.log("stats",stats)

  useEffect(() => {
    const fetchStats = async () => {
      const  token  = localStorage.getItem("adminToken");
      try {
        const res = await axios.get("http://localhost:5000/api/v1/admin-stats/dashboard-stats",
          {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
        );
        setStats(res.data.stats);
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    };
    fetchStats();
  }, []);

  // Mock data
  const statsCard = [
    { 
      icon: <RevenueIcon />, 
      title: 'MONTHLY REVENUE', 
      value: '$24,589', 
      color: '#9C27B0',
      progress: 85,
      trend: '+12.5%'
    },
    { 
      icon: <OrdersIcon />, 
      title: 'NEW ORDERS', 
      value: '156', 
      color: '#FF9800',
      progress: 65,
      trend: '+8.2%'
    },
    { 
      icon: <CustomersIcon />, 
      title: 'ACTIVE Engineers', 
      value: stats.activeEngineers, 
      color: '#2196F3',
      progress: 72,
      trend: '+5.7%'
    },
    { 
      icon: <ProductsIcon />, 
      title: 'TOTAL PRODUCTS', 
      value: stats.totalProducts, 
      color: '#4CAF50',
      progress: 88,
      trend: '+15.3%'
    },
    { 
      icon: <AdsIcon />, 
      title: 'Total Ads', 
      value: stats.totalAds, 
      color: '#4CAF50',
      progress: 88,
      trend: '+15.3%'
    },
     { 
      icon: <ShopIcon />, 
      title: 'Total Shops', 
      value: stats.totalShops, 
      color: '#4CAF50',
      progress: 88,
      trend: '+15.3%'
    },

  ];

  const recentOrders = [
    { id: '#ORD-1001', customer: 'Sarah Johnson', date: '15 Jun 2023', amount: '$89.97', status: 'Completed' },
    { id: '#ORD-1002', customer: 'Michael Brown', date: '16 Jun 2023', amount: '$145.98', status: 'Pending' },
    { id: '#ORD-1003', customer: 'Emily Davis', date: '17 Jun 2023', amount: '$220.45', status: 'Shipped' },
    { id: '#ORD-1004', customer: 'Robert Wilson', date: '18 Jun 2023', amount: '$34.99', status: 'Completed' },
    { id: '#ORD-1005', customer: 'Jessica Lee', date: '19 Jun 2023', amount: '$178.50', status: 'Pending' },
  ];

  const topProducts = [
    { name: "Hydrating Face Serum", sold: 342, rating: 4.8 },
    { name: "Matte Lipstick Set", sold: 289, rating: 4.6 },
    { name: "Vitamin C Cream", sold: 256, rating: 4.9 },
    { name: "Sunscreen SPF 50", sold: 231, rating: 4.7 },
  ];

  const stockAlerts = [
    { name: "Eyebrow Pencil", stock: 3, daysLeft: 2 },
    { name: "Face Wash", stock: 5, daysLeft: 3 },
    { name: "Night Cream", stock: 2, daysLeft: 1 },
    { name: "Makeup Brushes", stock: 4, daysLeft: 4 },
  ];

  const feedbackSummary = [
    { type: "Positive", count: 187, icon: <PositiveIcon color="success" /> },
    { type: "Neutral", count: 42, icon: <NeutralIcon color="warning" /> },
    { type: "Negative", count: 15, icon: <NegativeIcon color="error" /> },
  ];

  return (
    <Layout>
      <Typography variant="h4" gutterBottom sx={{ 
        fontWeight: 700, 
        color: 'text.primary',
        mb: 4,
        letterSpacing: 0.5
      }}>
        Dashboard Overview
      </Typography>
      
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statsCard.map((stat, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      {/* Middle Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Sales Chart */}
        <Grid item xs={12} md={8}>
          <GlassPaper>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3
            }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                SALES PERFORMANCE
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <SalesIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="subtitle2" color="primary" fontWeight={600}>
                  +12.5% from last month
                </Typography>
              </Box>
            </Box>
            {/* Chart placeholder */}
            <Box sx={{ 
              height: 300, 
              background: `linear-gradient(135deg, ${theme.palette.primary.light}20 0%, ${theme.palette.secondary.light}20 100%)`,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `1px dashed ${theme.palette.divider}`
            }}>
              <Typography variant="body1" color="text.secondary">
                Interactive Sales Chart
              </Typography>
            </Box>
          </GlassPaper>
        </Grid>

        {/* Recent Orders */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ 
            p: 0, 
            borderRadius: 3,
            boxShadow: 4,
            overflow: 'hidden',
            height: '100%'
          }}>
            <Box sx={{ 
              p: 2.5,
              background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
              color: 'common.white'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                RECENT ORDERS
              </Typography>
            </Box>
            <List sx={{ 
              maxHeight: 350,
              overflow: 'auto',
              '&::-webkit-scrollbar': {
                width: '0.4em'
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: theme.palette.divider,
                borderRadius: 2
              }
            }}>
              {recentOrders.map((order, index) => (
                <RecentOrderItem key={index} {...order} />
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Bottom Section */}
      <Grid container spacing={3}>
        {/* Top Products */}
        <Grid item xs={12} md={4}>
          <GlassPaper>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              TOP SELLING PRODUCTS
            </Typography>
            <List dense>
              {topProducts.map((product, idx) => (
                <ListItem key={idx} sx={{ py: 1.5 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ 
                      bgcolor: 'primary.main',
                      width: 40,
                      height: 40
                    }}>
                      {idx + 1}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle2" fontWeight={600}>
                        {product.name}
                      </Typography>
                    }
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                        <Typography variant="caption" sx={{ mr: 2 }}>
                          Sold: {product.sold}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <StarIcon color="warning" sx={{ fontSize: 16, mr: 0.5 }} />
                          <Typography variant="caption">
                            {product.rating}
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </GlassPaper>
        </Grid>

        {/* Stock Alerts */}
        <Grid item xs={12} md={4}>
          <GlassPaper>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              STOCK ALERTS
            </Typography>
            <List dense>
              {stockAlerts.map((item, idx) => (
                <ListItem key={idx} sx={{ py: 1.5 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ 
                      bgcolor: 'error.light',
                      width: 40,
                      height: 40
                    }}>
                      <WarningIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle2" fontWeight={600}>
                        {item.name}
                      </Typography>
                    }
                    secondary={
                      <Box sx={{ display: 'flex', mt: 0.5 }}>
                        <Typography variant="caption" color="error" sx={{ mr: 2 }}>
                          Only {item.stock} left
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.daysLeft}d remaining
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </GlassPaper>
        </Grid>

        {/* Customer Feedback */}
        <Grid item xs={12} md={4}>
          <GlassPaper>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              CUSTOMER FEEDBACK
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              mb: 3
            }}>
              {feedbackSummary.map((fb, idx) => (
                <Box key={idx} sx={{ 
                  textAlign: 'center',
                  p: 2,
                  borderRadius: 2,
                  flex: 1,
                  mx: 0.5,
                  backgroundColor: idx === 0 ? 'success.light' : 
                                 idx === 1 ? 'warning.light' : 'error.light'
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    {React.cloneElement(fb.icon, { sx: { fontSize: 24 } })}
                  </Box>
                  <Typography variant="h5" fontWeight={700} sx={{ mt: 1 }}>
                    {fb.count}
                  </Typography>
                  <Typography variant="caption">
                    {fb.type}
                  </Typography>
                </Box>
              ))}
            </Box>
            <Box sx={{ 
              height: 150, 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 2,
              border: `1px dashed ${theme.palette.divider}`
            }}>
              <Typography variant="body2" color="text.secondary">
                Customer Satisfaction Chart
              </Typography>
            </Box>
          </GlassPaper>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Dashboard;