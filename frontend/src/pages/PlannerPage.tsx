import { PlannerApp } from "../features/planner";

/**
 * Страница планировщика
 *
 * Использует PlannerApp из features/planner
 * Полноэкранный режим без Header и Footer
 */
export default function PlannerPage() {
  return (
    <div
      className="fixed inset-0 w-screen h-screen overflow-hidden bg-gray-50"
      style={{ zIndex: 1000 }}
    >
      <PlannerApp />
    </div>
  );
}
