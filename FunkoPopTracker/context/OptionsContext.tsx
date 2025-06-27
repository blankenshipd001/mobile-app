// context/OptionsContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { Storage } from "expo-storage";

type Options = {
    groupBySeries: boolean;
    compactMode: boolean;
    sortOrder: "name" | "number";
};

type OptionsContextType = {
  options: Options;
  setOptions: React.Dispatch<React.SetStateAction<Options>>;
  loading: boolean;
};

const OptionsContext = createContext<OptionsContextType | undefined>(undefined);

const STORAGE_KEY = "funko_app_options";

export const OptionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [options, setOptions] = useState<Options>({
    groupBySeries: true,
    compactMode: false,
    sortOrder: "name",
  });

  const [loading, setLoading] = useState(true);

  // Load saved options on mount
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const params: { key: string } = { key: STORAGE_KEY };
        const saved = await Storage.getItem(params);
        if (saved) {
          setOptions(JSON.parse(saved));
        }
      } catch (e) {
        console.error("Failed to load options:", e);
      } finally {
        setLoading(false);
      }
    };
    loadOptions();
  }, []);

  // Save options when changed
  useEffect(() => {
    const saveOptions = async () => {
      try {
        const params: {key: string, value: any} = { key: STORAGE_KEY, value: options };
        await Storage.setItem(params);
      } catch (e) {
        console.error("Failed to save options:", e);
      }
    };
    if (!loading) saveOptions();
  }, [options, loading]);

  return (
    <OptionsContext.Provider value={{ options, setOptions, loading }}>
      {children}
    </OptionsContext.Provider>
  );
};

export const useOptions = () => {
  const ctx = useContext(OptionsContext);
  if (!ctx) throw new Error("useOptions must be used within OptionsProvider");
  return ctx;
};
