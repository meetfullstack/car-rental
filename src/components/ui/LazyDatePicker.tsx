import dynamic from "next/dynamic";

// Splits react-day-picker (calendar) into its own chunk instead of
// shipping it inline with every page that renders a date field.
const DatePicker = dynamic(() => import("./DatePicker"), {
  ssr: false,
  loading: () => (
    <div className="h-[42px] w-full animate-pulse rounded-lg border border-border bg-surface-2" />
  ),
});

export default DatePicker;
