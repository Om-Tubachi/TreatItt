import React, { createContext, useContext, useState } from 'react';

interface PickerContextType {
  treatmentProcessSelection: any | null;
  treatmentSelection: any | null;
  setTreatmentProcessSelection: (item: any | null) => void;
  setTreatmentSelection: (item: any | null) => void;
}

const PickerContext = createContext<PickerContextType>({
  treatmentProcessSelection: null,
  treatmentSelection: null,
  setTreatmentProcessSelection: () => {},
  setTreatmentSelection: () => {},
});

export const usePicker = () => useContext(PickerContext);

export const PickerProvider = ({ children }: { children: React.ReactNode }) => {
  const [treatmentProcessSelection, setTreatmentProcessSelection] = useState<any | null>(null);
  const [treatmentSelection, setTreatmentSelection] = useState<any | null>(null);

  return (
    <PickerContext.Provider
      value={{ treatmentProcessSelection, setTreatmentProcessSelection, treatmentSelection, setTreatmentSelection }}
    >
      {children}
    </PickerContext.Provider>
  );
};