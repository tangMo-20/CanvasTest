var canvasBody = document.getElementById("canvas"),
    canvas = canvasBody.getContext("2d"),
    w = canvasBody.width = window.innerWidth * 0.9,
    h = canvasBody.height = window.innerHeight * 0.8,
    color = document.getElementById("color_select"),
    radius = document.getElementById("line_width_select"),
    background = document.getElementById("bg_color_select"),
    filter_select = document.getElementById("filter_select"),
    clean = document.getElementById("clean_bg"),
    save = document.getElementById("save"),
    load = document.getElementById("load"),
    undo = document.getElementById("undo"),
    redo = document.getElementById("redo"),
    load_from_file = document.getElementById("load_from_file"),
    new_color = "black", new_radius = 10, new_bg = "orange", counter = 0,
    masX = [], masY = [], masD = [], masC = [], mas_color = [], mas_radius = [],
    savedX = [], savedY = [], savedC = [], savedD = [];
    
canvas.fillStyle = 'orange';
canvas.fillRect(0, 0, w, h);

function ifBlack(){
    if(new_bg === "black"){
        canvasBody.style.border = "2px solid orange";
        background.style.color = "white";
        background.style.border = "1px solid orange";
    }
    else{
        canvasBody.style.border = "2px solid black";
        background.style.color = "black";
        background.style.border = "1px solid " + new_bg;
    }
}

function paint(){
    canvas.fillStyle = new_bg;
    canvas.fillRect(0, 0, w, h);
    canvasBody.style.border = "2px solid " + new_bg;
    for(var i = 0; i < masX.length; i++){
        canvas.lineWidth = mas_radius[i];
        canvas.strokeStyle = mas_color[i];
        canvas.beginPath();
        canvas.moveTo(masX[i],masY[i]);
        for(var j = 0; j < masC[i].length; j++){
            canvas.lineTo(masC[i][j],masD[i][j]);
        }
        canvas.stroke();
    }
    background.value = new_bg;
    background.style.background = new_bg;
}

undo.onmouseover = function(){
    if(counter === 0){
        undo.style.background = "orange";
    }
    else{
        undo.style.background = "orangered";
    }
};

undo.onmouseout = function(){
    undo.style.background = "orange";
};

redo.onmouseover = function(){
    if(savedD.length === 0){
        redo.style.background = "orange";
    }
    else{
        redo.style.background = "orangered";
    }
};

redo.onmouseout = function(){
    redo.style.background = "orange";
};

radius.oninput = function(){
    new_radius = radius.value;
};
    
color.onchange = function(){
    new_color = color.value;
    color.style.background = new_color;
    if(new_color === "black"){
        color.style.color = "white";
        color.style.border = "1px solid orange";
    }
    else{
        color.style.color = "black";
        color.style.border = "1px solid " + new_color;
    }
};

background.onchange = function(){
    new_bg = background.value;
    background.style.background = new_bg;
    canvas.fillStyle = new_bg;
    canvas.fillRect(0, 0, w, h);
    ifBlack();
};

filter_select.onchange = function(){
    var filter = "";
    filter = filter_select.value;
    canvasBody.style.filter = filter;
};

clean.onmousedown = function(){
    canvas.fillStyle = new_bg;
    canvas.fillRect(0, 0, w, h);
    masX = [];
    masY = [];
    masC = [];
    masD = [];
    mas_color = [];
    mas_radius = [];
    counter = 0;
};

canvasBody.onmousedown = function(e){
    var x, y, c, d, border = window.innerWidth * 0.05;
    x = e.pageX - border;
    y = e.pageY - 15;
    masX.push(x);
    masY.push(y);
    masC[counter] = [];
    masD[counter] = [];
    canvas.lineCap = "round";
    canvas.lineJoin = "round";
    canvas.lineWidth = new_radius;
    canvas.strokeStyle = new_color;
    mas_color.push(new_color);
    mas_radius.push(new_radius);
    canvas.beginPath();
    canvas.moveTo(x,y);
    canvasBody.onmousemove = function(e){
        c = e.pageX - border;
        d = e.pageY - 15;
        masC[counter - 1].push(c);
        masD[counter - 1].push(d);
        canvas.lineTo(c,d); 
        canvas.stroke();
    };
    undo.disabled = false;
    redo.disabled = true;
    savedX.length = 0;
    savedY.length = 0;
    savedC.length = 0;
    savedD.length = 0;
    counter++;
};

canvasBody.onmouseup = function(){
    canvasBody.onmousemove = null;
}﻿

save.onmousedown = function(){
    localStorage.clear();
    localStorage.setItem("X", JSON.stringify(masX));
    localStorage.setItem("Y", JSON.stringify(masY));
    localStorage.setItem("C", JSON.stringify(masC));
    localStorage.setItem("D", JSON.stringify(masD));
    localStorage.setItem("Color", JSON.stringify(mas_color));
    localStorage.setItem("Radius", JSON.stringify(mas_radius));
    localStorage.setItem("Background", new_bg);
};

load.onmousedown = function(){
    masX = JSON.parse(localStorage.getItem("X"));
    masY = JSON.parse(localStorage.getItem("Y"));
    masC = JSON.parse(localStorage.getItem("C"));
    masD = JSON.parse(localStorage.getItem("D"));
    mas_color = JSON.parse(localStorage.getItem("Color"));
    mas_radius = JSON.parse(localStorage.getItem("Radius"));
    new_bg = localStorage.getItem("Background");
    paint();
    ifBlack();
};

undo.onmousedown = function(){
    if(counter === 0){
        undo.style.background = "orange";
        undo.disabled = true;
    }
    else{
        undo.style.background = "orangered";
        savedX.push(masX[masX.length - 1]);
        savedY.push(masY[masY.length - 1]);
        savedC.push(masC[masC.length - 1]);
        savedD.push(masD[masD.length - 1]);
        masX.splice([masX.length - 1], 1);
        masY.splice([masY.length - 1], 1);
        masC.splice([masC.length - 1], 1);
        masD.splice([masD.length - 1], 1);
        paint();
        ifBlack();
        counter--;
        redo.disabled = false;
    }
};

redo.onmousedown = function(){
    if(savedD.length === 0){
        redo.style.background = "orange";
        redo.disabled = true;
    }
    else{
        redo.style.background = "orangered";
        masX.push(savedX[savedX.length - 1]);
        masY.push(savedY[savedY.length - 1]);
        masC.push(savedC[savedC.length - 1]);
        masD.push(savedD[savedD.length - 1]);
        savedX.splice([savedX.length - 1], 1);
        savedY.splice([savedY.length - 1], 1);
        savedC.splice([savedC.length - 1], 1);
        savedD.splice([savedD.length - 1], 1);
        paint();
        ifBlack();
        counter++;
        undo.disabled = false;
    }
};

//load_from_file.oninput = function(){
//    var image = new Image();
//    image.onload = function(){
//        canvas.drawImage(image, 0, 0);
//    };
//    image.src="images/" + load_from_file.value;
//};

//load_from_file.onkeypress = function(e){
//    if(event.keyCode === 13) {
//        //event.preventDefault();
//        return false;
//    }
//};
