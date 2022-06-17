const colorCircle = document.querySelectorAll(".color-circle");
const imageInput = document.getElementById("image_input");
const saveForm = document.getElementById("saveForm");
const pictureNameInput = document.getElementById("pictureName");

let canvas;
let ctx;
let savedImageData;

let dragging = false;
let strokeColor = "black";

let fillColor = strokeColor;
let line_Width = document.getElementById("pen-range").value;
let polygonSides = 6;

let currentTool = "brush";

canvas = document.getElementById("canvas");
let canvasWidth = canvas.scrollWidth;
let canvasHeight = canvas.scrollHeight;

let pathArray = [];
let index = -1;

let usingBrush = false;

let brushXPoints;
let brushYPoints;

// size data used to create rubber band shapes
class ShapeBoundingBox {
  constructor(left, top, width, height) {
    this.left = left;
    this.top = top;
    this.width = width;
    this.height = height;
  }
}

class MouseDownPos {
  constructor(x, y) {
    (this.x = x), (this.y = y);
  }
}

// curr mouse location
class Location {
  constructor(x, y) {
    (this.x = x), (this.y = y);
  }
}

class PolygonPoint {
  constructor(x, y) {
    (this.x = x), (this.y = y);
  }
}

let shapeBoundingBox = new ShapeBoundingBox(0, 0, 0, 0);
let mousedown = new MouseDownPos(0, 0);
let loc = new Location(0, 0);

document.addEventListener("DOMContentLoaded", setupCanvas);

function setupCanvas() {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");

  ctx.lineWidth = line_Width;
  //when the mouse is clicked
  canvas.addEventListener("mousedown", ReactToMouseDown);
  canvas.addEventListener("mousemove", ReactToMouseMove);
  canvas.addEventListener("mouseup", ReactToMouseUp);
}

function ChangeTool(toolClicked) {
  document.getElementById("save").className = "";
  document.getElementById("brush").className = "";
  document.getElementById("line").className = "";
  document.getElementById("rectangle").className = "";
  document.getElementById("circle").className = "";
  document.getElementById("ellipse").className = "";
  document.getElementById("polygon").className = "";

  document.getElementById(toolClicked).className = "selected";
  currentTool = toolClicked;
}

function GetMousePosition(x, y) {
  let canvasSizeData = canvas.getBoundingClientRect();
  return {
    x: (x - canvasSizeData.left) * (canvas.width / canvasSizeData.width),
    y: (y - canvasSizeData.top) * (canvas.height / canvasSizeData.height),
  };
}

function SaveCanvasImage() {
  savedImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  pathArray.push(savedImageData);
  index += 1;
}

function RedrawCanvasImage() {
  ctx.putImageData(pathArray[index], 0, 0);
  //ctx.putImageData(savedImageData,0,0);
}

function UpdateRubberbandSizeData(loc) {
  shapeBoundingBox.width = Math.abs(loc.x - mousedown.x);
  shapeBoundingBox.height = Math.abs(loc.y - mousedown.y);

  if (loc.x > mousedown.x) {
    shapeBoundingBox.left = mousedown.x;
  } else {
    shapeBoundingBox.left = loc.x;
  }

  if (loc.y > mousedown.y) {
    shapeBoundingBox.top = mousedown.y;
  } else {
    shapeBoundingBox.top = loc.y;
  }
}

// angle = arcTan(Opp / Adj)
function getAngle(mouselocX, mouselocY) {
  let adjacent = mousedown.x - mouselocX;
  let opposite = mousedown.y - mouselocY;

  return radiansToDegrees(Math.atan2(opposite, adjacent));
}

function radiansToDegrees(rad) {
  if (rad < 0) {
    return (360.0 + rad * (180 / Math.PI)).toFixed(2);
  } else {
    return (rad * (180 / Math.PI)).toFixed(2);
  }
}

function degreesToRadians(degrees) {
  return degrees * (Math.PI / 180);
}

function getPolygonPoints() {
  let angle = degreesToRadians(getAngle(loc.x, loc.y));

  let radiusX = shapeBoundingBox.width;
  let radiusY = shapeBoundingBox.height;

  let polygonPoints = [];

  for (let i = 0; i < polygonSides; i++) {
    polygonPoints.push(
      new PolygonPoint(
        loc.x + radiusX * Math.sin(angle),
        loc.y - radiusY * Math.cos(angle)
      )
    );
    angle += (2 * Math.PI) / polygonSides;
  }
  return polygonPoints;
}

function getPolygon() {
  let polygonPoints = getPolygonPoints();
  ctx.beginPath();
  ctx.moveTo(polygonPoints[0].x, polygonPoints[0].y);
  for (let i = 1; i < polygonSides; i++) {
    ctx.lineTo(polygonPoints[i].x, polygonPoints[i].y);
  }
  ctx.closePath();
}

