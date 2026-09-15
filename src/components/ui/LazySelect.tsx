import dynamic from "next/dynamic";

// Splits the Radix Select bundle into its own chunk instead of shipping
// it inline with every page that renders a dropdown.
const Select = dynamic(() => import("./Select"), {
  ssr: false,
  loading: () => (
    <div className="h-[42px] w-full animate-pulse rounded-lg border border-border bg-surface-2" />
  ),
});

export default Select;
