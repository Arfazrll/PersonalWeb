// Theme configuration for the portfolio
interface ThemeConfig {
    id: string;
    name: string;
    colors: {
      primary: {
        light: string;
        main: string;
        dark: string;
      };
      secondary: {
        light: string;
        main: string;
        dark: string;
      };
      accent: {
        light: string;
        main: string;
        dark: string;
      };
      background: {
        light: string;
        dark: string;
      };
      text: {
        light: string;
        dark: string;
      };
    };
  }
  
  // Default theme with indigo primary color
  const defaultTheme: ThemeConfig = {
    id: 'default',
    name: 'Default',
    colors: {
      primary: {
        light: '#818cf8', // indigo-400
        main: '#6366f1', // indigo-500
        dark: '#4f46e5', // indigo-600
      },
      secondary: {
        light: '#94a3b8', // slate-400
        main: '#64748b', // slate-500
        dark: '#475569', // slate-600
      },
      accent: {
        light: '#6ee7b7', // emerald-300
        main: '#10b981', // emerald-500
        dark: '#059669', // emerald-600
      },
      background: {
        light: '#ffffff', // white
        dark: '#0f172a', // slate-900
      },
      text: {
        light: '#1e293b', // slate-800
        dark: '#f8fafc', // slate-50
      },
    },
  };
  
  // Purple theme variant
  const purpleTheme: ThemeConfig = {
    id: 'purple',
    name: 'Purple',
    colors: {
      primary: {
        light: '#c4b5fd', // violet-400
        main: '#8b5cf6', // violet-500
        dark: '#7c3aed', // violet-600
      },
      secondary: {
        light: '#94a3b8', // slate-400
        main: '#64748b', // slate-500
        dark: '#475569', // slate-600
      },
      accent: {
        light: '#fda4af', // rose-300
        main: '#f43f5e', // rose-500
        dark: '#e11d48', // rose-600
      },
      background: {
        light: '#ffffff', // white
        dark: '#09090b', // zinc-950
      },
      text: {
        light: '#18181b', // zinc-900
        dark: '#fafafa', // zinc-50
      },
    },
  };
  
  // Blue theme variant
  const blueTheme: ThemeConfig = {
    id: 'blue',
    name: 'Blue',
    colors: {
      primary: {
        light: '#93c5fd', // blue-400
        main: '#3b82f6', // blue-500
        dark: '#2563eb', // blue-600
      },
      secondary: {
        light: '#94a3b8', // slate-400
        main: '#64748b', // slate-500
        dark: '#475569', // slate-600
      },
      accent: {
        light: '#fde68a', // amber-300
        main: '#f59e0b', // amber-500
        dark: '#d97706', // amber-600
      },
      background: {
        light: '#ffffff', // white
        dark: '#0c1220', // custom dark blue
      },
      text: {
        light: '#1e293b', // slate-800
        dark: '#f1f5f9', // slate-100
      },
    },
  };
  
  // Collection of available themes
  export const themes: ThemeConfig[] = [
    defaultTheme,
    purpleTheme,
    blueTheme,
  ];
  
  // Get a theme by ID
  export const getThemeById = (id: string): ThemeConfig => {
    return themes.find(theme => theme.id === id) || defaultTheme;
  };
  
  // Apply a theme to CSS variables
  export const applyTheme = (theme: ThemeConfig): void => {
    if (typeof document === 'undefined') return; // Check if running in browser
    
    const root = document.documentElement;
    
    // Set CSS variables
    root.style.setProperty('--color-primary-light', theme.colors.primary.light);
    root.style.setProperty('--color-primary-main', theme.colors.primary.main);
    root.style.setProperty('--color-primary-dark', theme.colors.primary.dark);
    
    root.style.setProperty('--color-secondary-light', theme.colors.secondary.light);
    root.style.setProperty('--color-secondary-main', theme.colors.secondary.main);
    root.style.setProperty('--color-secondary-dark', theme.colors.secondary.dark);
    
    root.style.setProperty('--color-accent-light', theme.colors.accent.light);
    root.style.setProperty('--color-accent-main', theme.colors.accent.main);
    root.style.setProperty('--color-accent-dark', theme.colors.accent.dark);
    
    root.style.setProperty('--color-background-light', theme.colors.background.light);
    root.style.setProperty('--color-background-dark', theme.colors.background.dark);
    
    root.style.setProperty('--color-text-light', theme.colors.text.light);
    root.style.setProperty('--color-text-dark', theme.colors.text.dark);
  };
  
  export default themes;