// Brand Colors Configuration
export const brandColors = {
  // Primary Colors
  primary: '#2a7504ff', // Main green color
  primaryDark: '#389e0d', // Darker green
  primaryLight: '#b7eb8f', // Lighter green
  
  // Status Colors
  success: '#3dad05ff',
  warning: '#faad14',
  error: '#ff4d4f',
  info: '#3ca706ff',
  
  // Neutral Colors
  text: '#000000',
  textSecondary: '#666666',
  border: '#d9d9d9',
  background: '#ffffff',
  backgroundSecondary: '#fafafa',
  
  // Tag Colors
  tagSuccessBg: '#f6ffed',
  tagSuccessBorder: '#b7eb8f',
  tagSuccessText: '#52c41a'
} as const;

// Ant Design Theme Configuration
export const themeConfig = {
  token: {
    colorPrimary: brandColors.primary,
    colorSuccess: brandColors.success,
    colorWarning: brandColors.warning,
    colorError: brandColors.error,
    colorInfo: brandColors.info,
    colorLink: brandColors.primary,
    colorBgBase: brandColors.background,
    colorTextBase: brandColors.text,
    colorBorder: brandColors.border,
  },
} as const;

export type BrandColors = typeof brandColors;
export type ThemeConfig = typeof themeConfig;