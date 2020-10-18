var maxOccupance=0.5
function reset(){
if(document.getElementById("d3").checked){//custom
	custom[0]=document.getElementById("hight").value
	custom[1]=document.getElementById("width").value
	custom[2]=document.getElementById("mines").value
	
	if(custom[0]<1||custom[0]==""||!$.isNumeric(custom[0])){
		custom[0]=1;
	}else{custom[0]=Math.floor(custom[0]);}

	if(custom[1]<1||custom[1]==""||!jQuery.isNumeric(custom[1])){
		custom[1]=1;
	}else{custom[1]=Math.floor(custom[1]);}

	if(custom[2]<0||custom[2]==""||!jQuery.isNumeric(custom[2])){
		custom[2]=0;
	}else{custom[2]=Math.floor(custom[2]);}

	if(custom[2]/(custom[0]*custom[1])>maxOccupance){
		custom[2]=Math.floor(custom[0]*custom[1]*maxOccupance);
	}

	if(custom[0]*custom[1]-custom[2]<9){
		custom[2]=custom[0]*custom[1]-9;
	}

	if(custom[2]<0){
		custom[2]=0;
	}
	document.getElementById("hight").value=custom[0]
	document.getElementById("width").value=custom[1]
	document.getElementById("mines").value=custom[2]
	difficulty[3]=custom
	setDifficulty(difficulty[3])
}else{//preset
	for(let X=0;X<3;X++){
		if(document.getElementById("d"+X).checked){
			setDifficulty(difficulty[X])
			
		}
	}
}
	makeBoard();
	gen();
	first=1;
}


//shuffle array
function shuffle(arra1) {
    var ctr = arra1.length, temp, index;
    while (ctr > 0) {
        index = Math.floor(Math.random() * ctr);
        ctr--;
        temp = arra1[ctr];
        arra1[ctr] = arra1[index];
        arra1[index] = temp;
    }
    return arra1;
}

function flagClick(x,y,b){
if(seen[x][y]==0){
	if(flag[x][y]==0){
		flag[x][y]=1
		document.getElementById(b).innerHTML ="<img src=\"flag.png\">";
	}else{
		flag[x][y]=0
		document.getElementById(b).innerHTML ="<img src=\"idk.png\">";
	}
}
}
//on button click
function clickFun(x,y,b){
if(seen[x][y]==0){
if(flag[x][y]==1){
return;
}
if(first==1){
first=0;
while(near(x,y)!=0){
gen()
}
}
if(grid[x][y]==1){//mine
	loose(b)
}else{//empty
	explore(x,y)
	checkWin();
}
}
}

function loose(b){
	let count=50
	document.getElementById(b).innerHTML ="<img src=\"dead.png\">";
	for(let X=0;X<width;X++){
	for(let Y=0;Y<hight;Y++){
	seen[X][Y]=1
	
	if(grid[X][Y]==1){
		if(flag[X][Y]==0){
			if(toid(X,Y)!=b){
				document.getElementById(toid(X,Y)).innerHTML ="<img src=\"mine.png\">";
count++;
			}
		}
	}else if(flag[X][Y]==1){
		document.getElementById(toid(X,Y)).innerHTML ="<img src=\"wrong.png\">";
count++;
	}
	}
	}
	setTimeout(function () { alert("You Loose!");}, count*2);
}

function checkWin(){
for(let X=0;X<width;X++){
for(let Y=0;Y<hight;Y++){
	if(seen[X][Y]==1){
		if(grid[X][Y]==1){
			return;
		}
	}else if(grid[X][Y]==0){
		return;
	}
}
}
win()
}

function win(){
let count=50;
for(let X=0;X<width;X++){
for(let Y=0;Y<hight;Y++){
	seen[X][Y]=1
	if(grid[X][Y]==1){
		document.getElementById(toid(X,Y)).innerHTML ="<img src=\"flag.png\">";
count++;
	}
}
}
setTimeout(function () { alert("You Won!");}, count*2);
}

function safe(x,y){
if(x>=width){
return 0
}
if(x<0){
return 0
}
if(y>=hight){
return 0
}
if(y<0){
return 0
}
return 1;
}

