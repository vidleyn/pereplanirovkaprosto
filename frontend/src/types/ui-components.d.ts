// Type declarations for UI component dependencies
// These are stub types to prevent TypeScript errors when packages are not installed

declare module '@radix-ui/react-accordion' {
  const content: any;
  export default content;
  export const Root: any;
  export const Item: any;
  export const Header: any;
  export const Trigger: any;
  export const Content: any;
}

declare module '@radix-ui/react-alert-dialog' {
  const content: any;
  export default content;
  export const Root: any;
  export const Trigger: any;
  export const Portal: any;
  export const Overlay: any;
  export const Content: any;
  export const Title: any;
  export const Description: any;
  export const Action: any;
  export const Cancel: any;
}

declare module '@radix-ui/react-aspect-ratio' {
  const content: any;
  export default content;
  export const Root: any;
}

declare module '@radix-ui/react-avatar' {
  const content: any;
  export default content;
  export const Root: any;
  export const Image: any;
  export const Fallback: any;
}

declare module '@radix-ui/react-checkbox' {
  const content: any;
  export default content;
  export const Root: any;
  export const Indicator: any;
}

declare module '@radix-ui/react-collapsible' {
  const content: any;
  export default content;
  export const Root: any;
  export const Trigger: any;
  export const Content: any;
}

declare module '@radix-ui/react-context-menu' {
  const content: any;
  export default content;
  export const Root: any;
  export const Trigger: any;
  export const Portal: any;
  export const Content: any;
  export const Item: any;
  export const CheckboxItem: any;
  export const RadioItem: any;
  export const Label: any;
  export const Separator: any;
  export const Sub: any;
  export const SubTrigger: any;
  export const SubContent: any;
}

declare module '@radix-ui/react-dialog' {
  const content: any;
  export default content;
  export const Root: any;
  export const Trigger: any;
  export const Portal: any;
  export const Overlay: any;
  export const Content: any;
  export const Title: any;
  export const Description: any;
  export const Close: any;
}

declare module '@radix-ui/react-dropdown-menu' {
  const content: any;
  export default content;
  export const Root: any;
  export const Trigger: any;
  export const Portal: any;
  export const Content: any;
  export const Item: any;
  export const CheckboxItem: any;
  export const RadioItem: any;
  export const Label: any;
  export const Separator: any;
  export const Sub: any;
  export const SubTrigger: any;
  export const SubContent: any;
}

declare module '@radix-ui/react-hover-card' {
  const content: any;
  export default content;
  export const Root: any;
  export const Trigger: any;
  export const Portal: any;
  export const Content: any;
}

declare module '@radix-ui/react-label' {
  const content: any;
  export default content;
  export const Root: any;
}

declare module '@radix-ui/react-menubar' {
  const content: any;
  export default content;
  export const Root: any;
  export const Menu: any;
  export const Trigger: any;
  export const Portal: any;
  export const Content: any;
  export const Item: any;
  export const CheckboxItem: any;
  export const RadioItem: any;
  export const Label: any;
  export const Separator: any;
  export const Sub: any;
  export const SubTrigger: any;
  export const SubContent: any;
}

declare module '@radix-ui/react-navigation-menu' {
  const content: any;
  export default content;
  export const Root: any;
  export const List: any;
  export const Item: any;
  export const Trigger: any;
  export const Content: any;
  export const Link: any;
  export const Viewport: any;
  export const Indicator: any;
}

declare module '@radix-ui/react-popover' {
  const content: any;
  export default content;
  export const Root: any;
  export const Trigger: any;
  export const Portal: any;
  export const Content: any;
  export const Close: any;
}

declare module '@radix-ui/react-progress' {
  const content: any;
  export default content;
  export const Root: any;
  export const Indicator: any;
}

declare module '@radix-ui/react-radio-group' {
  const content: any;
  export default content;
  export const Root: any;
  export const Item: any;
  export const Indicator: any;
}

declare module '@radix-ui/react-scroll-area' {
  const content: any;
  export default content;
  export const Root: any;
  export const Viewport: any;
  export const Scrollbar: any;
  export const Thumb: any;
}

declare module '@radix-ui/react-select' {
  const content: any;
  export default content;
  export const Root: any;
  export const Trigger: any;
  export const Portal: any;
  export const Content: any;
  export const Item: any;
  export const ItemText: any;
  export const ItemIndicator: any;
  export const Group: any;
  export const Label: any;
  export const Separator: any;
  export const ScrollUpButton: any;
  export const ScrollDownButton: any;
  export const Viewport: any;
}

declare module '@radix-ui/react-separator' {
  const content: any;
  export default content;
  export const Root: any;
}

declare module '@radix-ui/react-slider' {
  const content: any;
  export default content;
  export const Root: any;
  export const Track: any;
  export const Range: any;
  export const Thumb: any;
}

declare module '@radix-ui/react-slot' {
  export const Slot: any;
}

declare module '@radix-ui/react-switch' {
  const content: any;
  export default content;
  export const Root: any;
  export const Thumb: any;
}

declare module '@radix-ui/react-tabs' {
  const content: any;
  export default content;
  export const Root: any;
  export const List: any;
  export const Trigger: any;
  export const Content: any;
}

declare module '@radix-ui/react-toggle' {
  const content: any;
  export default content;
  export const Root: any;
}

declare module '@radix-ui/react-toggle-group' {
  const content: any;
  export default content;
  export const Root: any;
  export const Item: any;
}

declare module '@radix-ui/react-tooltip' {
  const content: any;
  export default content;
  export const Root: any;
  export const Trigger: any;
  export const Portal: any;
  export const Provider: any;
  export const Content: any;
}

declare module 'class-variance-authority' {
  export function cva(...args: any[]): any;
  export type VariantProps<T> = any;
}

declare module 'clsx' {
  export function clsx(...args: any[]): string;
  export type ClassValue = string | number | boolean | undefined | null | { [key: string]: any } | ClassValue[];
}

declare module 'tailwind-merge' {
  export function twMerge(...args: any[]): string;
}

// lucide-react is installed and has its own types, no stub needed

declare module 'react-day-picker' {
  export const DayPicker: any;
  export type DayPickerProps = any;
}

declare module 'embla-carousel-react' {
  export const useEmblaCarousel: any;
  export type EmblaOptionsType = any;
  export type EmblaPluginType = any;
  export type UseEmblaCarouselType = any;
}

declare module 'recharts' {
  export const LineChart: any;
  export const BarChart: any;
  export const PieChart: any;
  export const AreaChart: any;
  export const XAxis: any;
  export const YAxis: any;
  export const CartesianGrid: any;
  export const Tooltip: any;
  export const Legend: any;
  export const Line: any;
  export const Bar: any;
  export const Pie: any;
  export const Area: any;
  export const Cell: any;
  export const ResponsiveContainer: any;
}

declare module 'cmdk' {
  export const Command: any;
  export type CommandProps = any;
}

declare module 'vaul' {
  export const Drawer: any;
  export type DrawerProps = any;
}

declare module 'input-otp' {
  export const OTPInput: any;
  export const OTPInputContext: any;
  export type OTPInputProps = any;
}

declare module 'react-resizable-panels' {
  export const Panel: any;
  export const PanelGroup: any;
  export const PanelResizeHandle: any;
}

declare module 'next-themes' {
  export const useTheme: any;
  export const ThemeProvider: any;
}

declare module 'sonner' {
  export const Toaster: any;
  export type ToasterProps = any;
  export const toast: any;
}
