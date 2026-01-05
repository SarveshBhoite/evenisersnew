"use client";

import { createContext, useContext, useEffect, useState } from "react";

// Define the available cities
export const CITIES = ["Mumbai", "Pune", "Delhi", "Bangalore", "Goa", "Jaipur"];

interface LocationContextType {
  city: string;
  setCity: (city: string) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  // Default to first city or load from localStorage
  const [city, setCity] = useState("Mumbai");

  useEffect(() => {
    const savedCity = localStorage.getItem("luxe-city");
    if (savedCity && CITIES.includes(savedCity)) {
      setCity(savedCity);
    }
  }, []);

  const handleSetCity = (newCity: string) => {
    setCity(newCity);
    localStorage.setItem("luxe-city", newCity);
    // Optional: Reload page if you need to fetch new data based on city
    // window.location.reload(); 
  };

  return (
    <LocationContext.Provider value={{ city, setCity: handleSetCity }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
}