function near(x,y){
	let count=0;
	for(let X=-1;X<=1;X++){
	for(let Y=-1;Y<=1;Y++){
if(safe(x+X,y+Y)==1){
		count+=grid[x+X][y+Y];
}
	}
	}
	return count;
}

function explore(x,y){
	if(seen[x][y]==0){
		let n=near(x,y);
		document.getElementById(toid(x,y)).innerHTML ="<img src=\""+n+".png\">";
		seen[x][y]=1;
		if(n==0){
		for(let X=-1;X<=1;X++){
		for(let Y=-1;Y<=1;Y++){
if(safe(x+X,y+Y)==1){
			explore(x+X,y+Y);
}
		}
		}
		}
	}
}

function toid(x,y){
	return y*width+x;
}

function gen(){
let rand=new Array()
for(let c=0;c<mines;c++){
	rand.push(1);
}



for(let c=mines;c<hight*width;c++){
	rand.push(0);
}

rand=shuffle(rand);

let seen1=new Array();
let flag1=new Array();
for(let c=0;c<hight*width;c++){
	seen1.push(0);
	flag1.push(0);
}

grid=new Array();
seen=new Array();
flag=new Array();
for(x=0;x<width;x++){
	grid.push(rand.slice(x*hight,(x+1)*hight));
	seen.push(seen1.slice(x*hight,(x+1)*hight));
	flag.push(flag1.slice(x*hight,(x+1)*hight));
}
}
//game init
var hight=16;
var width=30;
var mines=99;
var first=1;


var easy=[9,9,10]
var intermediate=[16,16,40]
var expert=[16,30,99]
var custom=[32,64,384]
var difficulty=[easy,intermediate,expert,custom]

function setDifficulty(parIn){
	hight=parIn[0];
	width=parIn[1];
	mines=parIn[2];
}
var defaultDiff=0
setDifficulty(difficulty[defaultDiff]);
gen()

function makeBoard(){
//board display init
let b=""

let state= "<table>";
for(let y=0;y<hight;y++){
	state+="<tr>";
	for(let x=0;x<width;x++){
		b=toid(x,y);
		state+="<td>";
		state+="<button type=\"button\" id=\""+b+"\" onclick=\"clickFun("+x+","+y+","+b+")\" oncontextmenu = \"flagClick("+x+","+y+","+b+");return false;\" >";
		state+="<img src=\"idk.png\">";
		state+="<//button>";
		state+="<//td>";
	}
	state+="<//tr>";
}
state+="<//table>";
document.getElementById("game").innerHTML = state
}
makeBoard();
var menu="";
menu+="<table>"
menu+="<tr>"
menu+="<th>Select</th><th>Difficulty</th><th>Hight</th><th>Width</th><th>Mines</th>"
menu+="</tr><tr>"
menu+="<td><input type=\"radio\" name=\"menu\" id=\"d0\" value=0 checked></td><td>Easy<td>9</td><td>9</td><td>10</td>"
menu+="</tr><tr>"
menu+="<td><input type=\"radio\" name=\"menu\" id=\"d1\" value=1></td><td>Intermediate<td>16</td><td>16</td><td>40</td>"
menu+="</tr><tr>"
menu+="<td><input type=\"radio\" name=\"menu\" id=\"d2\" value=2></td><td>Expert<td>16</td><td>30</td><td>99</td>"
menu+="</tr><tr>"
menu+="<td><input type=\"radio\" name=\"menu\" id=\"d3\" value=3></td><td>Custom</td>"
menu+="<td><textarea id=\"hight\" rows=\"1\" cols=\"4\">"+custom[0]+"</textarea></td>"
menu+="<td><textarea id=\"width\" rows=\"1\" cols=\"4\">"+custom[1]+"</textarea></td>"
menu+="<td><textarea id=\"mines\" rows=\"1\" cols=\"4\">"+custom[2]+"</textarea></td>"
menu+="</tr>"
menu+="</table>"
menu+="<button type=\"button\" onclick=\"reset()\" style=\"margin: 0px;margin-bottom: -20px; padding-left:20px; padding-right:20px; border:solid\"><h2>Start New Game<//h2><//button>";
document.getElementById("out").innerHTML =menu

