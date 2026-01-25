import { useNavigate } from "react-router"
import Navbar from "../components/Navbar"
import { useUser } from "@clerk/clerk-react";
import { useState } from "react";
import { useActiveSessions, useCreateSession, useRecentSessions } from "../hooks/useSessions.js";
import WelcomeSection from "../components/WelcomeSection.jsx";
import StatsCards from "../components/StatsCards.jsx";
import ActiveSessions from "../components/ActiveSessions.jsx";
import RecentSessions from "../components/RecentSessions.jsx";
import CreateSessionModal from "../components/CreateSessionModal.jsx";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [sessionConfig, setSessionConfig] = useState({ problem: "", difficulty: "" });

  const createSessionMutation = useCreateSession();

  const handleSessionCreation = () => {
    if (!sessionConfig.problem || !sessionConfig.difficulty) return;
    createSessionMutation.mutate({
      problem: sessionConfig.problem,
      difficulty: sessionConfig.difficulty.toLowerCase()
    },
      {
        onSuccess: (data) => {
          setShowCreateModal(false);
          navigate(`/session/${data.session._id}`)
        }
      }
    )
  }

  const { data: activeSessionsData, isLoading: loadingActiveSessions } = useActiveSessions();
  const { data: recentSessionsData, isLoading: loadingRecentSessions } = useRecentSessions();

  const activeSessions = activeSessionsData?.sessions || [];
  const recentSessions = recentSessionsData?.sessions || [];

  const isUserInSession = (session) => {
    if (!user.id) return false;

    return session.host?.clerkId === user.id || session.participant?.clerkId === user.id
  }

  return (
    <>
      <div className="min-h-screen bg-base-300">
        <Navbar />
        <WelcomeSection onCreateSession={() => setShowCreateModal(true)} />
        <div className="container mx-auto px-5 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <StatsCards
              activeSessionsCount={activeSessions.length}
              recentSessionsCount={recentSessions.length}
            />
            <ActiveSessions
              sessions={activeSessions}
              isLoading={loadingActiveSessions}
              isUserInSession={isUserInSession}
            />
          </div>
          <RecentSessions
            sessions={recentSessions}
            isLoading={loadingRecentSessions} />
        </div>
      </div>
      <CreateSessionModal
        isOpen={showCreateModal}
        onClose={() => { setShowCreateModal(false) }}
        sessionConfig={sessionConfig}
        setSessionConfig={setSessionConfig}
        onCreateSession={handleSessionCreation}
        isCreating={createSessionMutation.isPending}
      />
    </>
  )
}

export default DashboardPage