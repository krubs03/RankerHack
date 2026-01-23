import { Link } from "react-router";
import Navbar from "../components/Navbar"
import { PROBLEMS } from "../data/problems.js";
import { ChevronRightIcon, Code2Icon } from "lucide-react";
import { getDifficultyClass } from "../lib/utils.js";

const ProblemsPage = () => {
  const problems = Object.values(PROBLEMS);

  const getProblemsCount = (difficulty => {
    return problems.filter(p => p.difficulty === difficulty).length
  })
  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Practice Problems</h1>
          <p className="text-lg text-base-content/70">Solve coding challenges to improve your skills.</p>
        </div>
        {/* Problems List */}
        <div className="space-y-4">
          {problems.map((problem) => (
            <Link key={problem.id}
              to={`/problems/${problem.id}`}
              className="card bg-base-200 hover:scale-[1.01] transition-transform duration-200">
              <div className="card-body">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="size-10 flex items-center justify-center rounded-lg bg-primary/20">
                        <Code2Icon className="size-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h2 className="text-xl font-bold">{problem.title}</h2>
                          <span className={`badge ${getDifficultyClass(problem.difficulty)} font-semibold text-black`}>{problem.difficulty}</span>
                        </div>
                        <p className="text-sm text-base-content/70">{problem.category}</p>
                      </div>
                    </div>
                    <p className="text-base-content/80 mb-3">
                      {problem.description.text}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-primary">
                    <span className="font-medium">Solve</span>
                    <ChevronRightIcon className="size-5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        {/* Stats */}
        <div className="mt-10 card bg-base-200 shadow-lg">
          <div className="card-body">
            <div className="stats">
              <div className="stat">
                <div className="stat-title">
                  Total Problems
                </div>
                <div className="stat-value text-primary">
                  {problems.length}
                </div>
              </div>
              <div className="stat">
                <div className="stat-title">
                  Easy
                </div>
                <div className="stat-value text-success">
                  {getProblemsCount("Easy")}
                </div>
              </div>
              <div className="stat">
                <div className="stat-title">
                  Medium
                </div>
                <div className="stat-value text-yellow-400">
                  {getProblemsCount("Medium")}
                </div>
              </div>
              <div className="stat">
                <div className="stat-title">
                  Hard
                </div>
                <div className="stat-value text-error">
                  {getProblemsCount("Hard")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProblemsPage
