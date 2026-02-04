import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router"
import { useEndSession, useJoinSession, useSessionById } from "../hooks/useSessions";
import { PROBLEMS } from "../data/problems.js"
import { executeCode } from "../lib/piston";
import Navbar from "../components/Navbar";
import { Group, Panel, Separator } from "react-resizable-panels";
import { getDifficultyClass } from "../lib/utils.js";
import { Loader2Icon, LogOutIcon, PhoneOffIcon } from "lucide-react";
import CodeEditor from "../components/CodeEditor.jsx";
import Output from "../components/Output.jsx";
import { useStreamClient } from "../hooks/useStreamClient.js";
import { StreamCall, StreamVideo } from "@stream-io/video-react-sdk";
import VideoCallWindow from "../components/VideoCallWindow.jsx";

const SessionsPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { user } = useUser();
    const [isRunning, setIsRunning] = useState(false);
    const [output, setOutput] = useState(null);

    const { data: sessionData, isLoading: sessionLoading, refetch } = useSessionById(id);
    const joinSessionMutation = useJoinSession();
    const endSessionMutation = useEndSession();

    const session = sessionData?.session;
    const isHost = session?.host?.clerkId === user?.id;
    const isParticipant = session?.participant?.clerkId === user?.id;

    const { streamClient, chatClient, call, isInitializingCall, channel } = useStreamClient(session, sessionLoading, isHost, isParticipant);

    const problemData = session?.problem ?
        (Object.values(PROBLEMS).find((p) => p.title === session.problem)) : null;

    const [selectedLanguage, setSelectedLanguage] = useState("java");
    const [code, setCode] = useState(problemData?.starterCode?.[selectedLanguage] || "");

    // Auto join a session when user isn't already a host or participant
    useEffect(() => {
        if (!session || !user || sessionLoading) return;
        if (isHost || isParticipant) return;

        joinSessionMutation.mutate(id, { onSuccess: refetch });
    }, [id, session, sessionLoading, user, isHost, isParticipant]);

    // Update code 
    useEffect(() => {
        if (problemData?.starterCode?.[selectedLanguage]) {
            setCode(problemData.starterCode[selectedLanguage]);
        }
    }, [problemData, selectedLanguage]);

    const handleLanguageChange = (e) => {
        const newLanguage = e.target.value;
        setSelectedLanguage(newLanguage);
        const starterCode = problemData?.starterCode?.[newLanguage] || ""
        setCode(starterCode);
        setOutput(null);
    }

    const handleRunCode = async () => {
        setIsRunning(true);
        setOutput(null);

        const result = await executeCode(selectedLanguage, code);
        setOutput(result);
        setIsRunning(false);
    }

    //TODO: Bring up a custom modal rather than an inbuilt confirm
    const handleEndSession = async () => {
        if (confirm("Are you sure you want to end the session?")) {
            //Navigates HOST back to Dashboard
            endSessionMutation.mutate(id, {
                onSuccess: () => navigate("/dashboard")
            })
        }
    }

    //Navigates PARTICIPANT to Dashboard
    useEffect(() => {
        if (!session || sessionLoading) return;

        if (session.status === "completed") navigate("/dashboard");
    }, [session, sessionLoading, navigate]);

    return (
        <div className="h-screen bg-base-300 flex flex-col">
            <Navbar />
            <div className="flex-1">
                <Group orientation="horizontal">
                    {/* Left Panel => Problem Desc & Code Editor */}
                    <Panel defaultSize={50} minSize={30}>
                        <Group orientation="vertical">
                            <Panel defaultSize={50} minSize={20}>
                                <div className="h-full overflow-y-auto bg-base-300">
                                    {/* Header */}
                                    <div className="p-6 bg-base-100 border-b border-base-100">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h1 className="text-3xl font-bold text-base-content">
                                                    {session?.problem || "Loading..."}
                                                </h1>
                                                {problemData?.category && (
                                                    <p className="text-base-content/60 mt-1">{problemData.category}</p>
                                                )}
                                                <p className="text-base-content/60 mt-2">
                                                    Host: {session?.host?.name || "Loading..."} •{" "}
                                                    {session?.participant ? 2 : 1}/2 participants
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className={`badge badge-lg ${getDifficultyClass(session?.difficulty)} font-semibold text-black`}>{session?.difficulty.slice(0, 1).toUpperCase() +
                                                    session?.difficulty.slice(1) || "Easy"}</span>
                                                {isHost && session?.status === "active" && (
                                                    <button
                                                        onClick={handleEndSession}
                                                        disabled={endSessionMutation.isPending}
                                                        className="btn btn-error btn-sm gap-2"
                                                    >
                                                        {endSessionMutation.isPending ? (
                                                            <Loader2Icon className="size-4 animate-spin" />
                                                        ) : (
                                                            <LogOutIcon className="size-4" />
                                                        )}
                                                        End Session
                                                    </button>
                                                )}
                                                {session?.status === "completed" && (
                                                    <span className="badge badge-ghost badge-lg">Completed</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 space-y-6">
                                        {/* Problem Desc */}
                                        {problemData?.description && (
                                            <div className=" p-5 bg-base-100 rounded-xl shadow-sm border border-base-300">
                                                <h2 className="mb-4 font-bold text-xl text-base-content">Description</h2>
                                                <div className="space-y-3 text-base leading-relaxed">
                                                    <p className="text-base-content/90">{problemData.description.text}</p>
                                                    {problemData.description.notes?.map((note, idx) => (
                                                        <p key={idx} className="text-base-content/90">
                                                            {note}
                                                        </p>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {/* Examples */}
                                        {problemData?.examples && problemData.examples.length > 0 && (
                                            <div className=" p-5 bg-base-100 rounded-xl shadow-sm border border-base-300">
                                                <h2 className="mb-4 text-xl font-bold text-base-content">Examples</h2>

                                                <div className="space-y-4">
                                                    {problemData.examples.map((example, idx) => (
                                                        <div key={idx}>
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <span className="badge badge-sm bg-accent/80 font-bold text-black">{idx + 1}</span>
                                                                <p className="font-semibold text-base-content">Example {idx + 1}</p>
                                                            </div>
                                                            <div className="p-4 bg-base-200 rounded-lg font-mono font-bold  text-sm space-y-1.5">
                                                                <div className="flex gap-2">
                                                                    <span className="text-primary min-w-[70px]">
                                                                        Input:
                                                                    </span>
                                                                    <span>{example.input}</span>
                                                                </div>
                                                                <div className="flex gap-2">
                                                                    <span className="text-secondary min-w-[70px]">
                                                                        Output:
                                                                    </span>
                                                                    <span>{example.output}</span>
                                                                </div>
                                                                {example.explanation && (
                                                                    <div className="pt-2 border-t border-base-300 mt-2">
                                                                        <span className="text-base-content/60 font-sans text-xs">
                                                                            <span className="font-semibold">Explanation:</span>{" "}
                                                                            {example.explanation}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {/* Constraints */}
                                        {problemData?.constraints && problemData.constraints.length > 0 && (
                                            <div className="bg-base-100 rounded-xl shadow-sm p-5 border border-base-100">
                                                <h2 className="text-xl font-bold mb-4 text-base-content">Constraints</h2>
                                                <ul className="space-y-2 text-base-content/90">
                                                    {problemData.constraints.map((constraint, idx) => (
                                                        <li key={idx} className="flex gap-2">
                                                            <span className="text-primary">•</span>
                                                            <code className="text-sm">{constraint}</code>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Panel>
                            <Separator className="h-1.5 bg-primary/50 hover:bg-primary active:bg-primary
                             focus:outline-none focus-visible:outline-none transition-colors cursor-row-resize" />
                            <Panel defaultSize={60} minSize={30}>
                                <Group orientation="vertical">
                                    <Panel defaultSize={70} minSize={30}>
                                        <CodeEditor
                                            selectedLanguage={selectedLanguage}
                                            onLanguageChange={handleLanguageChange}
                                            code={code}
                                            isRunning={isRunning}
                                            onCodeChange={(value) => setCode(value)}
                                            onRunCode={handleRunCode}
                                        />
                                    </Panel>
                                    <Separator className="h-1.5 bg-primary/50 hover:bg-primary active:bg-primary
                             focus:outline-none focus-visible:outline-none transition-colors cursor-row-resize" />
                                    <Panel defaultSize={40} minSize={20}>
                                        <Output
                                            output={output} />
                                    </Panel>
                                </Group>
                            </Panel>
                        </Group>
                    </Panel>
                    <Separator className="w-1.5 bg-primary/50 hover:bg-primary
                     focus:outline-none focus-visible:outline-none transition-colors cursor-col-resize" />

                    {/* Right Panel => Video call & Chat window*/}
                    <Panel defaultSize={50} minSize={30}>
                        <div className="h-full bg-base-200 p-4 overflow-auto">
                            {isInitializingCall ?
                                (<div className="h-full flex items-center justify-center">
                                    <div className="text-center">
                                        <Loader2Icon className="size-12 mx-auto animate-spin text-primary mb-4" />
                                        <p className="text-lg">Connecting to video call...</p>
                                    </div>
                                </div>) :
                                !streamClient || !call ? (
                                    <div className="h-full flex items-center justify-center">
                                        <div className="card bg-base-100 shadow-xl max-w-md">
                                            <div className="card-body items-center text-center">
                                                <div className="size-24 bg-error/10 rounded-full flex items-center justify-center mb-4">
                                                    <PhoneOffIcon className="size-12 text-error" />
                                                </div>
                                                <h2 className="card-title text-2xl">Connection Failed</h2>
                                                <p className="text-base-content/70">Unable to connect to the video call</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-full">
                                        <StreamVideo client={streamClient}>
                                            <StreamCall call={call}>
                                                <VideoCallWindow chatClient={chatClient} channel={channel} />
                                            </StreamCall>
                                        </StreamVideo>
                                    </div>
                                )}
                        </div>

                    </Panel>
                </Group>

            </div>
        </div>
    )
}

export default SessionsPage
