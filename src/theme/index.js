import { createMuiTheme } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    primary: {
      // main: '#7c476d', #2986cc
      main: '#f8f8ff',
    },
    secondary: {
      main: '#19857b',
    },
    third: {
      main: '#2986cc',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#fff',
    },
    action: {
      disabledBackground: '#5b5b5b',
      disabled: '#ffffff'
    }
  },
  overrides: {
    MuiButton: {
      contained: {
        backgroundColor: '#2986cc',
        minWidth: '100px',
        color: 'white',
        margin: '4px',
        '&:hover': {
          backgroundColor: '#29b3af',
          'no-tabs': 0,
        },
      },
      outlined: {
        minWidth: '100px',
        color: '#0000FF',
        margin: '3px',
        '&:hover': {
          backgroundColor: '#29b3af',
          'no-tabs': 0,
        },
      },
      
      // text: {
      //   // background: '#29b3af', // 'linear-gradient(45deg, #29b3af 30%, #7c476d 90%)',
      //   // borderRadius: 30,
      //   // border: 0,
      //   // color: 'white',
      //   // height: 48,
      //   // // padding: '0 30px',
      //   // boxShadow: '0 3px 5px 2px rgba(41, 179, 135, .3)',
      //   '&:hover': {
      //     backgroundColor: 'rgb(183,207,206)',
      //     'no-tabs': 0,
      //   },
      // },
    },
    MuiInputLabel: {
      root: {
        color: "#000",
        fontFamily: "Arial",
        fontWeight: "bold",
        borderColor: "#2e2e2e",
        borderWidth: "2px",
      },
    },
    MuiInputBase:{
      root: {
        color: "#000",
        fontFamily: "Arial",
        fontWeight: "bold",
        borderColor: "#2e2e2e",
        borderWidth: "2px",
        "&.Mui-disabled": {
          background: "#eaeaea",
          color: "#000",
          fontWeight: "bold",
        }
      },
      
      
    },
    MuiInputLabel:{
      root: {
        color: "#000",
        fontFamily: "Arial",
        fontWeight: "bold",
        borderColor: "#2e2e2e",
        borderWidth: "2px",
        "&.Mui-disabled": {
          
          color: "#000",
          fontWeight: "bold",
        }
      },  
    }
   
    
    

  },
});

export default theme;
