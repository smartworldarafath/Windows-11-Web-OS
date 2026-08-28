import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Icon, ToolBar } from "../../../utils/general";
import "./assets/paint.scss";

export const PaintApp = () => {
  const wnapp = useSelector((state) => state.apps.paint || { size: "full", hide: true, z: 0 });
  const canvasRef = useRef(null);
  const [tool, setTool] = useState("pencil"); // pencil | brush | eraser | line | rect | filledRect | circle | filledCircle
  const [color, setColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(3);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [history, setHistory] = useState([]);
  const [snapshot, setSnapshot] = useState(null);

  const colors = [
    "#000000", "#7f7f7f", "#880015", "#ed1c24", "#ff7f27", "#fff200", "#22b14c", "#00a2e8",
    "#3f48cc", "#a349a4", "#ffffff", "#c3c3c3", "#b97a57", "#ffaec9", "#ffc90e", "#efe4b0",
    "#b5e61d", "#99d9ea", "#7092be", "#c8bfe7"
  ];

  useEffect(() => {
    if (!wnapp || wnapp.hide) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initialize canvas size
    const ctx = canvas.getContext("2d");
    if (!canvas.width || canvas.width === 300) {
      canvas.width = canvas.parentElement.clientWidth || 900;
      canvas.height = canvas.parentElement.clientHeight || 550;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      saveState();
    }
  }, [wnapp?.hide]);

  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory((prev) => [...prev.slice(-20), data]);
  };

  const handleUndo = () => {
    if (history.length <= 1) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const newHist = [...history];
    newHist.pop(); // Remove current
    const prevData = newHist[newHist.length - 1];
    ctx.putImageData(prevData, 0, 0);
    setHistory(newHist);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveState();
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "Drawing.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const getCanvasCoords = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDraw = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const pos = getCanvasCoords(e);
    setIsDrawing(true);
    setStartPos(pos);

    ctx.strokeStyle = tool === "eraser" ? "#ffffff" : color;
    ctx.fillStyle = color;
    ctx.lineWidth = tool === "eraser" ? lineWidth * 3 : lineWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (["pencil", "brush", "eraser"].includes(tool)) {
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    } else {
      setSnapshot(ctx.getImageData(0, 0, canvas.width, canvas.height));
    }
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const pos = getCanvasCoords(e);

    if (["pencil", "brush", "eraser"].includes(tool)) {
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    } else if (snapshot) {
      ctx.putImageData(snapshot, 0, 0);
      ctx.beginPath();
      if (tool === "line") {
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
      } else if (tool === "rect") {
        ctx.strokeRect(startPos.x, startPos.y, pos.x - startPos.x, pos.y - startPos.y);
      } else if (tool === "filledRect") {
        ctx.fillRect(startPos.x, startPos.y, pos.x - startPos.x, pos.y - startPos.y);
      } else if (tool === "circle" || tool === "filledCircle") {
        const radius = Math.hypot(pos.x - startPos.x, pos.y - startPos.y);
        ctx.arc(startPos.x, startPos.y, radius, 0, Math.PI * 2);
        if (tool === "filledCircle") ctx.fill();
        else ctx.stroke();
      }
    }
  };

  const stopDraw = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    setSnapshot(null);
    saveState();
  };

  if (!wnapp || wnapp.hide) return null;

  return (
    <div
      className="paintApp floatTab dpShad"
      data-size={wnapp.size}
      data-max={wnapp.max}
      style={{
        ...(wnapp.size === "cstm" ? wnapp.dim : null),
        zIndex: wnapp.z,
      }}
      data-hide={wnapp.hide}
      id="paintApp"
    >
      <ToolBar
        app={wnapp.action || "PAINT"}
        icon="paint"
        size={wnapp.size}
        name="Paint"
      />
      <div className="windowScreen flex flex-col">
        {/* Paint Ribbon Bar */}
        <div className="paintRibbon flex items-center flex-wrap px-3 py-1.5 bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 select-none">
          {/* File Actions */}
          <div className="ribGroup flex items-center pr-3 border-r border-gray-300 dark:border-gray-600 mr-3">
            <button
              className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-xs flex flex-col items-center"
              onClick={handleUndo}
              title="Undo"
            >
              <Icon fafa="faUndo" width={13} />
              <span className="text-[10px] mt-0.5">Undo</span>
            </button>
            <button
              className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-xs flex flex-col items-center ml-1"
              onClick={handleClear}
              title="Clear Canvas"
            >
              <Icon fafa="faTrash" width={13} />
              <span className="text-[10px] mt-0.5">Clear</span>
            </button>
            <button
              className="p-1.5 rounded hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-400 text-xs flex flex-col items-center ml-1"
              onClick={handleDownload}
              title="Save Image"
            >
              <Icon fafa="faDownload" width={13} />
              <span className="text-[10px] mt-0.5">Save</span>
            </button>
          </div>

          {/* Tools */}
          <div className="ribGroup flex items-center pr-3 border-r border-gray-300 dark:border-gray-600 mr-3 gap-1">
            {[
              { id: "pencil", icon: "faPen", name: "Pencil" },
              { id: "brush", icon: "faPaintBrush", name: "Brush" },
              { id: "eraser", icon: "faEraser", name: "Eraser" },
              { id: "line", icon: "faMinus", name: "Line" },
              { id: "rect", icon: "faSquare", name: "Rectangle" },
              { id: "circle", icon: "faCircle", name: "Circle" },
            ].map((t) => (
              <button
                key={t.id}
                className={`p-1.5 rounded text-xs flex flex-col items-center ${tool === t.id ? "bg-blue-200 dark:bg-blue-900 border border-blue-400" : "hover:bg-gray-200 dark:hover:bg-gray-700"}`}
                onClick={() => setTool(t.id)}
                title={t.name}
              >
                <Icon fafa={t.icon} width={13} />
                <span className="text-[10px] mt-0.5">{t.name}</span>
              </button>
            ))}
          </div>

          {/* Stroke Size */}
          <div className="ribGroup flex items-center pr-3 border-r border-gray-300 dark:border-gray-600 mr-3">
            <span className="text-xs mr-2 text-gray-500">Size:</span>
            <select
              value={lineWidth}
              onChange={(e) => setLineWidth(Number(e.target.value))}
              className="text-xs bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-1.5 py-1"
            >
              <option value={1}>1px</option>
              <option value={3}>3px</option>
              <option value={6}>6px</option>
              <option value={12}>12px</option>
              <option value={20}>20px</option>
            </select>
          </div>

          {/* Color Palette */}
          <div className="ribGroup flex items-center">
            <div
              className="w-7 h-7 rounded border-2 border-gray-400 mr-2 shadow-inner"
              style={{ backgroundColor: color }}
              title="Current Color"
            />
            <div className="grid grid-cols-10 gap-1">
              {colors.map((c, i) => (
                <div
                  key={i}
                  className="w-4 h-4 rounded-sm border border-gray-400 handcr"
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-6 h-6 ml-2 cursor-pointer border-none bg-transparent"
              title="Custom Color"
            />
          </div>
        </div>

        {/* Canvas Area */}
        <div className="canvasWrap flex-grow overflow-auto p-4 bg-gray-200 dark:bg-gray-900 flex items-center justify-center">
          <canvas
            ref={canvasRef}
            className="bg-white shadow-lg cursor-crosshair rounded"
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={stopDraw}
            onMouseLeave={stopDraw}
          />
        </div>
      </div>
    </div>
  );
};
