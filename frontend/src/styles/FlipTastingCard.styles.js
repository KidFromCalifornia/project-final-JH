import { styled } from '@mui/material/styles';
import { Card, Box, Typography } from '@mui/material';

const family = "'Sen', sans-serif";

export const StyledCard = styled(Card)(({ theme }) => ({
  minWidth: 280,
  position: 'relative',
  boxShadow: theme.shadows[8],
  overflow: 'visible',
  borderRadius: theme.shape.borderRadius * 3,
  transition: theme.transitions.create(['transform', 'box-shadow'], {
    duration: theme.transitions.duration.standard,
  }),

  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[16],
    '& .Shadow1': {
      bottom: '-1.5rem',
    },
    '& .Shadow2': {
      bottom: '-2.5rem',
    },
  },

  '&:before': {
    content: '""',
    position: 'absolute',
    zIndex: 0,
    display: 'block',
    width: '100%',
    bottom: -1,
    height: '100%',
    borderRadius: theme.shape.borderRadius * 3,
    backgroundColor:
      theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[200],
    opacity: 0.3,
  },
}));

export const BoxMain = styled(Box)(({ theme }) => ({
  overflow: 'hidden',
  borderTopLeftRadius: theme.shape.borderRadius * 3,
  borderTopRightRadius: theme.shape.borderRadius * 3,
  zIndex: 1,
  background:
    theme.palette.mode === 'dark'
      ? `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`
      : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  position: 'relative',

  '&:after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    display: 'block',
    width: '100%',
    height: '100%',
    background:
      theme.palette.mode === 'dark'
        ? 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0))'
        : 'linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0))',
  },
}));

export const StyledDivContent = styled('div')(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  width: '100%',
  zIndex: 1,
  padding: theme.spacing(3, 3, 2),
}));

export const StyledDivTag = styled('div')(({ theme }) => ({
  display: 'inline-block',
  fontFamily: theme.typography.fontFamily,
  backgroundColor: theme.palette.secondary.main,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(0.25, 1),
  color: theme.palette.secondary.contrastText,
  marginBottom: theme.spacing(1),
  fontSize: theme.typography.caption.fontSize,
  fontWeight: theme.typography.fontWeightBold,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
}));

export const TypographyTitle = styled(Typography)(({ theme }) => ({
  fontFamily: theme.typography.h4.fontFamily || family,
  fontSize: theme.typography.h5.fontSize,
  fontWeight: theme.typography.h4.fontWeight,
  color: theme.palette.common.white,
  lineHeight: 1.2,
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  marginBottom: theme.spacing(1),
}));

export const RowAuthor = styled('div')(({ theme }) => ({
  display: 'flex',
  minWidth: 0,
  padding: theme.spacing(2, 3, 3),
  margin: 0,
  backgroundColor: theme.palette.background.paper,
  zIndex: 1,
  position: 'relative',
  borderBottomLeftRadius: theme.shape.borderRadius * 3,
  borderBottomRightRadius: theme.shape.borderRadius * 3,
  alignItems: 'center',
}));

export const Shadow = styled('div')(({ theme }) => ({
  transition: theme.transitions.create(['bottom'], {
    duration: theme.transitions.duration.short,
  }),
  position: 'absolute',
  zIndex: 0,
  width: '88%',
  height: '100%',
  bottom: 0,
  borderRadius: theme.shape.borderRadius * 3,
  backgroundColor:
    theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[200],
  opacity: 0.4,
  left: '50%',
  transform: 'translateX(-50%)',
  '& + &': {
    bottom: 0,
    width: '72%',
    opacity: 0.2,
  },
}));

export const TastingNotesContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(0.5),
  marginTop: theme.spacing(1),
}));
