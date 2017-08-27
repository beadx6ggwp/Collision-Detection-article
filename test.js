/* 

這檔案單純測試用

*/


// 假設分離軸為45度角
var axis = new Vector(1, -1);

// 取得box1的4個角
var boxA_Vertices = box1.getVertices();

// 先以第一個角當初始值
// vec.projectLengthOnto(axis) : 取得vec在axis上的投影長
var min_proj_boxA = boxA_Vertices[0].projectLengthOnto(axis);
var min_index_boxA = 0;

var max_proj_boxA = boxA_Vertices[0].projectLengthOnto(axis);
var max_index_boxA = 0;

// 再從剩下的3個角選出最大和最小投影
for (var i = 1; i < 4; i++) {
    var current = boxA_Vertices[i].projectLengthOnto(axis);

    // 選擇最小投影
    if (current < min) {
        min_proj_boxA = current;
        min_index_boxA = i;
    }
    // 選擇最大投影
    if (current > max) {
        max_proj_boxA = current;
        max_index_boxA = i;
    }
}

if (min_proj_boxB > max_proj_boxA || min_proj_boxA > max_proj_boxB)
    Console.log("分離");// isSeparated
else
    Console.log("碰撞");// isCollided



function Box(x, y, w, h) {
    this.pos = new Vector(x, y);// center
    this.w = w;
    this.h = h;
    // 以順時針紀錄矩形的四個角
    this.corners = [
        new Vector(w / 2, -h / 2),
        new Vector(w / 2, h / 2),
        new Vector(-w / 2, h / 2),
        new Vector(-w / 2, -h / 2)
    ];
    this.directionAngle = toRadio(45);

    this.getVertices = function () {
        var vertices = [];

        // 順時針走訪角落
        for (var i = 0; i < this.corners.length; i++) {
            var p1 = this.corners[i];

            var vec = new Vector(this.pos.x + p1.x, this.pos.y + p1.y);
            // 將各個角以物體中心為參考點來旋轉
            vec.rotateRefPoint(this.directionAngle, this.pos);

            vertices.push(vec);
        }
        // 最後回傳以物體中心為參考點選轉後的角落
        return vertices;
    }

    this.getNorms = function () {
        // 取得頂點
        var vertices = this.getVertices();
        var norms = [];
        var p1, p2, n;

        // 順時鐘
        for (let i = 1; i < vertices.length; i++) {
            p1 = vertices[i - 1];
            p2 = vertices[i];
            n = new Vector(p2.x - p1.x, p2.y - p1.y).normalL();
            norms.push(n);
        }

        // 補上最後一個邊
        p1 = vertices[vertices.length - 1];
        p2 = vertices[0];
        n = new Vector(p2.x - p1.x, p2.y - p1.y).normalL();
        norms.push(n);
        // 最後傳回這個物體所有邊上的左法向量
        return norms;
    }
}

function SAT_Collision(boxA, boxB) {
    var vertices_boxA = boxA.getVertices();
    var vertices_boxB = boxB.getVertices();
    var norms_boxA = boxA.getNorm();
    var norms_boxB = boxB.getNorm();

    // 假設boxA的法向量為P、Q，boxB為R、S

    // 物體在P、Q檢查軸上的投影
    // boxA、boxB在P上的投影
    var MinMax_PA = getMinMax(vertices_boxA, norms_boxA[0]);
    var MinMax_PB = getMinMax(vertices_boxB, norms_boxA[0]);
    // boxA、boxB在Q上的投影
    var MinMax_QA = getMinMax(vertices_boxA, norms_boxB[1]);
    var MinMax_QB = getMinMax(vertices_boxB, norms_boxB[1]);

    // 物體在R、S檢查軸上的投影
    // boxA、boxB在R上的投影
    var MinMax_RA = getMinMax(vertices_boxA, norms_boxB[0]);
    var MinMax_RB = getMinMax(vertices_boxB, norms_boxB[0]);
    // boxA、boxB在S上的投影
    var MinMax_SA = getMinMax(vertices_boxA, norms_boxB[1]);
    var MinMax_SB = getMinMax(vertices_boxB, norms_boxB[1]);

    // 在分離軸上是否分離
    var separate_P = MinMax_PB.min > MinMax_PA.max ||
        MinMax_PA.min > MinMax_PB.max;
    var separate_Q = MinMax_QB.min > MinMax_QA.max ||
        MinMax_QA.min > MinMax_QB.max;
    var separate_R = MinMax_RB.min > MinMax_RA.max ||
        MinMax_RA.min > MinMax_RB.max;
    var separate_S = MinMax_SB.min > MinMax_SA.max ||
        MinMax_SA.min > MinMax_SB.max;

    var isSeparated = separate_P || separate_Q || separate_R || separate_S;
    if (isSeparated)
        Console.log("分離");// isSeparated
    else
        Console.log("碰撞");// isCollided
}

