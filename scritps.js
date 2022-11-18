//Note: This was created using a tutorial
// Resource used: https://www.youtube.com/watch?v=y84tBZo8GFo

//Query Selectors
const canvas = document.querySelector("canvas"),
toolBtns = document.querySelectorAll(".tool"),
fillcolor = document.querySelector("#fill-color"),
sizeSlider = document.querySelector("#size-slider"),
colorBtns = document.querySelectorAll(".colors .option"),
colorPicker = document.querySelector("#color-picker"),
clearCanvas = document.querySelector(".clear-canvas"),
saveImg = document.querySelector(".save-img"),
ctx = canvas.getContext("2d");

// Variables & Defaults
let prevMouseX, prevMouseY, snapshot,
isDrawing = false,
selectedTool = "brush",
brushWidth = 5,
selectedColor = "#000";

// Sets the background to white so that the downloaded image will not be transparent
const setCanvasBackground = () => {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    Text.fillStyle = selectedColor; // Setting the fillstyle back to selected color, or else it will be white
}

window.addEventListener("load", () => {
    // Setting canvas w/h if removed line will be offset
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();
});

// Creates a line from where the user clickes to where the let go
const drawLine = (e) => {
    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY);
    ctx.lineTo(e.offsetX, e.offsetY); // creates line based on mouse location
    ctx.stroke();
    // Fills if fill is checked
    if(fillcolor.checked) {
        ctx.fill();
        ctx.stroke();
    }
}

//Draws rectangle, if fill is checked it draws a filled in rectangle - technically can be used for squares as well
const drawRect = (e) => {
    if(!fillcolor.checked) {
        ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    } else {
        ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    }
   
}

//Draws circle, if fill is checked it draws a filled in circle
const drawCircle = (e) => {
    ctx.beginPath();
    // getting radius for circle based on location of mouse pointer
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2));
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
    ctx.stroke();
    // if fill is checked then fill it in
    if(fillcolor.checked) {
        ctx.fill();
        ctx.stroke();
    }
}

//Draws triangle, if fill is checked it draws a filled in triangle
const drawTriangle = (e) => {
    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY);
    ctx.lineTo(e.offsetX, e.offsetY); // creates first line based on mouse location
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY); // creates bottom line on triangle
    ctx.closePath(); // Closes path of triangle to draw third line
    ctx.stroke();
    // Fills if fill is checked
    if(fillcolor.checked) {
        ctx.fill();
        ctx.stroke();
    }
}

// Runs when mouse is pressed, sets isDrawing to true and allows the user
// to draw
const startDrawing = (e) => {
    isDrawing = true; //creating new path to draw circle
    prevMouseX = e.offsetX; //Passes current mouseX as prevMouseX
    prevMouseY = e.offsetY; //Passes current mouseY as prevMouseY
    ctx.beginPath(); // Creates new drawing path
    ctx.lineWidth = brushWidth;
    ctx.strokeStyle = selectedColor;
    ctx.fillStyle = selectedColor;
    // avoids dragging shape img
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

//Drawing function - draws line where mouse cursor is
// does not draw until isDrawing is true
const drawing = (e) => {
    if(!isDrawing) return; //Will not draw if isDrawing is false
    ctx.putImageData(snapshot, 0, 0);
    if(selectedTool === "brush" || selectedTool === "eraser") {
        //if selected tool is eraser, set strokeStyle to white
        // else set stroke color to selectedColor
        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
        ctx.lineTo(e.offsetX, e.offsetY); //Creates the line according to the postion of the mouse cursor
        ctx.stroke(); // fills in the line with a color
    } else if(selectedTool === "line") {
        drawLine(e);
    } else if(selectedTool === "rectangle") {
        drawRect(e);
    } else if(selectedTool ==="circle") {
        drawCircle(e);
    } else {
        drawTriangle(e);
    }
}

toolBtns.forEach(btn => {
    btn.addEventListener("click", () => {// click event for all the tools
        //Removes active from currently active - adds it to the btn we clicked
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;

        //Shows you what tool you clicked on
        console.log(selectedTool);
    });
});

sizeSlider.addEventListener("change", () => brushWidth = sizeSlider.value);

colorBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        //Removes active from currently active - adds it to the btn we clicked
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
    });
});

colorPicker.addEventListener("change", () => {
    // Sets current color to value selected and changes the color of the button to the selected color
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
});

clearCanvas.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clears the whole canvas
});

saveImg.addEventListener("click", () => {
    const link = document.createElement("a"); // Creates an <a> element
    link.download = `${Date.now()}.jpg`; // passing current date as link download value
    link.href = canvas.toDataURL(); // passing canvasData as link href value
    link.click(); // Clicking link to download the image
});
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => isDrawing = false);

//For debugging
console.log