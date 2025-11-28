import { useEffect } from "react";

export default function Planner() {
  useEffect(() => {
    window.location.href = "/planner/index.html";
  }, []);
  return null;
}
