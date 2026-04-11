import ReactGA from "react-ga4";

const MEASUREMENT_ID = "G-M3T3ELRH63"; // Replace with your real ID

// Initialize GA4
export const initGA = () => {
  ReactGA.initialize(MEASUREMENT_ID);
};

// Track page views
export const trackPageView = (page: string) => {
  ReactGA.send({
    hitType: "pageview",
    page: page,
    title: page,
  });
};

// Track tab switches
export const trackTabSwitch = (tabName: string) => {
  ReactGA.event({
    category: "Navigation",
    action: "Tab Switch",
    label: tabName,
  });
};

// Track wallet connect
export const trackWalletConnect = (address: string) => {
  ReactGA.event({
    category: "Wallet",
    action: "Connect",
    label: address.slice(0, 8) + "...", // Only track partial address for privacy
  });
};

// Track wallet disconnect
export const trackWalletDisconnect = () => {
  ReactGA.event({
    category: "Wallet",
    action: "Disconnect",
  });
};

// Track bridge link clicks
export const trackBridgeClick = (bridgeName: string) => {
  ReactGA.event({
    category: "Bridge",
    action: "Click",
    label: bridgeName,
  });
};

// Track trade button clicks
export const trackTradeClick = (tokenSymbol: string, action: string) => {
  ReactGA.event({
    category: "Trade",
    action: action,
    label: tokenSymbol,
  });
};

// Track alert creation
export const trackAlertCreate = (symbol: string, condition: string) => {
  ReactGA.event({
    category: "Alerts",
    action: "Create",
    label: `${symbol} ${condition}`,
  });
};