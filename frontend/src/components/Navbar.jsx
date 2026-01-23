import { Link, useLocation } from "react-router"
import logoImg from "../../public/logo.png";
import { BookOpenIcon, LayoutDashboardIcon } from "lucide-react";
import { UserButton } from "@clerk/clerk-react";

const Navbar = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bg-base-100/60 backdrop-blur-md border-b border-primary/30 sticky top-0 z-50 shadow-lg">
            <div className="max-w-7xl mx-auto p-4 flex items-center justify-between">
                <Link to={"/"} className="group flex items-center gap-3 hover:scale-105 transition-transform duration-250">
                    <div className="size-11 rounded-xl bg-linear-to-br from-secondary via-violet-800 to-accent
                    items-center justify-center flex p-2 shadow-lg">
                        <img className="size-7" src={logoImg} alt="Logo" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-black text-xl bg-linear-to-r from-accent to-primary
                            bg-clip-text text-transparent font-mono tracking-wider">
                            RankerHack
                        </span>
                        <span className="text-xs font-medium text-base-content/50 -mt-0.5">
                            Let's do this.
                        </span>
                    </div>
                </Link>
                {/* Navigation links */}
                <div className="flex items-center gap-1">
                    {/* Problems Link */}
                    <Link to={"/problems"}
                        className={`px-4 py-2.5 transform-all duration-200 rounded-lg
                    ${isActive("/problems") ? "bg-primary text-primary-content" :
                                "hover:bg-base-200 text-base-content/70 hover:text-base-content"}`}>
                        <div className="flex items-center gap-x-2.5">
                            <BookOpenIcon className="size-5" />
                            <span className="font-medium hidden sm:inline -mt-1">Problems</span>
                        </div>
                    </Link>
                    {/* Dashboard Link */}
                    <Link to={"/dashboard"}
                        className={`px-4 py-2.5 transform-all duration-200 rounded-lg ml-2
                    ${isActive("/dashboard") ? "bg-primary text-primary-content" :
                                "hover:bg-base-200 text-base-content/70 hover:text-base-content"}`}>
                        <div className="flex items-center gap-x-2.5">
                            <LayoutDashboardIcon className="size-5" />
                            <span className="font-medium hidden sm:inline -mt-1">Dashboard</span>
                        </div>
                    </Link>

                    <div className="ml-3">
                        <UserButton />
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
