import {Grafo} from "./grafo.js";


export class Ejecutador {

    constructor() {
        this.maxLine = 0;
        this.maxPosition = 0;
        this.closeRoad = [];
        this.openRoad = [];
        this.visited = [];
        this.returned = false;
        this.result = "NO";
        this.pasos = 0;
    }

    getPosition(line, column) {
        let posLine = line * this.maxPosition;
        return (posLine > 0 ? posLine : 0) + column + 1;
    }

    getEdge(grid, grafo) {
        let hasMoreMove = true;

        for (let i = 0; i < this.maxLine; i++) {
            for (let j = 0; j < this.maxPosition; j++) {
                let next = this.nextStep(grid, i, j)
            }
        }

        for (let i = 0; i < this.openRoad.length; i++) {
            if (this.openRoad[i].nextPosition === null) {
                continue;
            }
            let postOrigen = this.getPosition(this.openRoad[i].currentLine, this.openRoad[i].currentColumn);
            for (let j = 0; j < this.openRoad[i].nextPosition.length; j++) {
                let postDestino = this.getPosition(this.openRoad[i].nextPosition[j].line, this.openRoad[i].nextPosition[j].column);
                grafo.addEdge(postOrigen, postDestino);
            }
        }
    }

    nextStep(grid, line, column) {
        let canMove = this.nextPosition(grid, line, column);

        if (canMove.isFinished) {
            this.openRoad.push(canMove);
        } else if (canMove.isBlocked || !canMove.hasMoreMove) {
            this.closeRoad.push(canMove);
        } else {
            this.openRoad.push(canMove)
        }

        this.visited.push({line: line, column: column});
        return canMove;
    }

    nextPosition(grid, linePosition, currentPosition) {
        let canMove = {
            currentLine: linePosition,
            currentColumn: currentPosition,
            nextPosition: [],
            left: false,
            right: false,
            top: false,
            bottom: false,
            isBlocked: false,
            hasMoreMove: true,
            isFinished: false
        };

        if (grid[linePosition][currentPosition] === '#') {
            canMove.isBlocked = true;
            canMove.nextPosition = null;
        }

        if (linePosition === this.maxLine - 1 && currentPosition === this.maxPosition - 1) {
            canMove.nextPosition = null;
            canMove.isFinished = true;

            return canMove;
        }

        canMove.right = this.canMoveRight(grid, linePosition, currentPosition);
        canMove.bottom = this.canMoveBottom(grid, linePosition, currentPosition);
        canMove.left = this.canMoveLeft(grid, linePosition, currentPosition);
        canMove.top = this.canMoveTop(grid, linePosition, currentPosition);

        if (!canMove.left && !canMove.right && !canMove.top && !canMove.bottom) {
            canMove.hasMoreMove = false;
            canMove.nextPosition = null;
        } else {
            if (canMove.nextPosition === null) {
                canMove.nextPosition = [];
            }

            if (canMove.right) {
                canMove.nextPosition.push({line: linePosition, column: currentPosition + 1});
            }

            if (canMove.bottom) {
                canMove.nextPosition.push({line: linePosition + 1, column: currentPosition});
            }
        }
        return canMove;
    }

    canMoveBottom(grid, linePosition, currentPosition) {
        const nextLinePosition = linePosition + 1;
        const row = grid[nextLinePosition];

        if (this.nextCellIsLocked(nextLinePosition, currentPosition) || this.isVisited(grid, nextLinePosition, currentPosition)) {
            return false
        }

        if (nextLinePosition === this.maxLine) {
            return false;
        }

        return row[currentPosition] === '.';
    }

    canMoveTop(grid, linePosition, currentPosition) {
        if (linePosition === 0) {
            return false;
        }

        if (this.nextCellIsLocked(linePosition - 1, currentPosition) || this.isVisited(grid, linePosition - 1, currentPosition)) {
            return false
        }

        const row = grid[linePosition - 1];

        if (row[currentPosition] === '.') {
            return true;
        }

        return false;
    }

    canMoveLeft(grid, linePosition, currentPosition) {
        const row = grid[linePosition];

        if (currentPosition === 0) {
            return false;
        }

        if (this.nextCellIsLocked(linePosition, currentPosition - 1) || this.isVisited(grid, linePosition, currentPosition - 1)) {
            return false
        }

        if (row[currentPosition - 1] === '.') {
            return true;
        }

        return false;
    }

    canMoveRight(grid, linePosition, currentPosition) {
        const row = grid[linePosition]
        let nextColumn = currentPosition + 1

        if (this.nextCellIsLocked(row, nextColumn) || this.isVisited(grid, linePosition, currentPosition)) {
            return false
        }

        return row[nextColumn] === '.';
    }

    nextCellIsLocked(line, column) {

        if (this.closeRoad === undefined) {
            return false;
        }

        if (this.closeRoad.length === 0) {
            return false;
        }

        let locked = this.closeRoad.filter(o => {
            return o !== undefined && o.currentLine === line && o.currentColumn === column;
        });

        return locked.length > 0;
    }

    backForward(grid) {
        this.closeRoad.push(this.openRoad[this.openRoad.length - 1])
        this.visited = [];
        this.openRoad = [];
        this.returned = true;
    }

    reachTheEnd(grid, maxtime) {
        this.maxPosition = grid[0].length;
        this.maxLine = grid.length;

        let vertex = this.maxPosition * this.maxLine;
        let grafo = new Grafo(vertex);

        for (let i = 1; i < vertex; i++) {
            grafo.addVertex(i);
        }

        this.getEdge(grid, grafo);

        grafo.printGraph();

        var caminoValidoBFS = false;
        var caminoValidoDFS = false;

        let recorridobfs = grafo.bfs(1);
        let recorridodfs = grafo.dfs(1);

        console.log("recorridobfs");
        console.log(recorridobfs);
        console.log(vertex);

        if (recorridobfs.includes(vertex)) {
            this.pasos = 0;
            for (let i = 1; i < recorridodfs.length; i++) {
                if (recorridodfs[i] !== vertex) {
                    this.pasos++;
                } else {
                    this.pasos++;
                    break;
                }
            }
            if (this.pasos <= maxtime)
                caminoValidoDFS = true;
        }

        recorridodfs = grafo.dfs(1);
        if (recorridodfs.includes(vertex)) {
            this.pasos = 0;
            for (let i = 1; i < recorridodfs.length; i++) {
                if (recorridodfs[i] !== vertex) {
                    this.pasos++;
                } else {
                    this.pasos++;
                    break;
                }
            }
            if (this.pasos <= maxtime)
                caminoValidoDFS = true;
        }

        if (caminoValidoBFS || caminoValidoDFS) {
            console.log("Yes");
            this.result = "Yes";
        } else {
            console.log("No");
            this.result = "No";
        }

        return this.result;
    }

    isVisited(grid, line, column) {
        if (this.visited.length === 0) {
            return false;
        }
        let filter = this.visited.filter(o => o.line === line && o.column === column);

        if (line === 0 && column === 0) {
            return true;
        }

        return filter.length > 0;
    }

}
