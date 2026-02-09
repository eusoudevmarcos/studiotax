/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 *
 * ATENÇÂO: ESTE METODO SÒ FUNCIONA COM O IMASK
 *
 */
export function dateFullValidate() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();

  return {
    DD: {
      mask: "00",
      placeholderChar: "D",
      from: 1,
      to: 31,
      autofix: true,
      validate: (val: any, masked: any) => {
        const year = Number(masked.blocks?.YYYY?.value);
        const month = Number(masked.blocks?.MM?.value);

        if (
          !isNaN(year) &&
          !isNaN(month) &&
          year === currentYear &&
          month === currentMonth
        ) {
          return Number(val) <= currentDay;
        }
        return true;
      },
    },
    MM: {
      mask: "00",
      placeholderChar: "M",
      from: 1,
      to: 12,
      autofix: true,
      validate: (val: any, masked: any) => {
        const year = Number((masked as any).blocks?.YYYY?.value);

        if (!isNaN(year) && year === currentYear) {
          return Number(val) <= currentMonth;
        }
        return true;
      },
    },
    YYYY: {
      mask: "0000",
      placeholderChar: "Y",
      from: 1900,
      to: currentYear,
      autofix: true,
    },
  };
}
