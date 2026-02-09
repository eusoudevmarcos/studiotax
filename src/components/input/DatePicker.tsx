import { useEffect, useState } from 'react';

import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';

export function DatePicker() {
  const [selected, setSelected] = useState<Date>();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <DayPicker
      animate
      mode="single"
      selected={selected}
      onSelect={setSelected}
      footer={
        selected && mounted
          ? `Selected: ${selected.toLocaleDateString()}`
          : 'Pick a day.'
      }
    />
  );
}
