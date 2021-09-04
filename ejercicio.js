// La imagen que tienen que modificar viene en el parámetro image y contiene inicialmente los datos originales
// es objeto del tipo ImageData ( más info acá https://mzl.la/3rETTC6  )
// Factor indica la cantidad de intensidades permitidas (sin contar el 0)




function arrayToPixels(arr, width, height) {
    let res = []
    let index = 0
    for(let i = 0; i < height; i++) {
        row = []
        for(let j = 0; j < width; j++) {
            row.push({
                r: arr[index],
                g: arr[index+1],
                b: arr[index+2],
                a: arr[index+3]
            })
            index+=4
        }
        res.push(row)
    }
    return res
}

function pixelsToArray(pixels, arr) {
    index = 0;
    for(let i = 0; i < pixels.length; i++){
        for(let j = 0; j < pixels[i].length; j++){
            rgba = pixels[i][j];
            arr[index] = rgba.r;
            arr[index+1] = rgba.g;
            arr[index+2] = rgba.b;
            arr[index+3] = rgba.a;
            index+=4;
        }
    }
}

function findColorInPalette(c, factor) {  
    return Math.round(factor*c / 255) * 255 / factor;
}

function findClosestPixel(pixel, factor) {
    newPixel = {};
    newPixel.r = findColorInPalette(pixel.r , factor);
    newPixel.g = findColorInPalette(pixel.g , factor);
    newPixel.b = findColorInPalette(pixel.b , factor);
    newPixel.a = findColorInPalette(pixel.a , factor);
    return newPixel;
}

function substractPixels(pixelA, pixelB) {
    return {
        r: pixelA.r - pixelB.r,
        g: pixelA.g - pixelB.g,
        b: pixelA.b - pixelB.b,
        a: pixelA.a - pixelB.a,
    };
}

function addPixels(pixelA, pixelB) {
    return {
        r: Math.min(Math.max(pixelA.r + pixelB.r, 0), 255),
        g: Math.min(Math.max(pixelA.g + pixelB.g, 0), 255),
        b: Math.min(Math.max(pixelA.b + pixelB.b, 0), 255),
        a: Math.min(Math.max(pixelA.a + pixelB.a, 0), 255),
    };
}

function multiplyPixel(pixel, factor) {
    return {
        r: pixel.r * factor,
        g: pixel.g * factor,
        b: pixel.b * factor,
        a: pixel.a,
    }
}

function getPixel(pixels, x, y, width) {
    return pixels[y * width + x];
}

function floyd(pixels, image, factor) {
    for(let i = 0; i < image.height; i++) {
        for(let j = 0; j < image.width; j++) {
            oldPixel = pixels[i][j];
            newPixel = findClosestPixel(oldPixel, factor);
            quantError = substractPixels(oldPixel, newPixel);
            //[- * 7]
            //[3 5 1]
            if(0 < j && j < (image.width-1) && i < (image.height-1)) {
                pixels[i][j+1]   = addPixels(pixels[i][j+1], multiplyPixel(quantError, 7/16));
                pixels[i+1][j-1] = addPixels(pixels[i+1][j-1], multiplyPixel(quantError, 3/16));
                pixels[i+1][j]   = addPixels(pixels[i+1][j], multiplyPixel(quantError, 5/16));
                pixels[i+1][j+1] = addPixels(pixels[i+1][j+1], multiplyPixel(quantError, 1/16));
            }
            
            pixels[i][j] = newPixel;
        }
    }
}

function dither(image, factor)
{
    pixels = arrayToPixels(image.data, image.width, image.height);

    floyd(pixels, image, factor)

    console.log("matrix", pixels);

    console.log(pixelsToArray(pixels, image.data));
}

// Imágenes a restar (imageA y imageB) y el retorno en result
function substraction(imageA, imageB, result) 
{
    for(let i = 0;i < imageA.data.length;i++){
        if(i%4==3)
            result.data[i] = 255;
        else
            result.data[i] = imageA.data[i] - imageB.data[i]
    }
}