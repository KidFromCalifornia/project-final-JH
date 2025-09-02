import React from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Avatar,
  Link,
  Divider,
  IconButton,
  Grid,
  Chip,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
  timelineItemClasses,
} from '@mui/lab';
import { useTheme } from '@mui/material/styles';
import {
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
  ArrowBack as ArrowBackIcon,
  Email as EmailIcon,
  Coffee as CoffeeIcon,
  Timeline as TimelineIcon,
  Restaurant as RestaurantIcon,
  Lightbulb as LightbulbIcon,
  School as SchoolIcon,
  Code as CodeIcon,
  AutoGraphTwoTone,
  AirRounded,
  Subtitles,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const AboutMePage = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ py: 4, px: { xs: 2, sm: 3, md: 4 } }}>
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: 2,
          backgroundColor: theme.palette.background.paper,
          mb: 4,
          boxShadow: theme.shadows[3],
          mt: 4,
        }}
      >
        <Box xs={{ mb: 3, alignContent: 'center' }}>
          <Typography
            mt={2}
            variant="h1"
            component="h1"
            gutterBottom
            textAlign="center"
            color={theme.palette.text.secondary}
            sx={{
              display: 'flex',
              alignItems: 'center',

              flexWrap: 'wrap',
              textAlign: 'center',
              textTransform: 'uppercase',
            }}
          >
            About Stockholm's Coffee Club
          </Typography>
          <Typography
            variant="body1"
            color={theme.palette.text.secondary}
            paragraph
            sx={{ msTextAutospace: 'auto', fontSize: { xs: '0.9rem', sm: '1.2rem' }, mb: 4 }}
          >
            Stockholm's Coffee Club is my capstone project for the Technigo Boot Camp. As a coffee
            lover new to Stockholm, I wanted to create an application that helps enthusiasts
            discover specialty coffee shops, track their tastings, and contribute to a
            community-driven database of great coffee experiences.
          </Typography>
        </Box>
        <Grid mb={4} container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <Paper
              elevation={1}
              sx={{
                p: { xs: 1.5, sm: 2 },
                height: '100%',
                backgroundColor:
                  theme.palette.mode === 'dark'
                    ? theme.palette.background.paper
                    : theme.palette.grey[50],
              }}
            >
              <Typography
                variant="subtitle1"
                gutterBottom
                fontWeight="bold"
                sx={{ fontSize: { xs: '0.95rem', sm: '1.1rem' } }}
              >
                Key Features
              </Typography>
              <Typography
                component="ul"
                sx={{
                  pl: 2,
                  fontSize: { xs: '0.85rem', sm: '0.95rem' },
                  '& li': { mb: 0.5 },
                }}
              >
                <li>Interactive map of Stockholm's specialty coffee scene</li>
                <li>Personal coffee tasting journal</li>
                <li>Community submissions for new cafes</li>
                <li>Accessibility-focused design</li>
                <li>Dark/light mode for all lighting conditions</li>
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper
              elevation={1}
              sx={{
                p: { xs: 1.5, sm: 2 },
                height: '100%',
                backgroundColor:
                  theme.palette.mode === 'dark'
                    ? theme.palette.background.paper
                    : theme.palette.grey[50],
              }}
            >
              <Typography
                variant="subtitle1"
                gutterBottom
                fontWeight="bold"
                sx={{ fontSize: { xs: '0.95rem', sm: '1.1rem' } }}
              >
                Technologies Used
              </Typography>
              <Typography
                component="ul"
                sx={{
                  pl: 2,
                  fontSize: { xs: '0.85rem', sm: '0.95rem' },
                  '& li': { mb: 0.5 },
                }}
              >
                <li>Frontend: React, Material UI, MapLibre GL</li>
                <li>State Management: Zustand</li>
                <li>Backend: Node.js, Express, MongoDB</li>
                <li>Authentication: JWT</li>
                <li>Deployment: Netlify (frontend), Heroku (backend)</li>
              </Typography>
            </Paper>
          </Grid>
        </Grid>
        <Divider color={theme.palette.light.main} sx={{ my: 4 }} />
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'center', sm: 'center' },
            justifyContent: 'center',
            alignContent: 'center',
            gap: { xs: 2, sm: 4 },
            padding: { xs: 2, sm: 3 },
          }}
        >
          <img
            src="/Jhicks.svg"
            alt="Jonny Hicks"
            style={{
              width: '15rem',
              height: '100%',
            }}
          />

          <Box
            sx={{
              width: '65%',
              textAlign: { xs: 'center', sm: 'left' },
              display: 'flex',
              flexDirection: 'column',
              alignContent: 'left',
              float: 'right',
              justifyContent: 'flex-end',
              alignItems: { xs: 'center', sm: 'flex-start' },
              marginTop: { xs: 1, sm: 0 },
            }}
          >
            <Typography
              variant="h4"
              component="h2"
              color="text.secondary"
              sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem' } }}
              mb={2}
            >
              Jonny Hicks
            </Typography>
            <Typography
              variant="subtitle2"
              textAlign={{ xs: 'center', sm: 'left' }}
              color="text.secondary"
              sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
              mb={1}
            >
              Full Stack Developer | Veteran Coffee Professional
            </Typography>
            <Typography color="text.secondary" variant="body1" paragraph>
              I'm a passionate UX developer based in Stockholm with a background in design and a
              focus on creative solutions, accessible web applications with real user needs in mind.
            </Typography>

            <Box
              sx={{
                display: 'flex',
                gap: 1,
                justifyContent: { xs: 'center', sm: 'flex-start' },
              }}
            >
              <IconButton
                component="a"
                href="https://github.com/KidFromCalifornia"
                target="_blank"
                aria-label="GitHub profile"
                sx={{ color: theme.palette.text.secondary }}
              >
                <GitHubIcon />
              </IconButton>
              <IconButton
                component="a"
                href="https://linkedin.com/in/jonathanhicks"
                target="_blank"
                aria-label="LinkedIn profile"
                sx={{ color: theme.palette.text.secondary }}
              >
                <LinkedInIcon />
              </IconButton>
              <IconButton
                component="a"
                href="mailto:jonathanhicks.tech@gmail.com"
                aria-label="Email me"
                sx={{ color: theme.palette.text.secondary }}
              >
                <EmailIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>

        <Divider color={theme.palette.light.main} sx={{ my: 4 }} />

        <Typography
          variant="h5"
          component="h3"
          color={theme.palette.text.secondary}
          gutterBottom
          textTransform="uppercase"
        >
          Technical Skills
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: { xs: 0.5, sm: 1 },
            mb: 3,
            justifyContent: { xs: 'center', sm: 'flex-start' },
          }}
        >
          {[
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
          ].map((skill) => (
            <Chip
              key={skill}
              label={skill}
              size="small"
              sx={{
                bgcolor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                fontWeight: 500,
                m: 0.5,
                height: { xs: '24px', sm: '32px' },
              }}
            />
          ))}
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography
          variant="h6"
          component="h3"
          gutterBottom
          sx={{
            display: 'flex',
            alignItems: 'center',
            fontSize: { xs: '1.1rem', sm: '1.25rem' },
          }}
        >
          <CoffeeIcon sx={{ mr: 1 }} /> My Coffee Journey
        </Typography>
        <Typography variant="body1" paragraph sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
          My passion for coffee began during my time in California, where I first discovered the
          depth and complexity of specialty coffee. Moving to Stockholm introduced me to the vibrant
          Nordic coffee culture, known for its light roasts and emphasis on transparency in
          sourcing.
        </Typography>
        <Typography variant="body1" paragraph sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
          This project combines my love for coffee with my skills as a developer. It's been a
          journey of learning, discovery, and lots of caffeine! I hope Stockholm's Coffee Club helps
          others explore and appreciate the exceptional coffee scene that Stockholm has to offer.
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography
          variant="h6"
          component="h3"
          gutterBottom
          sx={{
            display: 'flex',
            alignItems: 'center',
            fontSize: { xs: '1.1rem', sm: '1.25rem' },
          }}
        >
          <TimelineIcon sx={{ mr: 1 }} /> My Career Journey
        </Typography>

        <Timeline
          position="alternate"
          sx={{
            p: { xs: 0, sm: 1 },
            [`& .${timelineItemClasses.root}:before`]: {
              flex: { xs: 0, sm: 1 },
              padding: { xs: '0px 0px', sm: '6px 16px' },
            },
            mb: 2,
          }}
        >
          <TimelineItem>
            <TimelineOppositeContent
              sx={{
                display: { xs: 'none', sm: 'block' },
                flex: { xs: 0, sm: 0.3 },
              }}
              color="text.secondary"
            >
              2005-2023
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color="primary">
                <RestaurantIcon fontSize="small" />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent sx={{ py: { xs: '8px', sm: '12px' }, px: { xs: 1, sm: 2 } }}>
              <Typography
                variant="subtitle2"
                component="span"
                fontWeight="bold"
                sx={{
                  display: { xs: 'block', sm: 'inline' },
                  fontSize: { xs: '0.85rem', sm: '0.95rem' },
                }}
              >
                Hospitality Career
              </Typography>
              <Typography
                display={{ xs: 'block', sm: 'none' }}
                variant="caption"
                color="text.secondary"
                sx={{ mb: 0.5 }}
              >
                2005-2023
              </Typography>
              <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
                18 years in restaurant management, specializing in coffee program development.
              </Typography>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem>
            <TimelineOppositeContent
              sx={{
                display: { xs: 'none', sm: 'block' },
                flex: { xs: 0, sm: 0.3 },
              }}
              color="text.secondary"
            >
              2022
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color="primary">
                <LightbulbIcon fontSize="small" />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent sx={{ py: { xs: '8px', sm: '12px' }, px: { xs: 1, sm: 2 } }}>
              <Typography
                variant="subtitle2"
                component="span"
                fontWeight="bold"
                sx={{
                  display: { xs: 'block', sm: 'inline' },
                  fontSize: { xs: '0.85rem', sm: '0.95rem' },
                }}
              >
                Career Transition
              </Typography>
              <Typography
                display={{ xs: 'block', sm: 'none' }}
                variant="caption"
                color="text.secondary"
                sx={{ mb: 0.5 }}
              >
                2022
              </Typography>
              <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
                Decided to pursue my passion for technology and enrolled in coding courses.
              </Typography>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem>
            <TimelineOppositeContent
              sx={{
                display: { xs: 'none', sm: 'block' },
                flex: { xs: 0, sm: 0.3 },
              }}
              color="text.secondary"
            >
              2023
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color="primary">
                <SchoolIcon fontSize="small" />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent sx={{ py: { xs: '8px', sm: '12px' }, px: { xs: 1, sm: 2 } }}>
              <Typography
                variant="subtitle2"
                component="span"
                fontWeight="bold"
                sx={{
                  display: { xs: 'block', sm: 'inline' },
                  fontSize: { xs: '0.85rem', sm: '0.95rem' },
                }}
              >
                Technigo Boot Camp
              </Typography>
              <Typography
                display={{ xs: 'block', sm: 'none' }}
                variant="caption"
                color="text.secondary"
                sx={{ mb: 0.5 }}
              >
                2023
              </Typography>
              <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
                Enrolled in an intensive full-stack JavaScript development program.
              </Typography>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem>
            <TimelineOppositeContent
              sx={{
                display: { xs: 'none', sm: 'block' },
                flex: { xs: 0, sm: 0.3 },
              }}
              color="text.secondary"
            >
              2024
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color="primary">
                <CodeIcon fontSize="small" />
              </TimelineDot>
            </TimelineSeparator>
            <TimelineContent sx={{ py: { xs: '8px', sm: '12px' }, px: { xs: 1, sm: 2 } }}>
              <Typography
                variant="subtitle2"
                component="span"
                fontWeight="bold"
                sx={{
                  display: { xs: 'block', sm: 'inline' },
                  fontSize: { xs: '0.85rem', sm: '0.95rem' },
                }}
              >
                Developer Career
              </Typography>
              <Typography
                display={{ xs: 'block', sm: 'none' }}
                variant="caption"
                color="text.secondary"
                sx={{ mb: 0.5 }}
              >
                2024
              </Typography>
              <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
                Launching my career as a full-stack developer, combining my hospitality experience
                with technical skills.
              </Typography>
            </TimelineContent>
          </TimelineItem>
        </Timeline>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: 4,
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Link
            href="https://github.com/KidFromCalifornia/project-final-JH"
            target="_blank"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: theme.palette.primary.main,
              fontWeight: 'bold',
              '&:hover': { textDecoration: 'underline' },
              fontSize: { xs: '0.9rem', sm: '1rem' },
            }}
          >
            <GitHubIcon sx={{ mr: 1, fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
            View Project on GitHub
          </Link>

          <Link
            href="https://stockholms-coffee-club.netlify.app/"
            target="_blank"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: theme.palette.secondary.main,
              fontWeight: 'bold',
              '&:hover': { textDecoration: 'underline' },
              fontSize: { xs: '0.9rem', sm: '1rem' },
            }}
          >
            <CoffeeIcon sx={{ mr: 1, fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
            Visit Live Demo
          </Link>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
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
