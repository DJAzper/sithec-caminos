import {Ejecutador} from "./graph/ejecutador.js";

function ejecutar(grid, maxtime) {
    let inputGrid = grid.split(',');
    let time = parseInt(maxtime);
    let newGrid = [];
    for (let i = 0; i < inputGrid.length; i++) {
        newGrid.push(inputGrid[i]);
    }
    console.log(newGrid);
    document.getElementById("result").innerHTML = new Ejecutador().reachTheEnd(inputGrid, time);
}


document.getElementById('btnEjecutar').addEventListener('click', () => {
    let grid = document.getElementById('road').value;
    let maxtime = document.getElementById('maxtime').value;
    ejecutar(grid, maxtime)
});
