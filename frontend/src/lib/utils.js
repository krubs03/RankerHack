export const getDifficultyClass = (difficulty) => {
  switch (difficulty.toLowerCase()) {
    case "easy":
      return "badge-success";
    case "medium":
      return "bg-yellow-400";
    case "hard":
      return "badge-error";
    default:
      return "badge-ghost";
  }
};