// getMinMax(頂點陣列,分離軸)
function getMinMax(vertices, axis) {
    var min_DotProduct = vertices[0].projectLengthOnto(axis);
    var max_DotProduct = vertices[0].projectLengthOnto(axis);
    var min_index = 0, max_index = 0;
    // ...省略...    
    var result = {
        min: min_proj,
        max: max_proj,
        minPoint: vertices[min_index],
        maxPoint: vertices[max_index]
    };
    return result;
}


// SAT-Collision.js
// true:兩物體分離, false:兩物體碰撞
function SAT_Collision(polygonA, polygonB) {
    // 取得多邊形每個邊上的法向量，回傳陣列
    var normal_polygonA = polygonA.getNorm(),
        normal_polygonB = polygonB.getNorm();
    // 取得多邊形的頂點陣列，回傳陣列
    var vertices_polygonA = polygonA.getVertices(),
        vertices_polygonB = polygonB.getVertices();

    var isSeparated = false;

    // 透過迴圈走訪多邊形A的法向量，來檢查是否分離
    for (var i = 0; i < normal_polygonA.length; i++) {
        var minMax_A = getMinMax(vertices_polygonA, normal_polygonA[i]);
        var minMax_B = getMinMax(vertices_polygonB, normal_polygonA[i]);

        isSeparated = (minMax_B.min > minMax_A.max || minMax_A.min > minMax_B.max);
        // 只要發現有一條分離線，就代表物體沒有發生碰撞
        if (isSeparated) return true;
    }

    // 透過迴圈走訪多邊形B的法向量，來檢查是否分離
    for (let i = 0; i < normal_polygonB.length; i++) {
        var minMax_A = getMinMax(vertices_polygonA, normal_polygonB[i]);
        var minMax_B = getMinMax(vertices_polygonB, normal_polygonB[i]);

        isSeparated = (minMax_B.min > minMax_A.max || minMax_A.min > minMax_B.max);
        if (isSeparated) return true;
    }
    // 如果所有法向量都檢查過後，沒有發現分離，代表兩物體碰撞
    return false;
}

function update(dt) {
    polygonA.update(dt);
    polygonB.update(dt);

    var isCollided = !SAT_Collision(polygonA, polygonB);
    if (isCollided) {
        // ...發生碰撞後要做的事...
    }
}


function SAT_CircleToPolygon(circle, polygon) {
    var normal_polygon = polygon.getNorm();
    var vertices_polygon = polygonA.getVertices();

    var center = circle.pos;
    var radius = circle.radius;

    var isSeparated = false;

    for (var i = 0; i < normal_polygon.length; i++) {
        var minMax_P = getMinMax(vertices_polygon, normal_polygon[i]);
        // 計算圓的min、max
        var projectLen_C = center.projectLengthOnto(normal_polygon[i]);
        var min_C = projectLen_C - radius;
        var max_C = projectLen_C + radius;

        isSeparated = (min_C > minMax_P.max || minMax_P.min > max_C);
        // 只要發現有一條分離線，就代表物體沒有發生碰撞
        if (isSeparated) return true;
    }
    return false;
}

