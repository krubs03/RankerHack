import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router"
import { PROBLEMS } from "../data/problems";
import Navbar from "../components/Navbar";
import { Group, Panel, Separator } from "react-resizable-panels";

import ProblemDescription from "../components/ProblemDescription";
import CodeEditor from "../components/CodeEditor";
import Output from "../components/Output";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";
import { executeCode } from "../lib/piston.js"

const ProblemDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [currentProblemId, setCurrentProblemId] = useState("two-sum");
    const [selectedLanguage, setSelectedLanguage] = useState("java");
    const [code, setCode] = useState(PROBLEMS[currentProblemId].starterCode.java);
    const [output, setOutput] = useState(null);
    const [isRunning, setIsRunning] = useState(false);

    const currentProblem = PROBLEMS[currentProblemId];

    useEffect(() => {
        if (id && PROBLEMS[id]) {
            setCurrentProblemId(id);
            setCode(PROBLEMS[id].starterCode[selectedLanguage]);
        }
    }, [id, selectedLanguage])

    const handleLanguageChange = (e) => {
        const newLanguage = e.target.value;
        setSelectedLanguage(newLanguage);
        setCode(currentProblem.starterCode[newLanguage]);
        setOutput(null)
    }

    const handleProblemChange = (newProblemId) => { navigate(`/problem/${newProblemId}`) };

    const handleRunCode = async () => {
        setIsRunning(true);

        const result = await executeCode(selectedLanguage, code);
        setOutput(result);
        setIsRunning(false);

        //Check if correct output
        if (result.success) {
            const expectedOutput = currentProblem.expectedOutput[selectedLanguage];

            if (normalizeOutput(result.output) == normalizeOutput(expectedOutput)) {
                toast.success("All tests passed. Great job!");
                triggerConfetti();
            } else {
                toast.error("Tests failed. Please check your code.");
            }
        } else {
            toast.error("Code execution failed!")
        }
    }

    const normalizeOutput = (output) => {
        // normalize output for comparison (Trim whitespace, handles different spacing)
        return output
            .trim()
            .split("\n")
            .map((line) =>
                line
                    .trim()
                    // remove spaces after [ and before ]
                    .replace(/\[\s+/g, "[")
                    .replace(/\s+\]/g, "]")
                    // normalize spaces around commas to single space after comma
                    .replace(/\s*,\s*/g, ",")
            )
            .filter((line) => line.length > 0)
            .join("\n");
    };

    const triggerConfetti = () => {
        confetti({
            particleCount: 70,
            spread: 200,
            origin: { x: 0.2, y: 0.8 },
        });

        confetti({
            particleCount: 70,
            spread: 200,
            origin: { x: 0.8, y: 0.8 },
        });
    };

    return (
        <div className="h-screen bg-base-200 flex flex-col">
            <Navbar />
            <div className="flex-1">
                <Group orientation="horizontal">
                    {/* Problem Desc */}
                    <Panel defaultSize={40} minSize={30}>
                        <ProblemDescription
                            problem={currentProblem}
                            currentProblemId={currentProblemId}
                            onProblemChange={handleProblemChange}
                            allProblems={Object.values(PROBLEMS)}
                        />
                    </Panel>

                    <Separator className="w-1.5 bg-primary/50 hover:bg-primary
                     focus:outline-none focus-visible:outline-none transition-colors cursor-col-resize" />

                    {/* Code Editor w/ output */}
                    <Panel defaultSize={60} minSize={30}>
                        <Group orientation="vertical">
                            {/* Code Editor */}
                            <Panel defaultSize={60} minSize={30} className="border border-primary">
                                <CodeEditor
                                    selectedLanguage={selectedLanguage}
                                    onLanguageChange={handleLanguageChange}
                                    code={code}
                                    isRunning={isRunning}
                                    onCodeChange={setCode}
                                    onRunCode={handleRunCode}
                                />
                            </Panel>
                            <Separator className="h-1.5 bg-primary/50 hover:bg-primary active:bg-primary
                             focus:outline-none focus-visible:outline-none transition-colors cursor-row-resize" />

                            {/* Output Panel */}
                            <Panel defaultSize={40} minSize={20}>
                                <Output output={output}/>
                            </Panel>
                        </Group>
                    </Panel>
                </Group>
            </div>
        </div>
    )
}

export default ProblemDetailPage
