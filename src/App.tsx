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

  const generateGradient = () => {
    // complementary colors - hex
    const colors = [
      ["#211f2f", "#918ca9"],
      ["#727a9a", "#d8dbe9"],
    ];

    const gradient = colors[Math.floor(Math.random() * colors.length)];

    return `linear-gradient(to right, ${gradient[0]}, ${gradient[1]})`;
  };

  return (
    <main className="w-full h-full bg-black">
      <InfiniteViewer
        className="w-screen h-screen overflow-hidden cursor-grab"
        useTransform
        useMouseDrag
        useGesture
        displayHorizontalScroll={false}
        displayVerticalScroll={false}
        rangeX={[(-1 * viewportWidth) / 2, gridW - viewportWidth * 1.5]}
        rangeY={[(-1 * viewportHeight) / 2, gridH - viewportHeight * 1.9]}
      >
        <div
          className="relative grid place-items-center -top-1/2 -left-1/2"
          style={{
            width: `${gridW}px`,
            height: `${gridH}px`,
            gridTemplateColumns: `repeat(${items.length / 10}, 18vw)`,
            gridTemplateRows: `repeat(${items.length / 10}, 18vw)`,
          }}
        >
          {items.map((item) => (
            <div
              key={item}
              className="flex items-center justify-center text-center text-black bg-white rounded-full bubble size-[18vw]"
              style={{
                backgroundImage: generateGradient(),
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
