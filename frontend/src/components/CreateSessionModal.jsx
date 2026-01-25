import { Code2Icon, LoaderIcon, PlusIcon } from "lucide-react";
import { PROBLEMS } from "../data/problems.js"

const CreateSessionModal = ({
    isOpen,
    onClose,
    sessionConfig,
    setSessionConfig,
    onCreateSession,
    isCreating

}) => {

    const problems = Object.values(PROBLEMS);
    if (!isOpen) return null;
    return (
        <div className="modal modal-open">
            <div className="modal-box max-w-2xl">
                <h3 className="text-2xl font-bold mb-6">
                    Create New Session
                </h3>
                <div className="space-y-8">
                    <div className="space-y-2">
                        <label className="label">
                            <span className="label-text font-semibold">Select Problem</span>
                            <span className="label-text-alt text-error">*</span>
                        </label>
                        <select className="select w-full"
                            value={sessionConfig.problem}
                            onChange={(e) => {
                                const selectedProblem = problems.find((p) => p.title === e.target.value);
                                setSessionConfig({
                                    difficulty: selectedProblem.difficulty,
                                    problem: e.target.value
                                });
                            }}>
                            <option value="" disabled>
                                Choose your desired problem...
                            </option>
                            {problems.map((p) => (
                                <option key={p.id} value={p.title}>
                                    {p.title} ({p.difficulty})
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* Room Summary */}
                    {sessionConfig.problem && (
                        <div className="alert alert-success">
                            <Code2Icon className="size-5" />
                            <div>
                                <p className="font-semibold">Room Summary:</p>
                                <p>
                                    Problem: <span className="font-medium">{sessionConfig.problem}</span>
                                </p>
                                <p>
                                    Max Participants: <span className="font-medium">2 (1-on-1 session)</span>
                                </p>
                            </div>
                        </div>
                    )}
                </div>
                <div className="modal-action">
                    <button className="btn btn-ghost btn-outline" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        className="btn btn-primary gap-2"
                        onClick={onCreateSession}
                        disabled={isCreating || !sessionConfig.problem}
                    >
                        {isCreating ? (
                            <LoaderIcon className="size-5 animate-spin" />
                        ) : (
                            <PlusIcon className="size-5" />
                        )}

                        {isCreating ? "Creating..." : "Create"}
                    </button>
                </div>
            </div>
            <div className="modal-backdrop" onClick={onClose} />
        </div>
    )
}

export default CreateSessionModal
