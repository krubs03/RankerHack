import "@stream-io/video-react-sdk/dist/css/styles.css";
import "stream-chat-react/dist/css/v2/index.css";
import { CallControls, CallingState, SpeakerLayout, useCall, useCallStateHooks } from "@stream-io/video-react-sdk";
import { Loader2Icon, MessageSquareIcon, UsersIcon, XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Channel, Chat, MessageInput, MessageList, Thread, TypingIndicator, Window } from "stream-chat-react";
import React from "react";

const VideoCallWindow = ({ chatClient, channel }) => {
    const navigate = useNavigate();
    const call = useCall();
    const { useCallCallingState, useParticipantCount, useParticipants } = useCallStateHooks();
    const callingState = useCallCallingState();
    const participantCount = useParticipantCount();
    const participants = useParticipants();

    const [isChatOpen, setIsChatOpen] = useState(false);
    const [unread, setUnread] = useState(0);

    useEffect(() => {
        if (!channel) return;

        const handleNewMessage = (event) => {
            // ignore your own messages
            if (event.user?.id === chatClient?.userID) return;

            if (!isChatOpen) {
                setUnread((prev) => prev + 1);
            }
        };

        channel.on("message.new", handleNewMessage);

        return () => {
            channel.off("message.new", handleNewMessage);
        };
    }, [channel, isChatOpen, chatClient]);


    useEffect(() => {
        if (!channel) return;

        const initUnread = async () => {
            try {
                const count = await channel.countUnread();
                setUnread(count);
            } catch (err) {
                console.error("Unread fetch failed", err);
            }
        };

        initUnread();
    }, [channel]);

    useEffect(() => {
        if (isChatOpen) {
            setTimeout(() => {
                document.querySelector(".str-chat__textarea")?.focus();
            }, 100);
        }
    }, [isChatOpen]);


    function callingStateAnimate(message) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-center">
                    <Loader2Icon className="size-12 mx-auto animate-spin text-primary mb-4" />
                    <p className="text-lg">{message}</p>
                </div>
            </div>
        );
    }

    if (
        callingState === CallingState.JOINING ||
        callingState === CallingState.RECONNECTING
    ) {
        const message =
            callingState === CallingState.JOINING
                ? "Joining call..."
                : "Reconnecting to call...";

        return callingStateAnimate(message);
    }


    return (
        <div className="h-full flex gap-3 relative str-video">
            <div className="flex flex-1 flex-col gap-3">
                {/* Participants and Chat Toggle */}
                <div className="flex items-center justify-between bg-base-100 gap-3 p-3 rounded-lg shadow">

                    <div className="flex items-center gap-2">
                        {participants.map((p) => (
                            <div key={p.sessionId} className="avatar">
                                <div className="w-8 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                    <img src={p.image} alt={p.name} />
                                </div>
                            </div>
                        ))}
                        <span className="font-semibold">
                            {participantCount} {participantCount === 1 ? "participant" : "participants"}
                        </span>
                    </div>
                    {chatClient && channel && (
                        <button
                            onClick={() => {
                                setIsChatOpen((prev) => {
                                    if (!prev) setUnread(0); // opening chat
                                    return !prev;
                                });
                            }}

                            className={`btn btn-sm gap-2 ${isChatOpen ? "btn-primary" : "btn-ghost"}`}
                            title={isChatOpen ? "Hide chat" : "Show chat"}
                        >
                            <MessageSquareIcon className="size-4" />
                            Chat
                            {unread > 0 && (
                                <span className="badge badge-error badge-xs">{unread}</span>
                            )}
                            {console.log("Unread messages:", unread)}
                        </button>

                    )}
                </div>

                <div className="flex-1 bg-base-300 rounded-lg overflow-hidden relative p-1 shadow-inner">
                    <SpeakerLayout />
                </div>

                <div className="bg-base-100 p-3 rounded-lg shadow flex justify-center">
                    <CallControls onLeave={() => navigate("/dashboard")} />
                </div>
            </div>
            {/* Chat Window */}
            {chatClient && channel && (
                <div
                    className={`flex flex-col rounded-lg shadow overflow-hidden bg-[#272a30] transition-all duration-300 ease-in-out
                        ${isChatOpen ? "w-full md:w-80 opacity-100 translate-x-0" : "w-0 opacity-0 translate-x-full"
                        }`}

                >{isChatOpen && (
                    <>
                        <div className="bg-[#1c1e22] p-3 border-b border-[#3a3d44] flex items-center justify-between">
                            <h3 className="font-semibold text-white">Session Chat</h3>
                            <button
                                onClick={() => setIsChatOpen(false)}
                                className="text-gray-400 hover:text-white transition-colors"
                                title="Close chat"
                            >
                                <XIcon className="size-5" />
                            </button>
                        </div>
                        {/* TODO: Make chat interactions better */}
                        <div className="flex-1 overflow-hidden stream-chat-dark">
                            <Chat client={chatClient} theme="str-chat__theme-dark">
                                <Channel channel={channel}>
                                    <Window>
                                        <MessageList messageLimit={50} />
                                        <TypingIndicator />
                                        <MessageInput />
                                    </Window>
                                    <Thread />
                                </Channel>
                            </Chat>
                        </div>
                    </>
                )}</div>
            )}
        </div>
    )
}

export default React.memo(VideoCallWindow);
