import { useEffect } from "react";

function ConfirmDialog({ open, message, onConfirm, onCancel, loading }) {
    useEffect(() => {
        const handler = (e) => e.key === "Escape" && onCancel();
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, []);
    return (
        <dialog className={`modal ${open ? "modal-open" : ""}`}>
            <div className="modal-box">
                <h3 className="font-bold text-lg">Confirm</h3>
                <p className="py-4">{message}</p>

                <div className="modal-action">
                    <button
                        className="btn btn-ghost"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        Cancel
                    </button>

                    <button
                        className="btn btn-error"
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="loading loading-spinner loading-sm"></span>
                        ) : (
                            "Yes, End Session"
                        )}
                    </button>
                </div>
            </div>

            <div className="modal-backdrop backdrop-blur-sm bg-black/20" onClick={onCancel} />
        </dialog>
    );
}

export default ConfirmDialog;
