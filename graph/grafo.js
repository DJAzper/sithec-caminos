import {Queue} from "./queue.js";

export class Grafo {
    constructor(noOfVertices) {
        this.noOfVertices = noOfVertices;
        this.AdjList = new Map();
    }

    addVertex(v) {
        this.AdjList.set(v, []);
    }

    addEdge(v, w) {
        this.AdjList.get(v).push(w);
    }

    getEdge(v, w) {
        return this.AdjList;
    }

    printGraph() {
        var get_keys = this.AdjList.keys();

        for (var i of get_keys) {
            var get_values = this.AdjList.get(i);
            var conc = "";
            for (var j of get_values)
                conc += j + " ";
            console.log(i + " -> " + conc);
        }
    }

    bfs(startingNode) {
        var visited = {};
        var recorridobfs = [];
        var q = new Queue();

        visited[startingNode] = true;
        q.enqueue(startingNode);

        while (!q.isEmpty()) {
            var getQueueElement = q.dequeue();
            recorridobfs.push(getQueueElement);
            var get_List = this.AdjList.get(getQueueElement);

            for (var i in get_List) {
                var neigh = get_List[i];

                if (!visited[neigh]) {
                    visited[neigh] = true;
                    q.enqueue(neigh);
                }
            }
        }
        return recorridobfs;
    }

    dfs(startingNode) {
        var visited = {};
        var recorridodfs = [];
        this.DFSUtil(startingNode, visited, recorridodfs);
        return recorridodfs;
    }

    DFSUtil(vert, visited, recorridodfs) {
        visited[vert] = true;
        recorridodfs.push(vert);

        var get_neighbours = this.AdjList.get(vert);

        for (var i in get_neighbours) {
            var get_elem = get_neighbours[i];
            if (!visited[get_elem])
                this.DFSUtil(get_elem, visited, recorridodfs);
        }
    }

}
