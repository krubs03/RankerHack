import { ArrowRightIcon, Code2Icon, CrownIcon, LoaderIcon, UsersIcon, ZapIcon } from "lucide-react";
import logoImg from "../../public/logo.png";
import { getDifficultyClass } from "../lib/utils";
import { Link } from "react-router";

const ActiveSessions = ({ sessions, isLoading, isUserInSession }) => {
    return (
        <div className="card lg:col-span-2 bg-base-100 border-2
    border-primary/20 hover:border-primary/40 h-full">
            <div className="card-body">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-linear-to-br from-primary to-secondary rounded-xl">
                            <ZapIcon className="size-5" />
                        </div>
                        <h2 className="text-2xl font-black"> Live Sessions </h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="size-2 bg-success rounded-full" />
                        <span className="text-sm font-medium text-success">{sessions.length} active</span>
                    </div>
                </div>
                {/* Session List */}
                <div className="space-y-3 max-h-100 overflow-y-auto pr-2">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <LoaderIcon className="size-10 animate-spin text-primary" />
                        </div>
                    ) : sessions.length > 0 ? (
                        sessions.map((session) => (
                            <div key={session._id}
                                className="card bg-base-200 border-2 border-secondary/50 hover:border-secondary">
                                <div className="flex items-center justify-between p-5 gap-5">
                                    <div className="flex-1">
                                        <div className="relative size-14 rounded-xl bg-linear-to-br from-primary to-secondary flex items-center justify-center">
                                            <Code2Icon className="size-7 text-white" />
                                            <div className="absolute -top-1 -right-1 size-4 bg-success rounded-full border-2 border-base-300" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="font-bold text-lg truncate">{session.problem}</h3>
                                                <span
                                                    className={`badge badge-sm text-black ${getDifficultyClass(
                                                        session.difficulty
                                                    )}`}
                                                >
                                                    {session.difficulty.slice(0, 1).toUpperCase() +
                                                        session.difficulty.slice(1)}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-4 text-sm opacity-80">
                                                <div className="flex items-center gap-1.5">
                                                    <CrownIcon className="size-4" />
                                                    <span className="font-medium">{session.host?.name}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <UsersIcon className="size-4" />
                                                    <span className="text-xs">{session.participant ? "2/2" : "1/2"}</span>
                                                </div>
                                                {session.participant && !isUserInSession(session) ? (
                                                    <span className="badge badge-error badge-sm text-white">FULL</span>
                                                ) : (
                                                    <span className="badge badge-success badge-sm text-white">OPEN</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {session.participant && !isUserInSession(session) ? (
                                        <button className="btn btn-disabled btn-sm">Full</button>
                                    ) : (
                                        <Link to={`/session/${session._id}`} className="btn btn-primary btn-sm gap-2">
                                            {isUserInSession(session) ? "Rejoin" : "Join"}
                                            <ArrowRightIcon className="size-4" />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-16">
                            <div className="relative size-20 mx-auto rounded-3xl overflow-hidden flex items-center justify-center">
                                <div className="absolute inset-0 bg-linear-to-br from-secondary via-violet-800 to-accent opacity-50" />

                                <img
                                    className="relative z-10 size-10"
                                    src={logoImg}
                                    alt="Logo"
                                />
                            </div>

                            <p className="mt-4 text-lg font-semibold text-base-content/70">
                                No active sessions
                            </p>
                            <p className="text-sm text-base-content/50">
                                Be the first to create one!
                            </p>
                        </div>

                    )}
                </div>
            </div>
        </div>
    );
}

export default ActiveSessions