function drawRubberbandShape(loc) {
  ctx.strokeStyle = strokeColor;
  ctx.fillStyle = fillColor;

  line_Width = document.getElementById("pen-range").value;

  if (currentTool === "brush") {
    DrawBrush();
  } else if (currentTool === "line") {
    ctx.beginPath();
    ctx.moveTo(mousedown.x, mousedown.y);
    ctx.lineTo(loc.x, loc.y);
    ctx.stroke();
  } else if (currentTool === "rectangle") {
    ctx.strokeRect(
      shapeBoundingBox.left,
      shapeBoundingBox.top,
      shapeBoundingBox.width,
      shapeBoundingBox.height
    );
  } else if (currentTool === "circle") {
    let radius = shapeBoundingBox.width;
    ctx.beginPath();
    ctx.arc(mousedown.x, mousedown.y, radius, 0, Math.PI * 2);
    ctx.stroke();
  } else if (currentTool === "ellipse") {
    // ctx.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle)
    let radiusX = shapeBoundingBox.width / 2;
    let radiusY = shapeBoundingBox.height / 2;
    ctx.beginPath();
    ctx.ellipse(
      mousedown.x,
      mousedown.y,
      radiusX,
      radiusY,
      Math.PI / 4,
      0,
      Math.PI * 2
    );
    ctx.stroke();
  } else if (currentTool === "polygon") {
    getPolygon();
    ctx.stroke();
  }
}

function UpdateRubberbandOnMove(loc) {
  UpdateRubberbandSizeData(loc);
  drawRubberbandShape(loc);
}

function AddBrushPoint(x, y) {
  brushXPoints = x;
  brushYPoints = y;
}

function DrawBrush() {
  ctx.strokeStyle = strokeColor;
  ctx.fillStyle = fillColor;

  ctx.lineCap = "round";

  ctx.lineTo(brushXPoints, brushYPoints);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(brushXPoints, brushYPoints);
}

function ReactToMouseDown(e) {
  loc = GetMousePosition(e.clientX, e.clientY);

  SaveCanvasImage();

  mousedown.x = loc.x;
  mousedown.y = loc.y;
  dragging = true;

  if (currentTool === "brush") {
    usingBrush = true;
    AddBrushPoint(loc.x, loc.y);
  }
}

function ReactToMouseMove(e) {
  loc = GetMousePosition(e.clientX, e.clientY);

  if (currentTool === "brush" && dragging && usingBrush) {
    AddBrushPoint(loc.x, loc.y);
    DrawBrush();
    SaveCanvasImage();
    RedrawCanvasImage();
  } else {
    if (dragging) {
      RedrawCanvasImage();
      UpdateRubberbandOnMove(loc);
    }
  }
}

function ReactToMouseUp(e) {
  canvas.style.cursor = "default";
  loc = GetMousePosition(e.clientX, e.clientY);
  RedrawCanvasImage();
  UpdateRubberbandOnMove(loc);
  dragging = false;
  usingBrush = false;
  ctx.beginPath();
}

function SaveImage() {
  var imageFile = document.getElementById("save");
  imageFile.setAttribute("download", "image.png");
  imageFile.setAttribute("href", canvas.toDataURL());
}

function OpenImage() {
  let img = new Image();
  img.onload = function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
  };
  img.src = "image.png";
}

const selectColor = (elem) => {
  removeActiveCircleColor();

  strokeColor = elem.getAttribute("data-color");
  elem.classList.add("active");
};

const removeActiveCircleColor = () => {
  colorCircle.forEach((circle) => {
    circle.classList.remove("active");
  });
};

const customColor = (elem) => {
  removeActiveCircleColor();
  strokeColor = elem.value;
};

function penSizeChange(pensize) {
  ctx.lineWidth = pensize;
}

function clearAll() {
  ctx.clearRect(0, 0, canvasHeight, canvasWidth);
  SaveCanvasImage();
  RedrawCanvasImage();
  pathArray = [];
  index = -1;
}


undo.addEventListener("click", ()=>{
  if (index <= 0) {
    clearAll();
  } else {
    index -= 1;
    pathArray.pop();
    ctx.putImageData(pathArray[index], 0, 0);
  }
  SaveCanvasImage();
})

imageInput.addEventListener("change", (e) => {
  if (e.target.files) {
    let imageFile = e.target.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(imageFile);
    reader.onloadend = function (e) {
      var image = new Image();
      image.src = e.target.result;
      image.onload = function (ev) {
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);
      };
    };
  }
});

saveForm.getElementsByTagName("input")[0].disabled =
  !localStorage.getItem("username");

saveForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const pictureName = e.target.pictureName.value;
  const dataUrl = canvas.toDataURL();

  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("Authorization", localStorage.getItem("access_token"));

  fetch("http://localhost:3002/images", {
    method: "POST",
    headers,
    body: JSON.stringify({
      username: localStorage.getItem("username"),
      name: pictureName,
      data: dataUrl,
    }),
  })
    .then(() => console.log("saved"))
    .catch(() => console.log("failed"));
});

const loadImage = async (imageId) => {
  const imageData = await (
    await fetch(`http://localhost:3002/images/${imageId}`)
  ).json();

  const image = new Image();
  image.src = imageData.data;

  setTimeout(() => {
    ctx.drawImage(image, 0, 0);
  }, 0);

  pictureNameInput.value = imageData.name;
};

const params = new URLSearchParams(location.search.substring(1));
const imageId = params.get("image");
if (imageId) {
  loadImage(imageId);
}
