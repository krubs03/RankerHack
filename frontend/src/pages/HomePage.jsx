import { Link } from "react-router"
import { SignInButton } from "@clerk/clerk-react"
import { ArrowRightIcon, CheckIcon, Code2Icon, Users2Icon, VideoIcon, ZapIcon } from "lucide-react"
import logoImg from "../../public/logo.png";
import heroImg from "../../public/hero.png";

const HomePage = () => {
    return (
        <div className="bg-linear-to-br from-base-100 to-base-300">
            {/* Navbar */}
            <nav className="bg-base-100/60 backdrop-blur-md border-b
            border-primary/20 sticky top-0 z-50 shadow-lg">
                <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
                    <Link
                        to={"/"}
                        className="flex items-center gap-3 hover:scale-105 transition-transform duration-250"
                    >
                        <div className="size-11 rounded-xl bg-linear-to-br
                        from-secondary via-violet-800 to-accent
                        items-center justify-center flex p-2 shadow-lg">
                            <img className="w-7 h-7" src={logoImg} alt="Logo" />
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
                    <SignInButton mode="modal">
                        <button className="group px-6 py-3 bg-linear-to-r from-primary to-accent rounded-3xl
                        flex items-center shadow-lg hover:shadow-xl duration-200 font-semibold text-white
                        text-l hover:scale-105 gap-2 transition-all">
                            <span>Get Started</span>
                            <ArrowRightIcon className="size-5 transition-transform group-hover:translate-x-1.5 duration-200" />
                        </button>
                    </SignInButton>
                </div>
            </nav>

            {/*Hero Section*/}
            <div className="max-w-7xl mx-auto px-4 py-20">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Side */}
                    <div className="space-y-8">
                        <div className="badge badge-primary badge-lg">
                            <ZapIcon className="size-5" />
                            Online Collaboration
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-black leading-tight">
                            <span className="bg-linear-to-r from-secondary to-accent bg-clip-text text-transparent">
                                Code together,
                            </span>
                            <br />
                            <span className="text-base-content">
                                Learn together
                            </span>
                        </h1>

                        <p className="text-xl text-base-content/60 leading-relaxed max-w-xl">
                            RankerHack is a collaborative coding platform designed to help developers
                            of all skill levels learn, share, and grow together.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <div className="badge badge-lg badge-outline">
                                <CheckIcon className="size-4 text-success" />
                                Code Editor
                            </div>
                            <div className="badge badge-lg badge-outline">
                                <CheckIcon className="size-4 text-success" />
                                Live Video-Calls
                            </div>
                            <div className="badge badge-lg badge-outline">
                                <CheckIcon className="size-4 text-success" />
                                Multiple Languages
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <SignInButton mode="modal">
                                <button className="btn btn-primary btn-lg">
                                    Get Started
                                    <ArrowRightIcon className="size-6" />
                                </button>
                            </SignInButton>

                            {/* Todo: Link to demo video */}
                            <button className="btn btn-dash btn-accent btn-lg">
                                Watch Demo
                                <VideoIcon className="size-6" />
                            </button>
                        </div>

                        <div className="stats stats-vertical lg:stats-horizontal bg-base-100 shadow-lg">
                            <div className="stat">
                                <div className="stat-value bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">12K+</div>
                                <div className="stat-title">Active Users</div>
                            </div>
                            <div className="stat">
                                <div className="stat-value bg-linear-to-r from-secondary to-accent bg-clip-text text-transparent">90K+</div>
                                <div className="stat-title">Sessions</div>
                            </div>
                            <div className="stat">
                                <div className="stat-value bg-linear-to-r from-accent to-primary bg-clip-text text-transparent">98%</div>
                                <div className="stat-title">Uptime</div>
                            </div>
                        </div>

                    </div>

                    {/* Right Side */}
                    <img
                        src={heroImg}
                        alt="Hero Image"
                        className="w-full h-auto mt-10 rounded-3xl shadow-xl border-base-100
                        hover:scale-105 transition-transform duration-300 border-4"
                    />
                </div>

            </div>

            {/* Features/Footer */}
            <div className="max-w-7xl mx-auto px-4 py-20">
                <div className="text-center mb-15">
                    <h2 className="text-4xl font-bold mb-4">
                        All That You Need for <span className="text-accent font-black">Success</span>
                    </h2>
                </div>

                {/* Feature Cards */}
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="card bg-base-100 shadow-xl hover:scale-105 transition-transform duration-200">
                        <div className="card-body items-center text-center">
                            <div className="size-16 bg-primary/20 rounded-2xl flex
                            items-center justify-center mb-4">
                                <VideoIcon className="size-8 text-primary" />
                            </div>
                            <h3 className="card-title">High-Quality Video Calls</h3>
                            <p className="text-base-content/70">
                                Lossless video and audio output to ensure seamless communication for interviews
                            </p>
                        </div>
                    </div>
                    <div className="card bg-base-100 shadow-xl hover:scale-105 transition-transform duration-200">
                        <div className="card-body items-center text-center">
                            <div className="size-16 bg-secondary/20 rounded-2xl flex
                            items-center justify-center mb-4">
                                <Code2Icon className="size-8 text-secondary" />
                            </div>
                            <h3 className="card-title">Live Code-Editor</h3>
                            <p className="text-base-content/70">
                                Real-time collaborative code editor supporting multiple programming languages
                            </p>
                        </div>
                    </div>
                    <div className="card bg-base-100 shadow-xl hover:scale-105 transition-transform duration-200">
                        <div className="card-body items-center text-center">
                            <div className="size-16 bg-accent/20 rounded-2xl flex
                            items-center justify-center mb-4">
                                <Users2Icon className="size-8 text-accent" />
                            </div>
                            <h3 className="card-title">Easy Collaboration</h3>
                            <p className="text-base-content/70">
                                Share your screen, get instant feedback, and work together seamlessly
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomePage
