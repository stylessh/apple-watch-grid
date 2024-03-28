import { useEffect } from "react";
import InfiniteViewer from "react-infinite-viewer";

function App() {
  const items = Array.from({ length: 120 }, (_, i) => i + 1);

  const gridW = (items.length / 10) * 250;
  const gridH = (items.length / 10) * 250;

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  useEffect(() => {
    let id: number;
    const items = document.querySelectorAll<HTMLDivElement>(".bubble");

    function scale() {
      for (const item of items) {
        const rect = item.getBoundingClientRect();

        const scaleY =
          1 -
          Math.abs(
            (rect.top + rect.height / 2 - viewportHeight / 2) / viewportHeight
          );

        const normalizedScaleY = Math.min(1, Math.max(0, scaleY));

        const scaleX =
          1 -
          Math.abs(
            (rect.left + rect.width / 2 - viewportWidth / 2) / viewportWidth
          );

        const normalizedScaleX = Math.min(1, Math.max(0, scaleX));

        const scale = (normalizedScaleY + normalizedScaleX) / 2;

        item.style.transform = `scale(${scale})`;
        item.style.opacity = `${Math.max(scale - 0.2, 0)}`;
      }

      id = requestAnimationFrame(() => {
        scale();
      });
    }

    scale();

    return () => {
      cancelAnimationFrame(id);
    };
  }, [viewportHeight, viewportWidth]);

  const applyMargin = (i: number) => {
    const columns = items.length / 10;

    const row = Math.ceil(i / columns);
    const col = i % columns;

    return row % 2 === 0 && col < 12 ? "-18vw" : "0";
  };

  return (
    <main className="w-full h-full bg-black">
      <InfiniteViewer
        className="w-screen h-screen overflow-hidden"
        useTransform
        useMouseDrag
        useGesture
        displayHorizontalScroll={false}
        displayVerticalScroll={false}
      >
        <div
          className="relative grid place-items-center"
          style={{
            width: `${gridW}px`,
            height: `${gridH}px`,
            top: "-50%",
            left: "-50%",
            gridTemplateColumns: `repeat(${items.length / 10}, 18vw)`,
            gridTemplateRows: `repeat(${items.length / 10}, 18vw)`,
          }}
        >
          {items.map((item) => (
            <div
              key={item}
              className="flex items-center justify-center text-center text-black bg-white rounded-full bubble"
              style={{
                width: "18vw",
                height: "18vw",
                marginLeft: applyMargin(item),
              }}
            />
          ))}
        </div>
      </InfiniteViewer>
    </main>
  );
}

export default App;
