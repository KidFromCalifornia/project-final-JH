// TestEnvAPI.jsx - Test using environment variables
import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Paper, CircularProgress } from '@mui/material';

const TestEnvAPI = () => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiBaseUrl, setApiBaseUrl] = useState('');
  const [isLocalDev, setIsLocalDev] = useState(true);

  useEffect(() => {
    // Get the API URL from environment variables
    const envApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
    setApiBaseUrl(envApiUrl);

    // Check if we're in local development
    setIsLocalDev(window.location.hostname === 'localhost');
  }, []);

  const testFetch = async () => {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      console.log('Starting fetch test using env variable...');
      const apiUrl = `${apiBaseUrl}/cafes`;
      console.log(`Fetching from: ${apiUrl}`);

      const response = await fetch(apiUrl);
      console.log('Response status:', response.status);
      console.log('Response headers:', [...response.headers.entries()]);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Data received:', data);
      setResult(`Success! Received ${data.data?.length || 0} cafes from ${apiUrl}`);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(`Error: ${err.message} when fetching from ${apiBaseUrl}/cafes`);
    } finally {
      setLoading(false);
    }
  };

  const testProxyFetch = async () => {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      console.log('Starting fetch test using relative path for proxy...');
      const apiUrl = '/api/cafes';
      console.log(`Fetching from: ${apiUrl}`);

      const response = await fetch(apiUrl);
      console.log('Response status:', response.status);
      console.log('Response headers:', [...response.headers.entries()]);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Data received:', data);
      setResult(`Success! Received ${data.data?.length || 0} cafes from ${apiUrl}`);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(`Error: ${err.message} when fetching from /api/cafes`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Environment API Test
      </Typography>
      <Typography variant="body1" gutterBottom>
        Current API Base URL: <code>{apiBaseUrl}</code>
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button variant="contained" onClick={testFetch} disabled={loading}>
          Test with Environment URL
        </Button>

        <Button
          variant="contained"
          color="secondary"
          onClick={testProxyFetch}
          disabled={loading || isLocalDev}
          title={isLocalDev ? 'Proxy URL only works in production environment' : ''}
        >
          Test with Proxy URL (/api/cafes)
        </Button>
      </Box>

      {isLocalDev && (
        <Paper sx={{ p: 2, mb: 2, bgcolor: 'info.light' }}>
          <Typography>
            Note: The proxy URL test is disabled in local development because the Netlify proxy
            configuration only works when deployed to Netlify. In local development, use the
            environment URL instead.
          </Typography>
        </Paper>
      )}

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {result && (
        <Paper sx={{ p: 2, mb: 2, bgcolor: 'success.light' }}>
          <Typography>{result}</Typography>
        </Paper>
      )}

      {error && (
        <Paper sx={{ p: 2, mb: 2, bgcolor: 'error.light' }}>
          <Typography>{error}</Typography>
        </Paper>
      )}
    </Box>
  );
};

export default TestEnvAPI;
