var cnavas,
    ctx,
    width,
    height;
var animation,
    lastTime = 0,
    Timesub = 0,
    loop = true;
var ctx_font = "Consolas",
    ctx_fontsize = 10,
    ctx_backColor = "#777";

window.onload = function () {
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;


    document.addEventListener("mousedown", mousedown, false);
    document.addEventListener("mouseup", mouseup, false);
    document.addEventListener("mousemove", mousemove, false);

    main();
}

var isDown = false;
var dragPoint, offSet;
var rects = [];

function main() {
    console.log("Start");

    for (let i = 0; i < 2; i++) {
        let obj = {
            x: randomInt(width / 4, width * 3 / 4),
            y: randomInt(height / 4, height * 3 / 4),
            width: randomInt(100, 200),
            height: randomInt(100, 200)
        };
        rects.push(obj);
    }

    mainLoop();
}


function update() {
    if (RectCollision(rects[0], rects[1])) {
        ctx.fillStyle = "rgba(255,165,165,0.9)";
    }
    else {
        ctx.fillStyle = "rgba(255,255,255,0.9)";
    }
}

function draw() {
    for (let i = 0; i < 2; i++) {
        let obj = rects[i];
        drawRect(obj.x - obj.width / 2, obj.y - obj.height / 2, obj.width, obj.height);
        drawString(ctx, i + "",
            obj.x, obj.y,
            "#000", 10, "consolas",
            0, 0, 0);
    }
}

function RectCollision(r1, r2) {
    // 這邊因為(X,Y)在方塊中心，所以在取得min、max時，要 +/- width/2
    // Rect1
    var minX1 = r1.x - r1.width / 2, maxX1 = r1.x + r1.width / 2,
        minY1 = r1.y - r1.height / 2, maxY1 = r1.y + r1.height / 2;
    // Rect2
    var minX2 = r2.x - r2.width / 2, maxX2 = r2.x + r2.width / 2,
        minY2 = r2.y - r2.height / 2, maxY2 = r2.y + r2.height / 2;

    if (maxX1 > minX2 && maxX2 > minX1 &&
        maxY1 > minY2 && maxY2 > minY1) {
        return true;
    }
    else
        return false;
}
function PoingInRect(x, y, rect) {
    var minX = rect.x - rect.width / 2, maxX = rect.x + rect.width / 2;
    var minY = rect.y - rect.height / 2, maxY = rect.y + rect.height / 2;

    if (x > minX && x < maxX &&
        y > minY && y < maxY) {
        return true;
    }
    else
        return false;
}

function mainLoop(timestamp) {
    Timesub = timestamp - lastTime;// get sleep
    lastTime = timestamp;
    //Clear
    ctx.fillStyle = ctx_backColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    //--------Begin-----------

    update();
    draw();

    //--------End---------------
    let str1 = "Fps:" + 1000 / Timesub, str2 = "Sleep: " + Timesub;
    drawString(ctx, str1 + "\n" + str2,
        0, height - 21,
        "#FFF", 10, "consolas",
        0, 0, 0);
    if (loop) {
        animation = window.requestAnimationFrame(mainLoop);
    } else {
        // over
    }
}

function mousedown(e) {
    let mouse = { x: e.clientX, y: e.clientY };
    dragPoint = findDragPoint(mouse.x, mouse.y);
    if (dragPoint) {
        isDown = true;
        offSet = {
            x: mouse.x - dragPoint.x,
            y: mouse.y - dragPoint.y
        };
        let index = rects.indexOf(dragPoint);
        rects.push(rects[index]);
        rects.splice(index, 1);
        // 排序後面圖層越上面，所以只要將原位置刪除，並在最後加入，就不會動到其他元素的順序
    }
}
function mouseup(e) {
    isDown = false;
}
function mousemove(e) {
    let mouse = { x: e.clientX, y: e.clientY };
    if (isDown) {
        //update
        dragPoint.x = mouse.x - offSet.x;
        dragPoint.y = mouse.y - offSet.y;
    }
}
function findDragPoint(x, y) {
    for (let i = 0; i < rects.length; i++) {
        if (PoingInRect(x, y, rects[i])) {
            return rects[i];
        }
    }
    return null;
}

//----tool-------
function drawRect(x, y, w, h) {
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.fill();
    ctx.stroke();
}
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function random(min, max) {
    return Math.random() * (max - min) + min;
}