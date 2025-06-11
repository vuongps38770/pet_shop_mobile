export const colors = {
  // Xanh dương (Blue)
  blue: {
    light: '#E3F0FF',   // Nền, icon, card
    main: '#2979F6',   // Nút, nhấn mạnh
    dark: '#1565C0',   // Hover, border
  },
  // Hồng (Pink)
  pink: {
    light: '#FFE3F0',   // Nền icon
    main: '#FF4081',   // Nút phụ, icon
    dark: '#C51162',
  },
  // Tím (Purple)
  purple: {
    light: '#F3E3FF',
    main: '#9C27B0',
    dark: '#7B1FA2',
  },
  // Vàng (Yellow)
  yellow: {
    light: '#FFF9E3',   // Nền icon, card
    main: '#FFD600',   // Star, rating
    dark: '#FFA000',
  },
  // Xanh lá (Green)
  green: {
    light: '#E3FFE3',
    main: '#4CAF50',   // Success, nút xanh
    dark: '#388E3C',
  },
  // Cam (Orange)
  orange: {
    light: '#FFE0B2',
    main: '#FF9800',
    dark: '#F57C00',
  },
  // Đỏ (Red)
  red: {
    light: '#FFEBEE',
    main: '#F44336',   // Error
    dark: '#B71C1C',
  },
  white: '#FFFFFF',
  black: '#000000',
  // Xám (Grey)
  grey: {
    50: '#FAFAFA',     // Nền rất nhạt
    100: '#F5F5F5',     // Nền card
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#222B45',     // Text đậm
    1000: '#0066FF',
    1100: '#E6F0FF',
  },

  // Các màu cơ bản cho UI
  // background: {
  //   default: '#FFFFFF', // Nền chính
  //   paper:   '#F6F8FA', // Card, block
  //   light:   '#F9FBFC', // Nền phụ
  // },
  background: {
    default: '#FFFFFF', // Nền chính
    paper: '#FFAF42', // Card, block
    light: '#F9FBFC', // Nền 
    transparent: {
      main: 'rgba(255, 255, 255, 0.8)', 
      light: 'rgba(255, 255, 255, 0.5)', 
      lighter: 'rgba(255, 255, 255, 0.3)',
      invincible: 'rgba(255, 255, 255, 0)',
      dark: 'rgba(0, 0, 0, 0.5)' 
    }
  },
  text: {
    primary: '#222B45', // Text chính
    secondary: '#8F9BB3', // Text phụ
    disabled: '#C5CEE0',
    hint: '#C5CEE0',
  },
  border: '#FFAF42',
  shadow: '#E4E9F2',

  // Các màu trạng thái
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#F44336',
  star: '#FFD600',
  buttun: {
    primary: '#FFAF42',
    secondary: '#9C27B0',
    disable: '#9D9D9D'
  },
  app: {
    primary: {
      main: '#FFAF42',    // Màu chính
      light: '#FFC06B',   // 80% độ đậm
      lighter: '#FFD194', // 60% độ đậm
      lightest: '#FFE3B2', // 40% độ đậm
      dark: '#E69E3B',    // 80% độ đậm
      darker: '#CC8D34'   // 60% độ đậm
    }
  }
};