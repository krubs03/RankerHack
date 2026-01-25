//Piston => Code execution API
const PISTON_URL = "https://emkc.org/api/v2/piston";

const LANGUAGES = {
  javacscript: {
    language: "javascript",
    version: "18.15.0",
  },
  java: {
    language: "java",
    version: "15.0.2",
  },
  python: {
    language: "python",
    version: "3.10.0",
  },
};

function getExtension(language) {
  const extensions = {
    java: "java",
    javacscript: "js",
    python: "py",
  };
  return extensions[language] || "txt";
}

export async function executeCode(language, code) {
  try {
    const languageConfig = LANGUAGES[language];
    if (!languageConfig) {
      return {
        success: false,
        error: `Unsupported language: ${language}`,
      };
    }

    const response = await fetch(`${PISTON_URL}/execute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language: languageConfig.language,
        version: languageConfig.version,
        files: [
          {
            name: `main.${getExtension(languageConfig.language)}`,
            content: code,
          },
        ],
      }),
    });

    if (!response) {
      return {
        success: false,
        error: `Error: ${response.status}`,
      };
    }

    const data = await response.json();
    const output = data.run.output || "";
    const stderr = data.run.stderr || "";

    if (stderr) {
      return {
        success: false,
        output: output,
        error: stderr,
      };
    }

    return {
      success: true,
      output: output || "No output",
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to execute code: ${error.message}`,
    };
  }
}