function update(dt) {
    // ...更新物體狀態...

    for (var i = 0; i < shapes.length; i++) {
        for (var j = 0; j < shapes.length; j++) {

            if (i == j) continue;

            var isCollided = !SAT_Collision(shapes[i], shapes[j]);
            if (isCollided) {
                // ...碰撞事件...
            }
        }
    }

}



function rotate(vec, angle) {
    var new_x = (vec.x * Math.cos(angle)) - (vec.y * Math.sin(angle));
    var new_y = (vec.x * Math.sin(angle)) + (vec.y * Math.cos(angle));

    vec.x = new_x;
    vec.y = new_y;
}

function Vector(x, y) {
    this.x = x;
    this.y = y;
}
// 取得這個自己的長度
Vector.prototype.length = function () {
    return Math.sqrt(this.x * this.x + this.y * this.y);
}
// 取得自己與vec2的內積
Vector.prototype.dot = function (vec2) {
    return this.x * vec2.x + this.y * vec2.y;
}
// 取得自己在vec2上的正射影長
Vector.prototype.projectLengthOnto = function (vec2) {
    var dotProduct = this.dot(vec2);
    var len = vec2.length();
    return dotProduct / len;
}
// 取得自己的左法向量
Vector.prototype.normalL = function () {
    return new Vector(-this.y, this.x);
}
// 取得自己的右法向量
Vector.prototype.normalR = function () {
    return new Vector(this.y, -this.x);
}
// angle:弧度, refP:參考點
// 作用: 以refP為參考點，旋轉angle角
//使用方式

var vec1 = new Vector(3, 4);
var vec2 = new Vector(1, 0);
vec1.length() // => 5
vec1.dot(vec2) // => 3
vec1.projectLengthOnto(vec2) // =>3
vec1.normalL() // = (-4, 3)
vec1.normalR() // = (4, -3)

Vector.prototype.rotate = function (angle) {
    let new_x = (this.x * Math.cos(angle)) - (this.y * Math.sin(angle));
    let new_y = (this.x * Math.sin(angle)) + (this.y * Math.cos(angle));

    this.x = new_x;
    this.y = new_y;
};
Vector.prototype.rotateRefPoint = function (angle, refP) {
    let new_x = (this.x - refP.x) * Math.cos(angle) - (this.y - refP.y) * Math.sin(angle) + refP.x;
    let new_y = (this.y - refP.y) * Math.cos(angle) + (this.x - refP.x) * Math.sin(angle) + refP.y;
    this.x = new_x;
    this.y = new_y;
};

// 取得vec1與vec2的內積
function dot(vec1, vec2) {
    return vec1.x * vec2.x + vec1.y * vec2.y;
}
// 取得vec1在vec2上的正射影長
function projectLengthOnto(vec1, vec2) {
    var dotProduct = dot(vec1, vec2);
    var len = Math.sqrt(vec2.x * vec2.x + vec2.y * vec2.y);
    return dotProduct / len;
}
// 取得vec的左法向量
function getNormalL(vec) {
    return new Vector(-vec.y, vec.x);
}
// 取得vec的右法向量
function getNormalR(vec) {
    return new Vector(vec.y, -vec.x);
}

// getMinMax(頂點陣列,分離軸)
function getMinMax(vertices, axis) {
    // 先以第一個角落投影為標準
    var min_DotProduct = vertices[0].projectLengthOnto(axis),
        max_DotProduct = vertices[0].projectLengthOnto(axis);

    for (var i = 1; i < vertices.length; i++) {
        // 取得當前要比對的投影長度
        var temp = vertices[i].projectLengthOnto(axis);
        // 如果比當前最小的更小，紀錄它
        if (temp < min_DotProduct) {
            min_DotProduct = temp;
            min_index = i;
        }
        // 如果比當前最小的更大，紀錄它
        if (temp > max_DotProduct) {
            max_DotProduct = temp;
            max_index = i;
        }
    }

    var result = {
        min: min_DotProduct,
        max: max_DotProduct
    };
    // 最後傳回一個物件包含min、max屬性
    return result;
}