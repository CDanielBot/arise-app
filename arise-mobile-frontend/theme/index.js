// USE THIS COLOR FOR BACKGROUND IN REDESIGN
// rgb(250, 249, 255)

export default (theme = {
  primary: '#EE2E2E',
  secondary: '#1A1C1C',

  success: '#4cd964',

  background: {
    screen: '#F4EFEF',
    tab: '#FCE7E7',
    icon: '#F2F2F2'
  },

  border: {
    light: '#ECEBED',
    medium: '#C8C7CC'
  },

  text: {
    title: '#1A1C1C',
    // label: '#C8C7CC',
    label: '#8A8A8F',
    body: {
      light: '#8A8A8F',
      dark: '#1A1C1C'
    },
    error: '#EE2E2E'
  },

  icon: {
    light: '#C8C7CC',
    medium: '#A1A1A1',
    dark: '#8A8A8F',
    black: '#1A1C1C'
  },

  font: {
    weight: {
      regular: 400,
      medium: 500,
      bold: 700
    },

    size: {
      title: 30,
      subtitle: 20,
      header: 17,
      button: 17,
      body: 15,
      secondary: 15,
      tertiary: 13,
      small: 10
    }
  }
})
