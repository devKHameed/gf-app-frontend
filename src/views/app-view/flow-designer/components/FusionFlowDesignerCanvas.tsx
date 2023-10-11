import { useTheme } from "@mui/material";
import React, { useEffect, useRef } from "react";

const getPixelRatio = (context: CanvasRenderingContext2D) => {
  return window.devicePixelRatio || 1;
};

type Props = {};

const coords = [900, 200];
let isDragging = false;

const FusionFlowDesignerCanvas: React.FC<Props> = (props) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const theme = useTheme();

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    // const canvas = createPanZoom(canvasRef.current, {
    //   maxZoom: 1,
    //   minZoom: 0.2,
    //   autocenter: true,
    // });

    // canvas.zoomAbs(halfSize, halfSize, 2);

    // return () => {
    //   canvas.dispose();
    // };
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) {
      return;
    }
    const ratio = getPixelRatio(ctx);
    const width = Number(
      getComputedStyle(canvas).getPropertyValue("width").slice(0, -2)
    );
    const height = Number(
      getComputedStyle(canvas).getPropertyValue("height").slice(0, -2)
    );

    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    render();
  }, []);

  const render = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) {
      return;
    }

    // const coords = [900, 200];
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Add Main Node Edge
    ctx.beginPath();
    ctx.moveTo(coords[0], coords[1] + 100);
    ctx.lineTo(coords[0], coords[1] + 100 + 50);
    const grad = ctx.createLinearGradient(
      coords[0],
      coords[1] + 100,
      coords[0],
      coords[1] + 100 + 50
    );
    grad.addColorStop(0, theme.palette.primary.main);
    grad.addColorStop(0.5, `${theme.palette.primary.main.slice(0, -4)}, 0.9)`);
    grad.addColorStop(0.7, `${theme.palette.primary.main.slice(0, -4)}, 0.7)`);
    grad.addColorStop(1, `${theme.palette.primary.main.slice(0, -4)}, 0.5)`);
    ctx.strokeStyle = grad;
    ctx.lineWidth = 18;
    ctx.lineCap = "round";
    ctx.stroke();

    // Add Button Circle
    const addButtonCoords = [coords[0], coords[1] + 185];
    ctx.beginPath();
    ctx.arc(addButtonCoords[0], addButtonCoords[1], 15, 0, 2 * Math.PI);
    ctx.fillStyle = theme.palette.primary.main;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(addButtonCoords[0], addButtonCoords[1] - 8);
    ctx.lineTo(addButtonCoords[0], addButtonCoords[1] + 8);
    ctx.moveTo(addButtonCoords[0] - 8, addButtonCoords[1]);
    ctx.lineTo(addButtonCoords[0] + 8, addButtonCoords[1]);
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Main Node
    ctx.beginPath();
    ctx.arc(coords[0], coords[1], 100, 0, 2 * Math.PI);
    ctx.strokeStyle = theme.palette.primary.main;
    ctx.lineWidth = 3;
    ctx.fillStyle = "#fff";
    const img = document.createElement("img");
    img.src =
      "https://d3eqpfgwpn6v2o.cloudfront.net/ad01ac32-276d-4468-9c5a-d3c9746b2425/5d13944ca4204-7bf7c5d0-2bcb-45c6-be4c-90a801c8eeb3.png";
    // img.setAttribute("style", "height: 100px; width: 100px;");
    ctx.fill();
    ctx.stroke();
    ctx.drawImage(
      img,
      0,
      0,
      img.width,
      img.height,
      coords[0] - 75,
      coords[1] - 75,
      150,
      150
    );

    // i += 0.05;
    // requestAnimationFrameId = requestAnimationFrame(render);
  };

  useEffect(() => {});

  function getCursorPosition(
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return [x, y];
  }

  const onMouseDown: React.MouseEventHandler<HTMLCanvasElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const clickCoords = getCursorPosition(e);

    if (!clickCoords) {
      return;
    }

    const [lastX, lastY] = clickCoords;

    // const lastX = e.clientX;
    // const lastY = e.clientY;

    const dx = lastX - coords[0];
    const dy = lastY - coords[1];

    const clickedInCircle = dx * dx + dy * dy <= 100 * 100;
    if (clickedInCircle) {
      isDragging = true;
    }
  };

  const onMouseUp: React.MouseEventHandler<HTMLCanvasElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isDragging) {
      isDragging = false;
    }
  };

  const onMouseMove: React.MouseEventHandler<HTMLCanvasElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isDragging) {
      const clickCoords = getCursorPosition(e);

      if (!clickCoords) {
        return;
      }

      const [lastX, lastY] = clickCoords;

      const dx = lastX - coords[0];
      const dy = lastY - coords[1];

      coords[0] = coords[0] + dx;
      coords[1] = coords[1] + dy;

      render();
    }
  };

  return (
    <canvas
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      ref={canvasRef}
      style={{ width: "100%", height: "100%" }}
    />
  );
};

export default FusionFlowDesignerCanvas;
