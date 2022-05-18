export {};

var jsdom = require("jsdom").jsdom;
var JSDOM = jsdom.JSDOM;
const canvas = <HTMLCanvasElement> document.getElementById('canvas')
var ctx: any =  canvas.getContext('2d');
var reader = new FileReader();
var img = new Image();

const uploadImage = (e) =>{
    reader.onload = () =>{
        img.onload = () =>{
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
        };
        img.src = reader.result.toString();
    };
    reader.readAsDataURL(e.target.files[0]);
};

var imageLoader = document.getElementById('upload');
imageLoader.addEventListener('change', uploadImage)