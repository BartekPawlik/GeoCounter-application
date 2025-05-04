export function ChartWindown({ chartItem }) {
  console.log(chartItem.x2);
  const scale = 25;
  const origin = 300;
  const range = Array.from({ length: 18 }, (_, i) => i - 8);
  const toChartX = (x) => origin + x * scale;
  const toChartY = (y) => origin - y * scale;

  return (
    <div className="chart-container">
      <div className="main-measure">
        <p className="measure-ab" style={{ color: `red` }}>
          {" "}
          A = ({chartItem.x1}, {chartItem.y1})
        </p>
        <p className="measure-ab" style={{ color: `blue` }}>
          {" "}
          B= ({chartItem.x2}, {chartItem.y2})
        </p>
      </div>
      <div className="chart">
        <div
          className="point"
          style={{
            left: `${toChartX(chartItem.x1)}px`,
            top: `${toChartY(chartItem.y1)}px`,
            background: "red",
          }}
        ></div>

        <div
          className="point"
          style={{
            left: `${toChartX(chartItem.x2)}px`,
            top: `${toChartY(chartItem.y2)}px`,
            background: "blue",
          }}
        ></div>
        <div className="x-number">
          {range.map((num) => (
            <span
              key={`x-${num}`}
              className="axist-number"
              style={{
                left: `${origin + num * scale}px`,
                top: `${origin + 5}px`,
              }}
            >
              {num}
            </span>
          ))}
        </div>
        <div className="x-line-container">
          <img style={{ transform: "rotate(180deg)" }} src="/Icon.png" />
          <div className="x-line"></div>
          <img src="/Icon.png" />
        </div>
        <div className="y-line-container">
          <img style={{ transform: "rotate(-90deg)  translateY(-3px)" }} src="/Icon.png" />
          <div className="y-line"></div>
          <img src="/Icon.png" style={{ transform: "rotate(90deg) translateY(3px)"  }} />
        </div>
      </div>
    </div>
  );
}
