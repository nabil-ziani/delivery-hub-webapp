// ***** DASHBOARD *****
export const navigation = [
    {
        name: "Dashboard",
        href: "/dashboard",
        icon: "solar:home-2-bold",
    },
    {
        name: "Orders",
        href: "/orders",
        icon: "solar:box-bold",
    },
    {
        name: "Menu",
        href: "/menu",
        icon: "solar:menu-dots-bold",
    },
    {
        name: "Settings",
        href: "/settings",
        icon: "solar:settings-bold",
    },
];

export const stats = [
    {
        name: "Total Orders",
        value: "0",
        icon: "solar:box-bold",
        change: "+0%",
        changeType: "positive",
    },
    {
        name: "Revenue",
        value: "€0",
        icon: "solar:dollar-minimalistic-bold",
        change: "+0%",
        changeType: "positive",
    },
    {
        name: "Active Menu Items",
        value: "0",
        icon: "solar:menu-dots-bold",
        change: "0",
        changeType: "neutral",
    },
];

// ***** ONBOARDING *****
export const onboardingSteps = [
    {
        title: "Restaurant",
        description: "Add your restaurant's basic information",
    },
    {
        title: "Contact",
        description: "How customers can reach you",
    },
    {
        title: "Location",
        description: "Where your restaurant is located",
    },
    {
        title: "Opening",
        description: "When you're open for business",
    }
];

export const defaultWorkingHours = {
    monday: { isOpen: true, open: "17:00", close: "22:00" },
    tuesday: { isOpen: true, open: "17:00", close: "22:00" },
    wednesday: { isOpen: true, open: "17:00", close: "22:00" },
    thursday: { isOpen: true, open: "17:00", close: "22:00" },
    friday: { isOpen: true, open: "17:00", close: "23:00" },
    saturday: { isOpen: true, open: "17:00", close: "23:00" },
    sunday: { isOpen: true, open: "17:00", close: "22:00" },
};

export const DAYS = [
    { key: "monday", label: "Monday" },
    { key: "tuesday", label: "Tuesday" },
    { key: "wednesday", label: "Wednesday" },
    { key: "thursday", label: "Thursday" },
    { key: "friday", label: "Friday" },
    { key: "saturday", label: "Saturday" },
    { key: "sunday", label: "Sunday" },
] as const;

export const HOURS = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, "0");
    return { value: `${hour}:00`, label: `${hour}:00` };
});