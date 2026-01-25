const Output = ({ output }) => {
  return (
    <div className="h-full bg-base-100 flex flex-col">
      <div className="px-4 py-2 border border-base-300 bg-base-200 font-semibold text-sm">
        Output
      </div>
      <div className="flex-1 overflow-auto p-4 font-mono text-sm whitespace-pre-wrap">
        {output === null ?
          (<p className="text-base-content/60">
            Click "Run Code" to execute your code...
          </p>
          ) : output.success ? (
            <pre className="text-success whitespace-pre-wrap">
              {output.output}
            </pre>
          ) : (
            <pre className="text-error">
              {output.error}
            </pre>
          )}
      </div>
    </div>
  )
}

export default Output
