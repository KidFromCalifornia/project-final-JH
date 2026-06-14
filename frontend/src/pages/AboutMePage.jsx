import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Link,
  Divider,
  Dialog,
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import { Instagram as InstagramIcon } from '@mui/icons-material';
import LoginForm from '../components/forms/LoginForm.jsx';

const AboutMePage = () => {
  const theme = useTheme();
  const [tapCount, setTapCount] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const tapTimer = useRef(null);

  const handleLogoTap = () => {
    setTapCount((prev) => {
      const next = prev + 1;
      if (next >= 3) {
        setShowLogin(true);
        return 0;
      }
      clearTimeout(tapTimer.current);
      tapTimer.current = setTimeout(() => setTapCount(0), 2000);
      return next;
    });
  };

  useEffect(() => {
    document.title = 'About — Stockholm Coffee Club';
    const setMeta = (name, content, prop = false) => {
      const attr = prop ? 'property' : 'name';
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) { el = document.createElement('meta'); el.setAttribute(attr, name); document.head.appendChild(el); }
      el.setAttribute('content', content);
    };
    setMeta('description', 'Stockholm Coffee Club is a community map of the city\'s specialty coffee scene — discover cafes, roasters, and third wave spots across Stockholm.');
    setMeta('og:title', 'About — Stockholm Coffee Club', true);
    setMeta('og:description', 'A community map of Stockholm\'s specialty coffee scene. Discover cafes, roasters, and third wave spots across the city.', true);
    setMeta('og:url', 'https://stockholmscoffeeclub.com/about', true);
    return () => { document.title = 'Stockholm Coffee Club'; };
  }, []);

  return (
    <>
    <Container component="section" maxWidth="md" sx={{ py: 4, px: { xs: 2, sm: 3, md: 4 } }}>
      <Paper
        elevation={3}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: { sx: 'center', sm: 'flex-start' },
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: 2,
          backgroundColor:
            theme.palette.mode === 'dark'
              ? alpha(theme.palette.secondary.main, 0.6)
              : theme.palette.background.paper,
          mb: 4,
          boxShadow: theme.shadows[3],
          mt: 4,
        }}
      >
        <Box sx={{ mb: 3, alignContent: 'center' }}>
          {/* Screen reader accessible H1 */}
          <Typography
            variant="h1"
            component="h1"
            sx={{
              position: 'absolute',
              width: '1px',
              height: '1px',
              padding: 0,
              margin: '-1px',
              overflow: 'hidden',
              clip: 'rect(0, 0, 0, 0)',
              whiteSpace: 'nowrap',
              border: 0,
            }}
          >
            Stockholm's Coffee Club
          </Typography>

          <Typography
            mt={2}
            variant="h2"
            component="h2"
            gutterBottom
            color={theme.palette.light.main}
            onClick={handleLogoTap}
            sx={{
              textTransform: 'uppercase',
              fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' },
              textAlign: { xs: 'center', sm: 'left' },
              cursor: 'default',
              userSelect: 'none',
            }}
          >
            Stockholm's Coffee Club
          </Typography>

          <Typography
            variant="body1"
            color={theme.palette.light.main}
            paragraph
            sx={{
              fontSize: { xs: '1rem', sm: '1.1rem' },
              mb: 2,
              textAlign: { xs: 'center', sm: 'left' },
            }}
          >
            Stockholm Coffee Club exists to bring that community together. A place to discover new
            spots, share what you're drinking, and connect with other people who care about great
            coffee. Whether you're a seasoned third-wave regular or just starting to explore what
            specialty coffee is all about, there's a place for you here.
          </Typography>

          <Typography
            variant="body1"
            color={theme.palette.light.main}
            paragraph
            sx={{
              fontSize: { xs: '1rem', sm: '1.1rem' },
              mb: 2,
              textAlign: { xs: 'center', sm: 'left' },
            }}
          >
            This is about more than just finding a good cup. It's about building something together
            — a growing map of the city's coffee culture, shaped by the people who live and breathe
            it every day and one small step in to the future.
          </Typography>

          <Box display="flex" justifyContent={{ xs: 'center', sm: 'flex-start' }} mb={4}>
            <Link
              href="https://www.instagram.com/stockholmscoffeeclub"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit Stockholm's Coffee Club Instagram profile (opens in new tab)"
              sx={{ textDecoration: 'none' }}
            >
              <Typography
                textTransform="uppercase"
                fontWeight="bold"
                color={theme.palette.accentStrong?.main || theme.palette.light.main}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: { xs: 'center', sm: 'flex-start' },
                }}
              >
                <InstagramIcon sx={{ fontSize: { xs: '4.8rem', sm: '4.8rem' }, mr: 1 }} />
                <span>
                  Follow us on
                  <br />
                  Instagram
                </span>
              </Typography>
            </Link>
          </Box>
        </Box>

        <Typography
          variant="body2"
          color={theme.palette.light.main}
          sx={{
            mt: 4,
            textAlign: 'center',
            fontSize: { xs: '0.7rem', sm: '0.8rem' },
            opacity: 0.8,
          }}
        >
          © 2025 Stockholm's Coffee Club
        </Typography>
      </Paper>
    </Container>

    <Dialog open={showLogin} onClose={() => setShowLogin(false)} maxWidth="xs" fullWidth>
      <LoginForm setIsAdmin={(val) => { localStorage.setItem('admin', val); setShowLogin(false); window.location.href = '/admin'; }} onClose={() => setShowLogin(false)} />
    </Dialog>
    </>
  );
};

export default AboutMePage;
