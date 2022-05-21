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
    Graph.prototype.addNode = function () {
        this.nodes.push(new GraphNode(this.nodes.length, "", []));
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
var canvas = document.getElementById("canvas");
canvas.width = canvas.parentElement.offsetWidth;
canvas.height = 1000;
var ctx = canvas.getContext("2d");
canvas.addEventListener("click", draw);
var vertex_button = document.getElementById("vertex-button");
var edge_button = document.getElementById("edge-button");
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
function draw(e) {
    var rect = canvas.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    if (drawSelector == "vertex") {
        drawVertex(x, y);
    }
}
function drawVertex(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, 2 * Math.PI);
    ctx.stroke();
}
