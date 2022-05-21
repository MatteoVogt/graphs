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

    addNode() {
        this.nodes.push(new GraphNode(this.nodes.length, "", []));
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

let drawSelector = "vertex"

let canvas = document.getElementById("canvas") as HTMLCanvasElement;
canvas.width = canvas.parentElement.offsetWidth;
canvas.height = 1000;
let ctx = canvas.getContext("2d");
canvas.addEventListener("click", draw)

let vertex_button = document.getElementById("vertex-button") as HTMLButtonElement;
let edge_button = document.getElementById("edge-button") as HTMLButtonElement;

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

function draw(e: MouseEvent) {
    let rect = canvas.getBoundingClientRect();
    let x =  e.clientX - rect.left;
    let y = e.clientY - rect.top;
    if (drawSelector == "vertex") {
        drawVertex(x, y);
    }
}

function drawVertex(x: number, y: number) {
    ctx.beginPath()
    ctx.arc(x, y, 20, 0, 2 * Math.PI)
    ctx.stroke()
}