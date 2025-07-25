// Shared styles and utilities for the quote extension
export const styles = {
  gradients: {
    primary: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    light: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
    colors: {
      "#DBC4F0": "linear-gradient(135deg, #DBC4F0 0%, #B8A9C9 100%)",
      "#A1CCD1": "linear-gradient(135deg, #A1CCD1 0%, #7FB3D3 100%)",
      "#ACB1D6": "linear-gradient(135deg, #ACB1D6 0%, #8B91C7 100%)",
      "#AAC8A7": "linear-gradient(135deg, #AAC8A7 0%, #88A085 100%)",
    },
  },

  glassmorphism: {
    light: `
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      border: 1px solid rgba(255, 255, 255, 0.18);
      box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
    `,
    dark: `
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-radius: 15px;
      border: 1px solid rgba(255, 255, 255, 0.18);
      box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
    `,
  },
};

export const createGradientFromColor = (color) =>
  styles.gradients.colors[color] ||
  `linear-gradient(135deg, ${color} 0%, ${color} 100%)`;

export const applyStyles = (element, styleString) => {
  const styleRules = styleString.split(";").filter((s) => s.trim());
  styleRules.forEach((style) => {
    const [property, value] = style.split(":").map((s) => s.trim());
    if (property && value) {
      element.style[property.replace(/-([a-z])/g, (g) => g[1].toUpperCase())] =
        value;
    }
  });
};

export const isSettingsPage = () =>
  window.location.pathname === "/settings.html";
