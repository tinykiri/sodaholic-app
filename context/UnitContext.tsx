import { UNITS } from "@/store/store";
import { createContext, useState } from "react";

type Unit = {
  unit: string;
  setUnit: (unit: string) => void;
}

const UnitToggleContext = createContext<Unit>({} as Unit);

export default function UnitToggleProvider({ children }: { children: React.ReactNode }) {
  const [unit, setUnit] = useState<string>(UNITS.ML);

  return (
    <UnitToggleContext.Provider value={{ unit, setUnit }}>
      {children}
    </UnitToggleContext.Provider>
  )
}

export { UnitToggleContext };
