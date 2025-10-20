import React from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Link,
  Divider,
  IconButton,
  Grid,
  Chip,
  List,
  ListItem,
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import {
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
  Email as EmailIcon,
  Instagram as InstagramIcon,
} from '@mui/icons-material';

// Skills array defined outside component to prevent recreation on each render
const skillItems = [
  'JavaScript',
  'React',
  'Node.js',
  'Express',
  'MongoDB',
  'Material UI',
  'HTML/CSS',
  'Git',
  'RESTful APIs',
  'Responsive Design',
  'Accessibility',
  'UI/UX Design',
  'Figma',
  'Jest',
  'MapLibre GL',
];

const AboutMePage = () => {
  const theme = useTheme();

  return (
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
            sx={{
              textTransform: 'uppercase',
              fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' },
              textAlign: { xs: 'center', sm: 'left' },
            }}
          >
            Stockholm's Coffee Club
          </Typography>

          <Typography
            variant="body1"
            color={theme.palette.light.main}
            paragraph
            sx={{
              fontSize: { xs: '0.9rem', sm: '1.1rem' },
              mb: 2,
              textAlign: { xs: 'center', sm: 'left' },
            }}
          >
            Stockholm Coffee Club is a passion project that combines my 15 years in the coffee
            industry with the coding skills I picked up during my time at Technigo's Javascript
            BootCamp. It started back in the winter of 2024 while I was recovering from heart
            surgery.
          </Typography>

          <Typography
            variant="body1"
            color={theme.palette.light.main}
            paragraph
            sx={{
              fontSize: { xs: '0.9rem', sm: '1.1rem' },
              mb: 2,
              textAlign: { xs: 'center', sm: 'left' },
            }}
          >
            What began as a simple idea of displaying Stockholm's specialty coffee spots into an
            Instagram page has now grown into a fullstack web application where coffee lovers can
            discover cafés around them using geotagging, share what they are drinking, store their
            personal coffee diary, and submit new locations for approval.
          </Typography>

          <Typography
            variant="body1"
            color={theme.palette.light.main}
            paragraph
            sx={{
              fontSize: { xs: '0.9rem', sm: '1.1rem' },
              mb: 4,
              textAlign: { xs: 'center', sm: 'left' },
            }}
          >
            The site is built to be intuitive and engaging, with a map of the city's coffee scene
            and a personal journal for keeping track of tastings. It's designed to work smoothly on
            both mobile and desktop, with accessibility in the forefront and features like dark and
            light mode. Under the hood it runs on React, Node, and MongoDB, but at heart it's really
            about connecting people through great coffee in Stockholm.
          </Typography>

          <Box
            display="flex"
            alignItems="center"
            flexDirection={{ xs: 'column', sm: 'row' }}
            justifyContent="center"
            backgroundColor="transparent"
            gap={{ xs: 4, sm: 8 }}
            mb={4}
          >
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
                <InstagramIcon
                  sx={{
                    fontSize: { xs: '4.8rem', sm: '4.8rem' },
                    mr: 1,
                  }}
                />
                <span>
                  Visit our
                  <br />
                  Instagram
                </span>
              </Typography>
            </Link>

            <Link
              href="https://www.technigo.io/courses/javascript-development-bootcamp"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Learn about the Technigo JavaScript Bootcamp (opens in new tab)"
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
                <img
                  src="/techingo_SCC.svg"
                  alt="Technigo logo"
                  style={{
                    width: 'auto',
                    height: '4rem',
                    marginRight: '0.5rem',
                  }}
                />
                <span>
                  Learn about
                  <br />
                  Technigo
                </span>
              </Typography>
            </Link>
          </Box>
        </Box>

        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6}>
            <Paper
              elevation={4}
              sx={{
                p: { xs: 2, sm: 2.5 },
                height: '100%',

                backgroundColor:
                  theme.palette.mode === 'dark'
                    ? alpha(theme.palette.secondary.main, 0.7)
                    : theme.palette.background.default,
              }}
            >
              <Typography
                variant="subtitle1"
                gutterBottom
                fontWeight="bold"
                sx={{
                  fontSize: { xs: '1rem', sm: '1.1rem' },
                  color:
                    theme.palette.mode === 'dark'
                      ? theme.palette.light.main
                      : theme.palette.primary.main,
                }}
              >
                Key Features
              </Typography>

              <List
                role="list"
                aria-label="Key features"
                sx={{
                  listStyleType: 'disc',
                  pl: 2,
                  '& .MuiListItem-root': {
                    display: 'list-item',
                    p: 0,
                    pb: 0.75,
                    color:
                      theme.palette.mode === 'dark'
                        ? theme.palette.light.main
                        : theme.palette.primary.main,
                  },
                }}
              >
                <ListItem role="listitem">
                  Interactive map of Stockholm's specialty coffee scene
                </ListItem>
                <ListItem role="listitem">Personal coffee tasting journal</ListItem>
                <ListItem role="listitem">Community submissions for new cafes</ListItem>
                <ListItem role="listitem">Accessibility-focused design</ListItem>
                <ListItem role="listitem">Dark/light mode for all lighting conditions</ListItem>
              </List>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Paper
              elevation={2}
              sx={{
                p: { xs: 2, sm: 2.5 },
                height: '100%',

                backgroundColor:
                  theme.palette.mode === 'dark'
                    ? alpha(theme.palette.secondary.main, 0.6)
                    : theme.palette.background.default,
                color:
                  theme.palette.mode === 'dark'
                    ? theme.palette.light.main
                    : theme.palette.primary.main,
              }}
            >
              <Typography
                variant="subtitle1"
                gutterBottom
                fontWeight="bold"
                sx={{
                  fontSize: { xs: '1rem', sm: '1.1rem' },
                  color:
                    theme.palette.mode === 'dark'
                      ? theme.palette.light.main
                      : theme.palette.primary.main,
                }}
              >
                Technologies
              </Typography>

              <List
                role="list"
                aria-label="Technologies used"
                sx={{
                  listStyleType: 'disc',
                  pl: 2,
                  '& .MuiListItem-root': {
                    display: 'list-item',
                    p: 0,
                    pb: 0.75,
                  },
                }}
              >
                <ListItem role="listitem">Frontend: React, Material UI, MapLibre GL</ListItem>
                <ListItem role="listitem">State Management: Zustand</ListItem>
                <ListItem role="listitem">Backend: Node.js, Express, MongoDB</ListItem>
                <ListItem role="listitem">Authentication: JWT</ListItem>
                <ListItem role="listitem">
                  Deployment: Netlify (frontend), Heroku (backend)
                </ListItem>
              </List>
            </Paper>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: theme.palette.light?.main || theme.palette.divider }} />

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            gap: { xs: 3, sm: 4 },
            px: { xs: 1, sm: 3 },
          }}
        >
          <img
            src="/Jhicks.svg"
            alt="Jonny Hicks - Profile Illustration"
            style={{
              width: '100%',
              maxWidth: '15rem',
              height: 'auto',
            }}
          />

          <Box
            sx={{
              width: { xs: '100%', sm: '65%' },
              textAlign: { xs: 'center', sm: 'left' },
              display: 'flex',
              flexDirection: 'column',
              alignItems: { xs: 'center', sm: 'flex-start' },
              marginTop: { xs: 1, sm: 0 },
            }}
          >
            <Typography
              variant="h2"
              component="h2"
              color={theme.palette.light.main}
              sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem' } }}
              mb={2}
            >
              Jonny Hicks
            </Typography>

            <Typography
              variant="subtitle2"
              color={theme.palette.light.main}
              sx={{
                fontSize: { xs: '0.9rem', sm: '1rem' },
                textAlign: { xs: 'center', sm: 'left' },
                width: '100%',
              }}
              mb={1}
            >
              Web Developer | Veteran Coffee Professional
            </Typography>

            <Typography
              variant="body1"
              paragraph
              sx={{
                color: theme.palette.light.main,
                fontSize: { xs: '0.9rem', sm: '1rem' },
                textAlign: { xs: 'center', sm: 'left' },
                mb: 2,
              }}
            >
              I'm a passionate UX developer based in Stockholm with a background in design and a
              focus on creative solutions, accessible web applications with real user needs in mind.
            </Typography>

            <Box
              sx={{
                display: 'flex',
                gap: 1.5,
                justifyContent: { xs: 'center', sm: 'flex-start' },
                width: '100%',
              }}
            >
              <IconButton
                component="a"
                href="https://github.com/KidFromCalifornia"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile (opens in new tab)"
                sx={{
                  color: theme.palette.light.main,
                  padding: { xs: '0.5rem', sm: '0.5rem' },
                  '& .MuiSvgIcon-root': {
                    fontSize: { xs: '1.3rem', sm: '1.5rem' },
                  },
                  transition: 'transform 150ms ease-in-out, background-color 120ms ease',
                  '&:hover': {
                    bgcolor: theme.palette.light?.main || theme.palette.grey[300],
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <GitHubIcon />
              </IconButton>

              <IconButton
                component="a"
                href="https://linkedin.com/in/jonathanhicks"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile (opens in new tab)"
                sx={{
                  color: theme.palette.light.main,
                  padding: { xs: '0.5rem', sm: '0.5rem' },
                  '& .MuiSvgIcon-root': {
                    fontSize: { xs: '1.3rem', sm: '1.5rem' },
                  },
                  transition: 'transform 150ms ease-in-out, background-color 120ms ease',
                  '&:hover': {
                    bgcolor: 'none',
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <LinkedInIcon />
              </IconButton>

              <IconButton
                component="a"
                href="mailto:jonny@stockholmscoffeeclub.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Email Jonny (opens mail client)"
                sx={{
                  color: theme.palette.light.main,
                  padding: { xs: '0.5rem', sm: '0.5rem' },
                  '& .MuiSvgIcon-root': {
                    fontSize: { xs: '1.3rem', sm: '1.5rem' },
                  },
                  transition: 'transform 150ms ease-in-out, background-color 120ms ease',
                  '&:hover': {
                    bgcolor: theme.palette.light?.main || theme.palette.grey[300],
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <EmailIcon />
              </IconButton>

              <IconButton
                component="a"
                href="https://www.instagram.com/thekidfromcalifornia"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram profile (opens in new tab)"
                sx={{
                  color: theme.palette.light.main,
                  padding: { xs: '0.5rem', sm: '0.5rem' },
                  '& .MuiSvgIcon-root': {
                    fontSize: { xs: '1.3rem', sm: '1.5rem' },
                  },
                  transition: 'transform 150ms ease-in-out, background-color 120ms ease',
                  '&:hover': {
                    backgroundColor: theme.palette.light?.main || theme.palette.grey[300],
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <InstagramIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 4, borderColor: theme.palette.light?.main || theme.palette.divider }} />

        <Typography
          variant="h2"
          component="h2"
          color={theme.palette.light.main}
          gutterBottom
          textTransform="uppercase"
          mb={3}
          sx={{
            fontSize: { xs: '1.25rem', sm: '1.5rem' },
            textAlign: { xs: 'center', sm: 'left' },
          }}
        >
          Technical Skills
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: { xs: 0.75, sm: 1 },
            mb: 3,
            justifyContent: 'center',
          }}
        >
          {skillItems.map((skill) => (
            <Chip
              key={skill}
              label={skill}
              size="medium"
              sx={{
                fontWeight: 500,
                bgcolor:
                  theme.palette.mode === 'dark'
                    ? alpha(theme.palette.secondary.main)
                    : alpha(theme.palette.secondary.main, 0.09),
                color: theme.palette.light.main,
                m: { xs: 0.3, sm: 0.5 },
                height: { xs: '28px', sm: '32px' },
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                '&:hover': {
                  bgcolor:
                    theme.palette.mode === 'dark'
                      ? alpha(theme.palette.secondary.main)
                      : alpha(theme.palette.secondary.main),
                  transform: 'scale(1.25)',
                },
                transition: 'all 120ms ease',
              }}
            />
          ))}
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
          © 2025 Jonny Hicks • Stockholm's Coffee Club
        </Typography>
      </Paper>
    </Container>
  );
};

export default AboutMePage;
