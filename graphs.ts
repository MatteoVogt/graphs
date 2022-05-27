class GraphEdgeData {
    
}

class GraphNodeData {
    x: number;
    y: number;
}

class GraphEdge {
    json: string;
    nodes: Array<number>;

    constructor(json: string, nodes: Array<number>) {
            this.json = json;
            this.nodes = nodes;
    }
}

class GraphNode {
    id: number;
    json: string;
    edges: Array<GraphEdge>;

    constructor(id: number, json: string, edges: Array<GraphEdge>) {
            this.id = id;
            this.json = json;
            this.edges = edges;
    }

    getNeighbourIds(): Array<number> {
        let neighbours = [];
        for (var edge of this.edges) {
            let n1 = edge.nodes[0];
            let n2 = edge.nodes[1];
            if (n1 != this.id) { neighbours.push(n1); }
            else { neighbours.push(n2); }
        }

        return neighbours;
    }
}

class Graph {
    nodes: Array<GraphNode>;
    edges: Array<GraphEdge>;

    constructor() {
            this.nodes = [];
            this.edges = [];
    }

    addNode(json: string) {
        this.nodes.push(new GraphNode(this.nodes.length, json, []));
    }

    getNumNodes(): number {
        return this.nodes.length;
    }

    addEdge(idFrom: number, idTo:number) {
        if (idFrom < 0 || idFrom >= this.getNumNodes()) { return; }
        if (idTo < 0 || idTo >= this.getNumNodes()) { return; }
        let e = new GraphEdge("", [idFrom, idTo]);
        this.nodes[idFrom].edges.push(e);
        this.nodes[idTo].edges.push(e);
        this.edges.push(e);
    }

    getNumEdges(): number {
        return this.edges.length;
    }
}

let drawSelector = "vertex";
let isDrawing = false;
var edgeBegin: GraphNode;
let G = new Graph();

let canvas = document.getElementById("canvas") as HTMLCanvasElement;
canvas.width = canvas.parentElement.offsetWidth;
canvas.height = 1000;
let ctx = canvas.getContext("2d");
ctx.font = "20px Arial";
canvas.addEventListener("mousedown", beginDraw);
canvas.addEventListener("mouseup", endDraw);
canvas.addEventListener("mousemove", updateDraw);

let vertex_button = document.getElementById("vertex-button") as HTMLButtonElement;
let edge_button = document.getElementById("edge-button") as HTMLButtonElement;

function distance(u: Array<number>, v: Array<number>) {
    return Math.sqrt((u[0]-v[0])*(u[0]-v[0]) + (u[1]-v[1])*(u[1]-v[1]));
}

function clickVertexButton() {
    drawSelector = "vertex"
    vertex_button.className = "pure-button pure-button-active";
    edge_button.className = "pure-button";
}

function clickEdgeButton() {
    drawSelector = "edge"
    vertex_button.className = "pure-button";
    edge_button.className = "pure-button pure-button-active";
}

function beginDraw(e: MouseEvent) {
    let rect = canvas.getBoundingClientRect();
    let x =  e.clientX - rect.left;
    let y = e.clientY - rect.top;
    if (drawSelector == "edge") {
        for (var v of G.nodes) {
            let data : GraphNodeData = JSON.parse(v.json);
            if (distance([x,y], [data.x, data.y]) < 20) {
                edgeBegin = v;
                isDrawing = true;
                return;
            }
        }
    }
}

function endDraw(e: MouseEvent) {
    let rect = canvas.getBoundingClientRect();
    let x =  e.clientX - rect.left;
    let y = e.clientY - rect.top;
    if (drawSelector == "vertex") {
        G.addNode('{"x":' + x + ', "y":' + y + '}');
        drawVertex(G.nodes[G.getNumNodes() - 1]);
    } else if (drawSelector == "edge") {
        for (var v of G.nodes) {
            let data : GraphNodeData = JSON.parse(v.json);
            if (distance([x,y], [data.x, data.y]) < 20) {
                if(edgeBegin.id != v.id) {
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

function updateDraw(e: MouseEvent) {
    if (isDrawing) {
        let rect = canvas.getBoundingClientRect();
        let x =  e.clientX - rect.left;
        let y = e.clientY - rect.top;
        reDraw();
        let data: GraphNodeData = JSON.parse(edgeBegin.json);
        ctx.moveTo(data.x, data.y);
        ctx.lineTo(x, y);
        ctx.stroke();
    }
}

function reDraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var v of G.nodes) {
        drawVertex(v);
    }

    for (var e of G.edges) {
        let nodeFrom = G.nodes[e.nodes[0]];
        let nodeTo = G.nodes[e.nodes[1]];
        drawEdge(nodeFrom, nodeTo);
    }
}

function drawVertex(node: GraphNode) {
    let data: GraphNodeData = JSON.parse(node.json);
    ctx.beginPath()
    ctx.arc(data.x, data.y, 20, 0, 2 * Math.PI)
    ctx.stroke()
    if(node.id < 10) {
        ctx.fillText(node.id.toString(), data.x - 40, data.y);
    } else {
        ctx.fillText(node.id.toString(), data.x - 50, data.y);
    }
}

function drawEdge(nodeFrom: GraphNode, nodeTo: GraphNode) {
    let fromData: GraphNodeData = JSON.parse(nodeFrom.json);
    let toData: GraphNodeData = JSON.parse(nodeTo.json);
    ctx.moveTo(fromData.x, fromData.y);
    ctx.lineTo(toData.x, toData.y);
    ctx.stroke();
}