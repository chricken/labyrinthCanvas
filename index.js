'use strict';

const cLabyrinth = document.querySelector('#cLabyrinth');
const ctx = cLabyrinth.getContext('2d');


// FUNKTIONEN
const init = () => {

    const workerLabyrinth = new Worker('worker_labyrinth.js');

    let imgData = ctx.getImageData(0, 0, cLabyrinth.width, cLabyrinth.height);
    console.log(imgData);


    workerLabyrinth.postMessage({
        befehl: 'drawBoxes',
        imgData
    })

    workerLabyrinth.onmessage = msg => {
        let data = msg.data;
        if (data.status = 'done') {
            // console.log (data);
            ctx.putImageData(data.imgData, 0, 0);
        } else if ( data.status = 'pending'){
            //console.log(data.step, data.progress);
            
        }

    }

}

init();
