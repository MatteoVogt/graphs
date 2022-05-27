var GraphEdgeData = /** @class */ (function () {
    function GraphEdgeData() {
    }
    return GraphEdgeData;
}());
var GraphNodeData = /** @class */ (function () {
    function GraphNodeData() {
    }
    return GraphNodeData;
}());
var GraphEdge = /** @class */ (function () {
    function GraphEdge(json, nodes) {
        this.json = json;
        this.nodes = nodes;
    }
    return GraphEdge;
}());
var GraphNode = /** @class */ (function () {
    function GraphNode(id, json, edges) {
        this.id = id;
        this.json = json;
        this.edges = edges;
    }
    GraphNode.prototype.getNeighbourIds = function () {
        var neighbours = [];
        for (var _i = 0, _a = this.edges; _i < _a.length; _i++) {
            var edge = _a[_i];
            var n1 = edge.nodes[0];
            var n2 = edge.nodes[1];
            if (n1 != this.id) {
                neighbours.push(n1);
            }
            else {
                neighbours.push(n2);
            }
        }
        return neighbours;
    };
    return GraphNode;
}());
var Graph = /** @class */ (function () {
    function Graph() {
        this.nodes = [];
        this.edges = [];
    }
    Graph.prototype.addNode = function (json) {
        this.nodes.push(new GraphNode(this.nodes.length, json, []));
    };
    Graph.prototype.getNumNodes = function () {
        return this.nodes.length;
    };
    Graph.prototype.addEdge = function (idFrom, idTo) {
        if (idFrom < 0 || idFrom >= this.getNumNodes()) {
            return;
        }
        if (idTo < 0 || idTo >= this.getNumNodes()) {
            return;
        }
        var e = new GraphEdge("", [idFrom, idTo]);
        this.nodes[idFrom].edges.push(e);
        this.nodes[idTo].edges.push(e);
        this.edges.push(e);
    };
    Graph.prototype.getNumEdges = function () {
        return this.edges.length;
    };
    return Graph;
}());
var drawSelector = "vertex";
var isDrawing = false;
var edgeBegin;
var G = new Graph();
var canvas = document.getElementById("canvas");
canvas.width = canvas.parentElement.offsetWidth;
canvas.height = 1000;
var ctx = canvas.getContext("2d");
ctx.font = "20px Arial";
canvas.addEventListener("mousedown", beginDraw);
canvas.addEventListener("mouseup", endDraw);
canvas.addEventListener("mousemove", updateDraw);
var vertex_button = document.getElementById("vertex-button");
var edge_button = document.getElementById("edge-button");
function distance(u, v) {
    return Math.sqrt((u[0] - v[0]) * (u[0] - v[0]) + (u[1] - v[1]) * (u[1] - v[1]));
}
function clickVertexButton() {
    drawSelector = "vertex";
    vertex_button.className = "pure-button pure-button-active";
    edge_button.className = "pure-button";
}
function clickEdgeButton() {
    drawSelector = "edge";
    vertex_button.className = "pure-button";
    edge_button.className = "pure-button pure-button-active";
}
function beginDraw(e) {
    var rect = canvas.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    if (drawSelector == "edge") {
        for (var _i = 0, _a = G.nodes; _i < _a.length; _i++) {
            var v = _a[_i];
            var data = JSON.parse(v.json);
            if (distance([x, y], [data.x, data.y]) < 20) {
                edgeBegin = v;
                isDrawing = true;
                return;
            }
        }
    }
}
function endDraw(e) {
    var rect = canvas.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    if (drawSelector == "vertex") {
        G.addNode('{"x":' + x + ', "y":' + y + '}');
        drawVertex(G.nodes[G.getNumNodes() - 1]);
    }
    else if (drawSelector == "edge") {
        for (var _i = 0, _a = G.nodes; _i < _a.length; _i++) {
            var v = _a[_i];
            var data = JSON.parse(v.json);
            if (distance([x, y], [data.x, data.y]) < 20) {
                if (edgeBegin.id != v.id) {
                    G.addEdge(edgeBegin.id, v.id);
                    drawEdge(edgeBegin, v);
                }
                break;
            }
        }
    }
    isDrawing = false;
    reDraw();
}
function updateDraw(e) {
    if (isDrawing) {
        var rect = canvas.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        reDraw();
        var data = JSON.parse(edgeBegin.json);
        ctx.moveTo(data.x, data.y);
        ctx.lineTo(x, y);
        ctx.stroke();
    }
}
function reDraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var _i = 0, _a = G.nodes; _i < _a.length; _i++) {
        var v = _a[_i];
        drawVertex(v);
    }
    for (var _b = 0, _c = G.edges; _b < _c.length; _b++) {
        var e = _c[_b];
        var nodeFrom = G.nodes[e.nodes[0]];
        var nodeTo = G.nodes[e.nodes[1]];
        drawEdge(nodeFrom, nodeTo);
    }
}
function drawVertex(node) {
    var data = JSON.parse(node.json);
    ctx.beginPath();
    ctx.arc(data.x, data.y, 20, 0, 2 * Math.PI);
    ctx.stroke();
    if (node.id < 10) {
        ctx.fillText(node.id.toString(), data.x - 40, data.y);
    }
    else {
        ctx.fillText(node.id.toString(), data.x - 50, data.y);
    }
}
function drawEdge(nodeFrom, nodeTo) {
    var fromData = JSON.parse(nodeFrom.json);
    var toData = JSON.parse(nodeTo.json);
    ctx.moveTo(fromData.x, fromData.y);
    ctx.lineTo(toData.x, toData.y);
    ctx.stroke();
}
