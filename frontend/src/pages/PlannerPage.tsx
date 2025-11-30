import { PlannerApp } from "../features/planner";
import "../features/planner/src/styles.css";
import "../features/planner/src/styles/app.css";

/**
 * Страница планировщика
 * 
 * Использует PlannerApp из features/planner
 * Полноэкранный режим без Header и Footer
 */
export default function PlannerPage() {
  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-gray-50" style={{ zIndex: 1000 }}>
      <PlannerApp />
    </div>
  );
}

