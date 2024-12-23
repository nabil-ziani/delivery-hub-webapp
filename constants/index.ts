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

// ONBOARDING STEPS
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
    monday: { open: "17:00", close: "22:00" },
    tuesday: { open: "17:00", close: "22:00" },
    wednesday: { open: "17:00", close: "22:00" },
    thursday: { open: "17:00", close: "22:00" },
    friday: { open: "17:00", close: "23:00" },
    saturday: { open: "17:00", close: "23:00" },
    sunday: { open: "17:00", close: "22:00" },
};