import React, { createContext, useContext, useState } from "react";
import { MainBottomTabRouteName } from "src/presentation/navigation/main-navigation/bottom-tabs-navigators/types";

type BadgeContextType = {
  badgeTabs: string[];
  addBadgeTab: (tabName: MainBottomTabRouteName) => void;
  removeBadgeTab: (tabName: MainBottomTabRouteName) => void;
};

const BadgeContext = createContext<BadgeContextType | undefined>(undefined);

export const BadgeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [badgeTabs, setBadgeTabs] = useState<string[]>([]);

  const addBadgeTab = (tabName: string) => {
    if(badgeTabs.includes(tabName)) return
    setBadgeTabs((prev) => (prev.includes(tabName) ? prev : [...prev, tabName]));
  };

  const removeBadgeTab = (tabName: string) => {
    if(!badgeTabs) return
    setBadgeTabs((prev) => prev.filter((t) => t !== tabName));
  };

  return (
    <BadgeContext.Provider value={{ badgeTabs, addBadgeTab, removeBadgeTab }}>
      {children}
    </BadgeContext.Provider>
  );
};

export const useBadgeContext = () => {
  const context = useContext(BadgeContext);
  if (!context) throw new Error("useBadgeContext must be used within a BadgeProvider");
  return context;
};
