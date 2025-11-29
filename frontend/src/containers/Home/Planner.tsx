import { useEffect, useRef } from "react";

export default function Planner() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Создаем iframe для загрузки architect3d
    const iframe = document.createElement("iframe");
    iframe.src = "/planner/index.html";
    iframe.style.width = "100%";
    iframe.style.height = "100vh";
    iframe.style.border = "none";
    iframe.style.position = "absolute";
    iframe.style.top = "0";
    iframe.style.left = "0";
    iframe.style.zIndex = "1";
    
    containerRef.current.appendChild(iframe);

    return () => {
      if (containerRef.current && iframe.parentNode) {
        iframe.parentNode.removeChild(iframe);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-screen bg-[#0B0F19] overflow-hidden"
      style={{ 
        position: "fixed", 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0,
        zIndex: 1
      }}
    />
  );
}
