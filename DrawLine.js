var WINDOW_WIDTH = 1024;
var WINDOW_HEIGHT = 768;
var RADIUS = 4;
var balls = [];
const FPS= 50 ; //帧数=1000/FPS
const SPEED = 40 ; //FPS*SPEED=动画完成时间的毫秒数
const CustomAngle = 30; //曲线的弧度，值越大，弧度越明显

//RGB颜色 
const colors = ["73,190,15"
      ,"15,153,204"  
      ,"170,102,204"
      ,"153,51,204"
      ,"153,204,0"
      ,"102,153,0"
      ,"30,210,56"
      ,"40,15,190"];     

var geoCoord = {
        'addr1': [650,226]
        ,'addr2': [744,251]
        ,'addr3': [690,276]
        ,'addr4': [639,289]
        ,'addr5': [574,268]
        ,'addr6': [520,216]
        ,'addr7': [590,190]
        ,'addr8': [662,182]
        ,'addr9': [730,197]
        ,'addr10': [833,250]
        ,'addr11': [637,352]
        ,'addr12': [769,363]
        ,'addr13': [891,333]
        ,'addr14': [541,435]
        ,'addr15': [489,342]
        ,'addr16': [424,257]
        ,'addr17': [485,156]
        ,'addr18': [609,120]
        ,'addr19': [725,62]
        ,'addr20': [360,121]
        ,'addr21': [367,425]
        ,'addr22': [125,344]
        ,'addr23': [782,220]
        ,'addr24': [809,251]
        ,'addr25': [775,149]
        ,'addr26': [585,241]
};

window.onload = function(){
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext("2d");   
    setInterval(
        function(){
            render( context );
            update();
        },FPS
    );
};


function addBalls( x , y ){
    //x:[num,num],起始点坐标
    //y:[num,num]，结束点坐标
    var colorNum = Math.floor( Math.random()*colors.length );
    var angle = parseInt(Math.atan2(y[1]-x[1],y[0] - x[0])/Math.PI*180);
    var R = .5*Math.sqrt((y[1]-x[1])*(y[1]-x[1]) + (y[0]-x[0])*(y[0]-x[0]));
    var cx = parseInt(.5*(x[0]+y[0])+ R*Math.tan(CustomAngle*Math.PI/180)*Math.sin(angle*Math.PI/180));
    var cy = parseInt(.5*(y[1]+x[1])- R*Math.tan(CustomAngle*Math.PI/180)*Math.cos(angle*Math.PI/180));
    var aBall = {
        startLoc:x, //线的起始位置
        endLoc:y,   //线的结束位置
        ballLoc:x.slice(0),  //球的坐标位置
        t:0,    //球距离线起点的运动参数，值范围[0,1]
        cball:[cx,cy], //Bézier曲线的参照点位置
        LinePath:[],//Bézier曲线的轨迹
        ballColor:colors[colorNum],
        lineColor: colors[colorNum]
    };
    balls.push( aBall );            
}

function updateBalls(){
    //更新动画的位置
    for( var i = 0 ; i < balls.length ; i ++ ){
        if(balls[i].t<1){
            balls[i].t += 0.01;
        }
        var c1x = balls[i].startLoc[0] + (balls[i].cball[0] - balls[i].startLoc[0]) * balls[i].t;
        var c1y = balls[i].startLoc[1] + (balls[i].cball[1] - balls[i].startLoc[1]) * balls[i].t;
        var c2x = balls[i].cball[0] + (balls[i].endLoc[0] - balls[i].cball[0]) * balls[i].t;
        var c2y = balls[i].cball[1] + (balls[i].endLoc[1] - balls[i].cball[1]) * balls[i].t;
        var tx = c1x + (c2x - c1x) * balls[i].t;
        var ty = c1y + (c2y - c1y) * balls[i].t;
        
        balls[i].ballLoc[0] = tx;
        balls[i].ballLoc[1] = ty;
        balls[i].LinePath.push([tx,ty]);

    }

    for( var i = 0 ; i < balls.length ; i ++ )
        if(Math.abs( balls[i].endLoc[0] - balls[i].ballLoc[0])< 1
            && Math.abs(balls[i].endLoc[1] - balls[i].ballLoc[1])< 1)
            balls.splice(i,1);

}

function render( cxt ){
   
    cxt.clearRect(0,0,WINDOW_WIDTH, WINDOW_HEIGHT);
    for( var i = 0 ; i < balls.length ; i ++ ){
        
        cxt.beginPath();
        cxt.moveTo(balls[i].startLoc[0],balls[i].startLoc[1]);
        
        //绘制曲线
        for(var t = 0 ; t < balls[i].LinePath.length ; t ++){
            cxt.lineTo(balls[i].LinePath[t][0], balls[i].LinePath[t][1]);
        }
        cxt.lineWidth=3;
        cxt.strokeStyle="rgb(" + balls[i].lineColor + ")";
        //cxt.closePath();
        cxt.stroke();

        //起始和结束的圆点
        cxt.beginPath();
        cxt.fillStyle="rgb(" + balls[i].ballColor + ")";
        cxt.arc( balls[i].startLoc[0] , balls[i].startLoc[1] , RADIUS-3 , 0 , 2*Math.PI , true );
        cxt.fill();
        cxt.arc( balls[i].endLoc[0] , balls[i].endLoc[1] , RADIUS-3 , 0 , 2*Math.PI , true );
        cxt.closePath();
        cxt.fill();


        //渐变圆
        cxt.beginPath();
        gradient= cxt.createRadialGradient(balls[i].ballLoc[0] , balls[i].ballLoc[1],1,balls[i].ballLoc[0] , balls[i].ballLoc[1],8);
        gradient.addColorStop(0, "rgb(255,255,255)");
        gradient.addColorStop(1, "rgb(" + balls[i].ballColor + ")");
        cxt.arc(balls[i].ballLoc[0] , balls[i].ballLoc[1] , RADIUS, 0, Math.PI * 2, true);
        cxt.fillStyle = gradient;
        cxt.closePath();
        cxt.fill();

    }
    
}

            
function update(){
    updateBalls();
    //console.log( balls.length)
}

$(document).ready(function(){
    addBalls( geoCoord['addr20'] , geoCoord['addr3'] );
    setTimeout(function(){
        addBalls(geoCoord['addr22'], geoCoord['addr16'])
    },500);
    setTimeout(function () {
        addBalls(geoCoord['addr4'], geoCoord['addr14'])
    }, 1500);
    setTimeout(function () {
        addBalls(geoCoord['addr8'], geoCoord['addr18'])
    }, 2500);
    setTimeout(function () {
        addBalls(geoCoord['addr6'], geoCoord['addr13'])
    }, 4500);

});

