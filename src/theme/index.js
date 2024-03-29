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
  typography: { 
    h6: {
      fontWeight: 600,
    },
  },
  
  overrides: {
    MuiButton: {
      contained: {
        backgroundColor: '#2986cc',
        minWidth: '100px',
        color: 'white',
        fontWeight: 'bold',
        margin: '4px',
        '&:hover': {
          backgroundColor: '#29b3af',
          'no-tabs': 0,
        },
      },
      outlined: {
        minWidth: '100px',
        color: '#0000FF',
        fontWeight: 'bold',
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
    MuiTableHead:{
      root: {
        fontWeight:"bold",
      },
    
    },
    MuiTableCell: {
      root: {
        fontWeight: "bold",
        fontSize:18,
      }
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
        },
       
      },  
      
    },
    MuiInput: {
        "&::placeholder": {
          color: "#000"
        },
        // color: "white", // if you also want to change the color of the input, this is the prop you'd use
      
    },
    MuiInputLabel:{
      root: {
        color: "#000",
        fontFamily: "Arial",
        fontWeight: "bold",
        fontSize: 21,
        borderColor: "#2e2e2e",
        borderWidth: "2px",
        "&.Mui-disabled": {
          
          color: "#000",
          fontWeight: "bold",
        }
      },  
    },
    MuiTab: {
      root:{
        color: '#000',
        fontSize: 17,
        fontWeight: "bold",
        "selected": {
          "fontWeight": "bold"
        },  
        "&.Mui-selected": {
          // backgroundColor: theme.palette.secondary.main,
          borderRadius: "25px",
          fontWeight: 'bold',
        }
      }
        },
   
    
    

  },
});

export default theme;
