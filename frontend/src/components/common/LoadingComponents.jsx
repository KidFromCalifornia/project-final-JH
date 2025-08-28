import React from 'react';
import { Box, Card, CardContent, Skeleton } from '@mui/material';
import { useThemeUtils } from '../../hooks/useThemeUtils';

// Enhanced loading cards with coffee-themed styling
export const LoadingTastingCard = () => {
  const { styles, theme } = useThemeUtils();
  
  return (
    <Card sx={{
      ...styles.glassMorphism,
      height: 340,
      mb: 2,
      overflow: 'hidden',
    }}>
      <CardContent sx={{ p: 3, height: '100%' }}>
        {/* Header with coffee icon placeholder */}
        <Box sx={{ ...styles.flexBetween, mb: 2 }}>
          <Skeleton variant="circular" width={32} height={32} />
          <Skeleton variant="rounded" width={80} height={24} />
        </Box>
        
        {/* Cafe name */}
        <Skeleton 
          variant="text" 
          sx={{ 
            fontSize: '1.5rem',
            mb: 1,
            ...styles.skeleton,
          }} 
        />
        
        {/* Rating stars */}
        <Box sx={{ ...styles.centerContent, mb: 2 }}>
          <Skeleton variant="rounded" width={120} height={24} />
        </Box>
        
        {/* Notes text */}
        <Box sx={{ mb: 2 }}>
          <Skeleton variant="text" />
          <Skeleton variant="text" />
          <Skeleton variant="text" width="60%" />
        </Box>
        
        {/* Author and date */}
        <Skeleton variant="text" width="80%" sx={{ mt: 'auto' }} />
      </CardContent>
    </Card>
  );
};

// Loading skeleton for cafe cards
export const LoadingCafeCard = () => {
  const { styles } = useThemeUtils();
  
  return (
    <Card sx={{
      ...styles.glassMorphism,
      height: 280,
      mb: 2,
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ ...styles.flexBetween, mb: 2 }}>
          <Skeleton variant="text" sx={{ fontSize: '1.25rem', width: '70%' }} />
          <Skeleton variant="rounded" width={60} height={20} />
        </Box>
        
        <Skeleton variant="text" sx={{ mb: 1 }} />
        <Skeleton variant="text" sx={{ mb: 2 }} />
        
        <Box sx={{ ...styles.flexBetween }}>
          <Skeleton variant="rounded" width={100} height={32} />
          <Skeleton variant="circular" width={40} height={40} />
        </Box>
      </CardContent>
    </Card>
  );
};

// Loading skeleton for map markers
export const LoadingMapMarker = () => {
  const { styles } = useThemeUtils();
  
  return (
    <Box sx={{
      width: 32,
      height: 32,
      borderRadius: '50%',
      ...styles.skeleton,
      animation: `${styles.shimmer} 1.2s ease-in-out infinite`,
    }} />
  );
};

// Loading page component
export const LoadingPage = ({ message = "Loading..." }) => {
  const { styles, theme } = useThemeUtils();
  
  return (
    <Box sx={{
      ...styles.centerContent,
      minHeight: '60vh',
      flexDirection: 'column',
      gap: 3,
    }}>
      {/* Coffee cup loading animation */}
      <Box sx={{
        fontSize: '4rem',
        animation: 'bounce 1s ease-in-out infinite',
        ...styles.animations?.bounce,
      }}>
        ☕
      </Box>
      
      <Box sx={{ textAlign: 'center' }}>
        <Skeleton 
          variant="text" 
          sx={{ 
            fontSize: '1.5rem',
            width: 200,
            mx: 'auto',
            mb: 1,
          }} 
        />
        <Skeleton 
          variant="text" 
          sx={{ 
            fontSize: '1rem',
            width: 150,
            mx: 'auto',
          }} 
        />
      </Box>
    </Box>
  );
};

// Grid loading component
export const LoadingGrid = ({ count = 6, CardComponent = LoadingTastingCard }) => {
  return (
    <Box sx={{
      display: 'grid',
      gridTemplateColumns: {
        xs: '1fr',
        sm: 'repeat(2, 1fr)',
        md: 'repeat(3, 1fr)',
      },
      gap: 2,
      p: 2,
    }}>
      {Array.from({ length: count }).map((_, index) => (
        <CardComponent key={index} />
      ))}
    </Box>
  );
};

export default {
  LoadingTastingCard,
  LoadingCafeCard,
  LoadingMapMarker,
  LoadingPage,
  LoadingGrid,
};
