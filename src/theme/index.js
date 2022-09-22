import { createMuiTheme } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#7c476d',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#fff',
    },
  },
  overrides: {
    MuiButton: {
      text: {
        background: '#29b3af', // 'linear-gradient(45deg, #29b3af 30%, #7c476d 90%)',
        borderRadius: 30,
        border: 0,
        color: 'white',
        height: 48,
        padding: '0 30px',
        boxShadow: '0 3px 5px 2px rgba(41, 179, 135, .3)',
        '&:hover': {
          backgroundColor: 'rgb(183,207,206)',
          'no-tabs': 0,
        },
      },
    },
  },
});

export default theme;
