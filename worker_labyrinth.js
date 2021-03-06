'use strict';

const zufallErzeugen = (min, max) => ~~(Math.random() * (max - min + 1) + min);

// Noise erzeugen und einen Ausschnitt vergrößern -> Kaestchen
const drawBoxes = (data, width, height) => {

    let magnifier = 30;

    // data ist das Array mit den Bilddaten
    for (let i = 0; i < data.length; i += 4) {
        data[i] = zufallErzeugen(0, 255);
        data[i + 1] = zufallErzeugen(0, 255);
        data[i + 2] = zufallErzeugen(0, 255);
        data[i + 3] = 255;
    }

    let dataCopy = [...data];
    for (let i = 0; i < dataCopy.length; i += 4) {
        // Durch 4 teilen, weil immer vier Farbkanäle den Pixel ausmachen
        let zeile = ~~((i / 4) / width);
        let spalte = (i / 4) % width;

        zeile = ~~(zeile / magnifier);
        spalte = ~~(spalte / magnifier);

        dataCopy[i] = data[((zeile * width) + spalte) * 4];
        dataCopy[i + 1] = data[(((zeile * width) + spalte) * 4) + 1];
        dataCopy[i + 2] = data[(((zeile * width) + spalte) * 4) + 2];
    }

    for (let i = 0; i < dataCopy.length; i += 4) {
        data[i] = dataCopy[i];
        data[i + 1] = dataCopy[i + 1];
        data[i + 2] = dataCopy[i + 2];
    }
}

// Durchschnittswert für umliegende Pixel bestimmen -> Weichzeichnen
const blur = (data, width, height, radius) => {

    let dataCopy = [...data];

    for (let i = 0; i < data.length; i += 4) {
        let zeile = ~~((i / 4) / width);
        let spalte = (i / 4) % width;

        let summe = 0;
        let anzahl = 0;
        for (let x = -radius; x <= radius; x++) {
            for (let y = -radius; y <= radius; y++) {
                if (
                    zeile + x > 0 &&
                    zeile + x < height - 1 &&
                    spalte + y > 0 &&
                    spalte + y < width - 1 &&
                    spalte > 0
                ) {
                    summe += data[(((zeile + y) * width) + (spalte + x)) * 4];
                    anzahl++;
                }
            }
        }
        summe /= anzahl;
        summe = ~~summe;
        dataCopy[((zeile * width) + (spalte)) * 4] = summe;
      
    }
    for (let i = 0; i < dataCopy.length; i += 4) {
        data[i] = dataCopy[i];
        data[i + 1] = dataCopy[i];
        data[i + 2] = dataCopy[i];
    }
}

self.onmessage = msg => {
    let data = msg.data;

    switch (data.befehl) {
        case 'drawBoxes':
            // console.log('Draw Boxes', data.imgData.data.length);
            drawBoxes(data.imgData.data, data.imgData.width, data.imgData.height);
            blur(data.imgData.data, data.imgData.width, data.imgData.height, 10);
            self.postMessage({
                status: 'done',
                imgData: data.imgData
            })
            break;
        default:
            break;
    }


}