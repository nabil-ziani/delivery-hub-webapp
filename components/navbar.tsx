import Logo from "@/components/logo";
import { ThemeSwitcher } from "@/components/theme-switcher";

const Navbar = () => {
    return (
        <nav className="w-full flex justify-center h-16">
            <div className="w-full max-w-5xl flex justify-between items-center p-3  text-sm">
                <div className="flex gap-5 items-center font-semibold">
                    <Logo showText />
                    <div className="flex items-center gap-2">

                    </div>
                </div>
                <ThemeSwitcher />
            </div>
        </nav>
    )
}

export default Navbar