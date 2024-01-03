import {createTheme} from '@rneui/themed';

// rneui 主题色
export const theme = createTheme({
  mode: 'light',
  lightColors: {
    primary: '#3368EC', // custom：主题色
    secondary: '#ca71eb',
    background: '#ffffff',
    white: '#ffffff',
    black: '#4F5977', // custom: Text.color
    grey0: '#687290', // custom: text-muted color
    grey1: '#43484d',
    grey2: '#5e6977',
    grey3: '#86939e',
    grey4: '#bdc6cf',
    grey5: '#e1e8ee',
    greyOutline: '#bbb',
    searchBg: '#303337',
    success: '#52c41a',
    warning: '#faad14',
    error: '#ff190c',
    disabled: 'hsl(208, 8%, 90%)',
  },
  components: {
    Button: {
      radius: 100,
    },
    Text: {
      h1Style: {
        fontSize: 24,
        color: '#687290',
      },
      h2Style: {
        fontSize: 21,
        color: '#687290',
      },
      h3Style: {
        fontSize: 18,
        color: '#687290',
      },
      h4Style: {
        fontSize: 16,
      },
    },
  },
});
