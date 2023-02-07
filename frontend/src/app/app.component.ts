import { Component, OnInit } from '@angular/core';
import { appService } from './app.service';

// interface for all our shapes
export interface IShape{
  x:number;
  y:number;
  width:number;
  height:number;
  fillColor:string;
  strokeColor:string;
  strokeWidth:number;
  type:string;
  is_filled:number;
  shapeID:string;
  order:number;
}

export interface IMachine {
  name : string;
  product : IProduct;
  serviceTime : number;
  prevQueues : IStore[];
  nextQueues : IStore[];
}

export interface IStore {
  products : IProduct[];
  queueID : string;
  size : number;
}

export interface IProduct {
  color : string;
}

//------------------------------------------------------------------//


// array of shapes to hold all the shapes
var shapes:IShape[] = [];

//mapping between shape ID and its area on the canvas
let machineArea = new Map<string, Path2D>();
let queueArea = new Map<string, Path2D>();
let forwardProductionNetwork = new Map<string,string[]>();
let backwardProductionNetwork = new Map<string,string[]>();

//flag to activate buttons
var drawLine : IShape



//flag to activate buttons of creation

var createLineFlag : boolean = false;
var createdLine : boolean = false;

var createMachineFlag : boolean = false;
var createdMachine : boolean = false;

var createQueueFlag : boolean = false;
var createdQueue : boolean = false;

var machineButtonFlag : boolean = false;
var queueButtonFlag : boolean = false;
var lineButtonFlag : boolean = false;

var tempType : string = "";
var machineCounter : number = 0;
var queueCounter : number = 0;

// default shapes properties
var strokeColor:string = 'black';
var strokeWidth:number = 3;

// array for ID generator
var IDsHolder = Array.from(Array(1000).keys());


//function to get new ID everytime
function getNewID():string {
  var ID =   IDsHolder.pop()
  return (ID!.toString())
}






@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'producerConsumerFrontend';

  ngOnInit(): void {
    var q:IShape;
    q={
      x : 50,
      y : 275,
      width : 80,
      height : 40,
      strokeColor : "black",
      fillColor : "aqua",
      type : "queue",
      is_filled : 1,
      strokeWidth : 2,
      shapeID : "Q".concat(getNewID()),
      order:queueCounter
    }
    createdQueue = true;
    this.putElement(q,"")
    queueCounter++;
    shapes.push(q);
    for(let i = 0 ; i<shapes.length ; i++){
          this.putElement(shapes[i],"")
    }
  }

  constructor(private server: appService) {}

  playEvent : any;
  replayEvent : any;
  stopReplay :boolean = false;



    // function to put the shapes on the canvas
    putElement(shape : IShape, colorFill: string){
      var globalMainField = (<HTMLCanvasElement>document.getElementById("mainField"));
      var globalCanvas = globalMainField.getContext("2d")!;
      var x = shape.x;
      var y = shape.y;
      var width = shape.width;
      var height = shape.height;
      var strokeColor = shape.strokeColor;
      var fillColor = shape.fillColor;
      var strokeWidth = shape.strokeWidth;
      var isfilled = shape.is_filled;
      var type = shape.type;
      var ID = shape.shapeID;
      var order = shape.order;

      var area:Path2D|null = new Path2D();
      switch(type){
        case "queue":
          if(colorFill != ""){
            shape.fillColor = colorFill;
            fillColor = colorFill;
          }
          if(isfilled == 1){
            area.rect(x, y, width, height);
            globalCanvas.strokeStyle = strokeColor;
            globalCanvas.fillStyle = fillColor;
            globalCanvas.lineWidth = strokeWidth;
            globalCanvas.beginPath();
            globalCanvas.rect(x, y, width, height);
            globalCanvas.fill()
            globalCanvas.font = "icon";
            globalCanvas.textAlign="center";

            if(ID == "Q999"){
              console.log("first queue created")
              globalCanvas.strokeText("Q0", shape.x + (shape.width/2), shape.y + (shape.height/8) + 8);
            }
            else{
              globalCanvas.strokeText("Q"+(order).toString(), shape.x+(shape.width/2), shape.y+(shape.height/4) + 3);
            }
            globalCanvas.stroke();
          }else{
            area.rect(x, y, width, height);
            globalCanvas.strokeStyle = strokeColor;
            globalCanvas.lineWidth = strokeWidth;
            globalCanvas.beginPath();
            globalCanvas.rect(x, y, width, height);
            globalCanvas.stroke();
          }
          queueArea.set(ID, area);
          area = null;
          break;
        case "machine":
          if(colorFill != ""){
            shape.fillColor = colorFill;
            fillColor = colorFill;
          }
          if(isfilled == 1){
            area.arc(x, y, 0.5*width, 0, 2*Math.PI);
            globalCanvas.beginPath();
            globalCanvas.strokeStyle = strokeColor;
            globalCanvas.lineWidth = strokeWidth;
            globalCanvas.fillStyle = fillColor;
            globalCanvas.arc(x, y, 0.5*width, 0, 2*Math.PI);
            globalCanvas.fill();
            globalCanvas.font = "icon";
            globalCanvas.strokeText("M "+(order).toString(), shape.x-(shape.width/30) + 3, shape.y + 1);
            globalCanvas.textAlign="center";
            globalCanvas.stroke();
          }else{
            area.arc(x, y, 0.5*width, 0, 2*Math.PI);
            globalCanvas.beginPath();
            globalCanvas.strokeStyle = strokeColor;
            globalCanvas.lineWidth = strokeWidth;
            globalCanvas.arc(x, y, 0.5*width, 0, 2*Math.PI);
            globalCanvas.stroke();
          }
          machineArea.set(ID, area);
          area = null;
          break;
        case "line":
          area.moveTo(x, y);
          area.lineTo(width, height);
          area.closePath;
          globalCanvas.beginPath();
          globalCanvas.strokeStyle = strokeColor;
          globalCanvas.lineWidth = strokeWidth;
          globalCanvas.moveTo(x, y);
          globalCanvas.lineTo(width, height);
          globalCanvas.closePath();
          globalCanvas.stroke();
          var angle=Math.PI+Math.atan2(height-y,width-x);
          var angle1=angle+Math.PI/6;
          var angle2=angle-Math.PI/6;
          globalCanvas.beginPath();
          globalCanvas.strokeStyle = strokeColor;
          globalCanvas.lineWidth = strokeWidth;
          globalCanvas.fillStyle = "black"
          globalCanvas.moveTo(width,height);
          globalCanvas.arc(width,height,20,angle1,angle2,true);
          globalCanvas.lineTo(width ,height);
          globalCanvas.fill();
          globalCanvas.closePath();
          break;
      }
    }

  // function to create a queue and it's triggered when the add queue button is clicked
  createQueue(){
    createLineFlag = false;
    createMachineFlag = false;

    createdLine = false;
    createdMachine = false;


    createQueueFlag = true;
    createdQueue = false;


    var mainField = (<HTMLCanvasElement>document.getElementById("mainField"));
    var canvasGlobal = mainField.getContext("2d")!;

    var q : IShape;

    mainField.addEventListener("mousedown",e=>{

      if(!createdQueue && queueButtonFlag){
        q={
          x : e.offsetX,
          y :e.offsetY,
          width : 80,
          height : 40,
          strokeColor : "black",
          fillColor : "aqua",
          type : "queue",
          is_filled : 1,
          strokeWidth : 2,
          shapeID : "Q".concat(getNewID()),
          order:queueCounter
          }
          createQueueFlag =false;
          createdQueue = true;
          this.putElement(q,"");
          shapes.push(q);
          queueCounter++;
        }
    });

    mainField.addEventListener("mouseup",e=>{
      if(queueButtonFlag){
        createdQueue = true;
        createQueueFlag = false;
        q = Object(null);
        document.getElementById("queue")!.style.color = "white"
      }
    });
    if(createQueueFlag){
      document.getElementById("queue")!.style.color = "aqua"
    }
  }

  createMachine() {
    createLineFlag = false; createQueueFlag = false; createdLine = false; createdQueue = false;
    createMachineFlag = true; createdMachine = false;

    var board = (<HTMLCanvasElement>document.getElementById("mainField"));
    var canvas = board.getContext("2d")!;

    var machine: IShape;

    board.addEventListener("mousedown", e => {

      if (!createdMachine && machineButtonFlag) {

        machine = {
          x: e.offsetX,
          y: e.offsetY,
          width: 70,
          height: 70,
          strokeColor: "black",
          type: "machine",
          fillColor: "red",
          is_filled: 1,
          strokeWidth: 2,
          shapeID: "M ".concat(getNewID()),
          order: machineCounter
        }
        createMachineFlag = false;
        createdMachine = true;
        console.log(machine);
        this.putElement(machine,"");
        shapes.push(machine);
        machineCounter++;
      }
    });

    board.addEventListener("mouseup", e => {
      if (machineButtonFlag) {
        createdMachine = true;
        createMachineFlag = false;
        machine = Object(null);
        document.getElementById("machine")!.style.color = "white"
      }

    });
    if (createMachineFlag) {
      document.getElementById("machine")!.style.color = "aqua"
    }
  }


  createLine(){
    createMachineFlag = false;
    createdMachine = false;
    createQueueFlag = false;
    createdQueue = false;
    createdLine = false;
    createLineFlag = true;

    var globalMainField = (<HTMLCanvasElement>document.getElementById("mainField"));
    var globalCanvas = globalMainField.getContext("2d")!;

    var lineSelect = false;
    var fromElement: string;

    globalMainField.addEventListener("mousedown",e=>{
      if(!createdLine &&  lineButtonFlag ){
        for(var shape of shapes){
            if(shape.type == "machine"){
              var temp2DMachineArea : any = machineArea.get(shape.shapeID);
              if(globalCanvas.isPointInPath(temp2DMachineArea ,e.offsetX,e.offsetY)){
                drawLine={
                  x : e.offsetX,
                  y :e.offsetY,
                  width : 0,
                  height : 0,
                  strokeColor : "black",
                  fillColor : "black",
                  type : "line",
                  is_filled : 1,
                  strokeWidth : 0.70,
                  shapeID : getNewID(),
                  order:0
                  }
                  lineSelect = true;
                  createdLine = true
                  tempType = "machine";
                  fromElement = shape.shapeID;

              }
            }else if(shape.type == "queue"){
              var temp2DQueueArea : any = queueArea.get(shape.shapeID);
              if(globalCanvas.isPointInPath( temp2DQueueArea ,e.offsetX,e.offsetY)){
                console.log("inside mouse down event");
                drawLine={
                  x : e.offsetX,
                  y :e.offsetY,
                  width : 0,
                  height : 0,
                  strokeColor : "black",
                  fillColor : "black",
                  type : "line",
                  is_filled : 1,
                  strokeWidth : 0.70,
                  shapeID : getNewID(),
                  order:0
                  }
                  lineSelect = true;
                  createdLine = true
                  tempType = "queue";
                  fromElement = shape.shapeID;

              }
            }
        }
      }
    });
    globalMainField.addEventListener("mousemove", e => {
      if(createLineFlag && lineSelect && (drawLine != null) && lineButtonFlag && createdLine){
        globalCanvas.clearRect(0,0,1380,675);
        drawLine.width = e.offsetX;
        drawLine.height = e.offsetY;

        this.putElement(drawLine, "");
        for(var i = 0; i < shapes.length; i++){
          this.putElement(shapes[i], "");
        }
      }
    });

    globalMainField.addEventListener("mouseup", e => {
      if(lineButtonFlag && fromElement != null){
        for(var shape of shapes){
          switch(tempType.concat(shape.type)){
            //form queue to machine
            case "queuemachine":
              console.log("queue machine line")
              var tempQueueMachine : any = machineArea.get(shape.shapeID);
              if(globalCanvas.isPointInPath(tempQueueMachine,e.offsetX,e.offsetY)){
                console.log("inside the suspicious if ")
                createLineFlag =false;
                createdLine = true;
                lineSelect = false;
                lineButtonFlag = false;

                if(backwardProductionNetwork.has(shape.shapeID)){

                  if(backwardProductionNetwork.get(shape.shapeID)?.indexOf(fromElement) == -1){
                    backwardProductionNetwork.get(shape.shapeID)?.push(fromElement);
                  }
                  else{
                    globalCanvas.clearRect(0,0,1380,675);
                    createLineFlag =false;
                    createdLine = true;
                    lineSelect = false;
                    lineButtonFlag = false;
                    document.getElementById("line")!.style.backgroundColor = "transparent"
                    for(var i = 0; i < shapes.length; i++){
                      this.putElement(shapes[i], "");
                    }
                    break;
                  }
                }else{
                  backwardProductionNetwork.set(shape.shapeID, [fromElement])
                }
                if(drawLine != null && (drawLine.width != 0 && drawLine.height != 0)){

                  this.putElement(drawLine, "");
                  shapes.push(drawLine);
                }
                drawLine = Object(null);
                document.getElementById("line")!.style.backgroundColor = "transparent";


                console.log(backwardProductionNetwork);
                fromElement = Object(null);
              }
              break;

            //from machine to queue
            case "machinequeue":
              console.log("machine queue line")
              var tempMachineQueue : any = queueArea.get(shape.shapeID);
              if(globalCanvas.isPointInPath(tempMachineQueue ,e.offsetX,e.offsetY)){
              console.log("INSIDE CASE 2");

                createLineFlag = false;
                createdLine = true;
                lineSelect = false;
                lineButtonFlag = false;

                if(forwardProductionNetwork.has(fromElement)){
                  //var tempForward : any = forwardProductionNetwork.get(fromElement);
                  if(forwardProductionNetwork.get(fromElement)?.indexOf(shape.shapeID) == -1){
                    forwardProductionNetwork.get(fromElement)?.push(shape.shapeID)
                  }
                  else{
                    globalCanvas.clearRect(0,0,1380,675);
                    createLineFlag =false;
                    createdLine = true;
                    lineSelect = false;
                    lineButtonFlag = false;
                    document.getElementById("line")!.style.color = "white"
                    for(var i = 0; i < shapes.length; i++){
                      this.putElement(shapes[i], "");
                    }
                    break;
                  }
                }else{
                  forwardProductionNetwork.set(fromElement, [shape.shapeID])
                }
                if(drawLine != null && (drawLine.width != 0 && drawLine.height != 0)){
                  this.putElement(drawLine, "");
                  shapes.push(drawLine);
                }
                drawLine = Object(null);
                document.getElementById("line")!.style.color = "white";
                console.log(fromElement);

                fromElement = Object(null);
                console.log("inside line forward:",forwardProductionNetwork);
              }
              break;
            default :
                globalCanvas.clearRect(0,0,1380,675);
                createLineFlag =false;
                createdLine = true;
                lineSelect = false;
                lineButtonFlag = false;
                document.getElementById("line")!.style.color = "white"
                for(var i = 0; i < shapes.length; i++){
                  this.putElement(shapes[i], "");
                }
                break;
            }
          }
        }
        drawLine = Object(null);
        for(var i = 0; i < shapes.length; i++){
          this.putElement(shapes[i], "");
        }
        tempType = "";
    });
    if(createLineFlag){
      document.getElementById("line")!.style.color = "aqua"
    }
  }

  run() {
    var playFlag = true;
    var board = (<HTMLCanvasElement>document.getElementById("mainField"));
    var canvas = board.getContext("2d")!;
    console.log("for",forwardProductionNetwork);
    console.log(forwardProductionNetwork.size)
    console.log("back",backwardProductionNetwork);
    console.log(backwardProductionNetwork.size)
    var tmp: string[][][][] = [];
    tmp.push([]);
    tmp.push([]);
    let c1 = 0;

    forwardProductionNetwork.forEach((key, value) => {
      tmp[0].push([]);
      tmp[0][c1].push([]);
      tmp[0][c1].push([]);
      tmp[0][c1][1] = key;
      tmp[0][c1][0].push(value);
      c1++;
      console.log("Key ", key);
      console.log("value ", value);
    })
    c1 = 0;
    backwardProductionNetwork.forEach((key, value) => {
      tmp[1].push([]);
      tmp[1][c1].push([]);
      tmp[1][c1].push([]);
      tmp[1][c1][1] = key;
      tmp[1][c1][0].push(value);
      c1++;
      console.log("Key ", key);
      console.log("value ", value);
    })

    if (forwardProductionNetwork.size == 0 && backwardProductionNetwork.size == 0) {
      playFlag = false;
    }

    backwardProductionNetwork.forEach((val: string[], key: string) => {
      if (!forwardProductionNetwork.get(key)) {
        playFlag = false;
      }
    });
    forwardProductionNetwork.forEach((val: string[], key: string) => {
      if (!backwardProductionNetwork.get(key)) {
        playFlag = false;
      }
    });

    const convertMap1 = Object.create(null);
    const convertMap2 = Object.create(null);

    if (playFlag) {
      forwardProductionNetwork.forEach((val: string[], key: string) => {
        convertMap1[key] = val;
      });
      backwardProductionNetwork.forEach((val: string[], key: string) => {
        convertMap2[key] = val;
      });
    }
    if (playFlag) {
      this.server.constructNetwork(JSON.stringify(convertMap1)).subscribe((data) => {
        this.server.constructNetwork(JSON.stringify(convertMap2)).subscribe((data) => {
          console.log("response of generate:",data)
          this.server.run().subscribe((data) => {
            console.log("response of run ", data)
            var server = this.server;
            var board = (<HTMLCanvasElement>document.getElementById("mainField"));
            var canvas = board.getContext("2d")!;
            let c2 = 0;
            var machineTimeC = 0;
            this.playEvent = setInterval(function (this: any) {
              machineTimeC++;
              c2++;
              // if (c2 == 1000) {
              //   console.log("1S");
              // }
              server.polling().subscribe((x: Object[]) => {
                //console.log("response of polling ", x);
                if (x != null) {
                  // console.log(x[0]);
                  canvas.clearRect(0,0,1380,675); //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                  let c = 0;

                  var machines: IMachine[] = Object.assign(x[0]);
                  var storeItems: IStore[] = Object.assign(x[1]);
                  console.log(storeItems.length)
                  for (let i = 0; i < machines.length; i++) {
                    var color;
                    try {
                      color = machines[i].product.color;
                    }
                    catch (e) {
                      color = "red"
                    }
                    var machineID = machines[i].name;
                    console.log("machineID :", machineID);
                    var areaMachine: any = machineArea.get(machineID);
                    for (var shape of shapes) {
                      c++;
                      if (shape.shapeID == machineID) {
                        areaMachine?.arc(shape.x, shape.y, 0.5 * shape.width, 0, 2 * Math.PI);
                        canvas.beginPath();
                        canvas.strokeStyle = shape.strokeColor;
                        canvas.lineWidth = shape.strokeWidth;
                        canvas.fillStyle = color;
                        canvas.arc(shape.x, shape.y, 0.5 * shape.width, 0, 2 * Math.PI);
                        canvas.fill();
                        canvas.stroke();
                        canvas.font = "icon";
                        canvas.textAlign = "center";
                        canvas.strokeText("M " + (shape.order).toString(), shape.x - (shape.width / 30) + 2, shape.y);
                        if (color != "red") {
                          // canvas.strokeText("time:"+ (machines[i].serviceTime / 1000).toPrecision(3).toString(), shape.x - (shape.width / 30), shape.y + shape.height - 70);
                          // canvas.font = "50px serif"
                        }
                        else {
                          canvas.strokeText("ready", shape.x - (shape.width / 30) + 2, shape.y + shape.height - 58);
                        }
                        machineArea.set(machineID, areaMachine);
                      }
                    }
                    areaMachine = null;
                  }
                  c = 0;
                  for (let i = 0; i < storeItems.length; i++) {

                    var storeID = storeItems[i].queueID;
                    var areaStore: any = queueArea.get(storeID);

                    console.log(storeID);
                    for (var shape of shapes) {
                      c++;
                      if (shape.shapeID == storeID) {
                        areaStore.rect(shape.x, shape.y, shape.width, shape.height);
                        canvas.strokeStyle = shape.strokeColor;
                        canvas.lineWidth = shape.strokeWidth;
                        canvas.fillStyle = "aqua" //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                        canvas.beginPath();
                        canvas.rect(shape.x, shape.y, shape.width, shape.height)
                        canvas.fill();
                        canvas.stroke();
                        canvas.font = "icon";
                        canvas.textAlign = "center";

                        canvas.strokeText("Q" + (shape.order).toString(), shape.x + (shape.width / 2), shape.y + (shape.height / 8) + 8);

                        canvas.strokeText(storeItems[i].size.toString(), shape.x + (shape.width / 2), shape.y + (shape.height / 2) + 8);

                        queueArea.set(storeID, areaStore);
                      }
                    }
                    areaStore = null;
                  }
                }

                for (var shape of shapes) {
                  if (shape.type == "line") {
                    var lineArea = new Path2D();
                    lineArea.moveTo(shape.x, shape.y);
                    lineArea.lineTo(shape.width, shape.height);
                    lineArea.closePath;
                    canvas.beginPath();
                    canvas.strokeStyle = shape.strokeColor;
                    canvas.lineWidth = shape.strokeWidth;
                    canvas.moveTo(shape.x, shape.y);
                    canvas.lineTo(shape.width, shape.height);
                    canvas.closePath();
                    canvas.stroke();
                    var angle = Math.PI + Math.atan2(shape.height - shape.y, shape.width - shape.x);
                    var angle1 = angle + Math.PI / 6;
                    var angle2 = angle - Math.PI / 6;
                    canvas.beginPath();
                    canvas.strokeStyle = shape.strokeColor;
                    canvas.lineWidth = shape.strokeWidth;
                    canvas.fillStyle = "black"
                    canvas.moveTo(shape.width, shape.height);
                    canvas.arc(shape.width, shape.height, 20, angle1, angle2, true);
                    canvas.lineTo(shape.width, shape.height);
                    canvas.fill();
                    canvas.closePath();
                    lineArea = Object(null);
                  }
                }
              });
            }, 1)
          });
        });
      });
    }
    else {
      console.log("Network is not complete");
      alert("Each Machine Must Be Connected To At Least One Queue at Both Sides");
    }
  }


  replay(){
    clearInterval(this.playEvent);
    var globalMainField = (<HTMLCanvasElement>document.getElementById("mainField"));
    var globalCanvas = globalMainField.getContext("2d")!;
    this.stopReplay = false;

    this.server.replay().subscribe((snapshots : Object[][]) => {
      console.log(snapshots);
      let replayCh = 0;
      this.replayEvent = setInterval(function(){
        if(snapshots[replayCh] != null){
          globalCanvas.clearRect(0,0,1380,675);

          let ch = 0;

          var machines : IMachine[] = Object.assign(snapshots[replayCh][0]);
          var storeItems : IStore[] = Object.assign(snapshots[replayCh][1]);
          console.log(storeItems.length)

          for(let i = 0; i < machines.length; i++){
            var color;
            try{
              color = machines[i].product.color;
            }
            catch(e){
              color = "red"
            }
            var machineID = machines[i].name;
            var areaMachine : any = machineArea.get(machineID);
            for(var shape of shapes){

              ch++;
              if(shape.shapeID == machineID){
                areaMachine.arc(shape.x, shape.y, 0.5*shape.width, 0, 2*Math.PI);
                globalCanvas.beginPath();
                globalCanvas.strokeStyle = shape.strokeColor;
                globalCanvas.lineWidth = shape.strokeWidth;
                globalCanvas.fillStyle = color;
                globalCanvas.arc(shape.x, shape.y, 0.5*shape.width, 0, 2*Math.PI);
                globalCanvas.fill();
                globalCanvas.stroke();
                globalCanvas.font = "icon";
                globalCanvas.textAlign="center";
                globalCanvas.strokeText("M "+(shape.order).toString(), shape.x-(shape.width/30) + 2, shape.y );
                if(color != "red"){
                  //globalCanvas.strokeText("time:"+ (machines[i].serviceTime / 1000).toPrecision(3).toString(), shape.x - (shape.width / 30), shape.y + shape.height - 70);
                }
                else{
                  globalCanvas.strokeText("ready", shape.x-(shape.width/30) + 2, shape.y + shape.height - 58);

                }
                machineArea.set(machineID, areaMachine);
              }
            }

            areaMachine = null;
          }
          ch = 0;
          for(let i = 0; i < storeItems.length; i++){

            var storeID = storeItems[i].queueID;
            var areaStore : any = queueArea.get(storeID);

            console.log(storeID);
            for(var shape of shapes){
              ch++;
              if(shape.shapeID == storeID){
                areaStore.rect(shape.x, shape.y, shape.width, shape.height);
                globalCanvas.strokeStyle = shape.strokeColor;
                globalCanvas.lineWidth = shape.strokeWidth;
                globalCanvas.fillStyle = "aqua"
                globalCanvas.beginPath();
                globalCanvas.rect(shape.x, shape.y, shape.width, shape.height)
                globalCanvas.fill();
                globalCanvas.stroke();
                globalCanvas.font = "icon";
                globalCanvas.textAlign="center";
                globalCanvas.strokeText("Q"+(shape.order).toString(), shape.x+(shape.width/2), shape.y+(shape.height/8) + 8);
                globalCanvas.strokeText(storeItems[i].size.toString(), shape.x+(shape.width/2), shape.y+(shape.height/2)+8);
                queueArea.set(storeID, areaStore);
              }

            }
            areaStore = null;
          }
        }

        for(var shape of shapes){
          if(shape.type == "line"){
            var lineArea = new Path2D();
            lineArea.moveTo(shape.x, shape.y);
            lineArea.lineTo(shape.width, shape.height);
            lineArea.closePath;
            globalCanvas.beginPath();
            globalCanvas.strokeStyle = shape.strokeColor;
            globalCanvas.lineWidth = shape.strokeWidth;
            globalCanvas.moveTo(shape.x, shape.y);
            globalCanvas.lineTo(shape.width, shape.height);
            globalCanvas.closePath();
            globalCanvas.stroke();
            var angle=Math.PI+Math.atan2(shape.height-shape.y,shape.width-shape.x);
            var angle1=angle+Math.PI/6;
            var angle2=angle-Math.PI/6;
            globalCanvas.beginPath();
            globalCanvas.strokeStyle = shape.strokeColor;
            globalCanvas.lineWidth = shape.strokeWidth;
            globalCanvas.fillStyle = "black"
            globalCanvas.moveTo(shape.width,shape.height);
            globalCanvas.arc(shape.width,shape.height,20,angle1,angle2,true);
            globalCanvas.lineTo(shape.width,shape.height);
            globalCanvas.fill();
            globalCanvas.closePath();
            lineArea = Object(null);
          }
        }
        replayCh++;
      }, 1)
    });
  }


  stop(){
    this.server.stop().subscribe((response:string)=>{
      console.log(response);
      clearInterval(this.playEvent);
      clearInterval(this.replayEvent);
    });
  }

  stopInput(){
    this.server.inputStop().subscribe((response:string)=>{
      console.log(response);
      // clearInterval(this.playEvent);
      // clearInterval(this.replayEvent);
    });
  }

  clearAll(){
    var board = (<HTMLCanvasElement>document.getElementById("mainField"));
    var canvas = board.getContext("2d")!;
    canvas.clearRect(0,0,1355,600);      /////////!!!!!!!!!!!!
    machineArea.clear();
    queueArea.clear();
    shapes = [];
    forwardProductionNetwork.clear();
    backwardProductionNetwork.clear();
    machineCounter = 0;
    queueCounter = 0;
    clearInterval(this.playEvent);
    clearInterval(this.replayEvent);
    this.resetVariables();
    this.ngOnInit();

    // for(var i = 0; i < shapes.length; i++){
    //   this.putElement(shapes[i], "");
    // }
  }
  resetVariables(){
    shapes = [];
    machineArea = new Map<string, Path2D>();
    queueArea = new Map<string, Path2D>();
    forwardProductionNetwork = new Map<string,string[]>();
    backwardProductionNetwork = new Map<string,string[]>()
    createLineFlag = false;
    createdLine = false;
    createMachineFlag = false;
    createdMachine  = false;
    createQueueFlag  = false;
    createdQueue  = false;
    machineButtonFlag  = false;
    queueButtonFlag  = false;
    lineButtonFlag  = false;
    tempType = "";
    machineCounter = 0;
    queueCounter = 0;
    IDsHolder = Array.from(Array(1000).keys());
  }


  restButtons(){
    if(createLineFlag){
      machineButtonFlag = false;
      queueButtonFlag  = false;
      clearInterval(this.playEvent);
      clearInterval(this.replayEvent);
      lineButtonFlag = true;
    }
    if(createMachineFlag){
      queueButtonFlag = false;
      lineButtonFlag = false;
      machineButtonFlag = true;
      clearInterval(this.playEvent);
      clearInterval(this.replayEvent);
      drawLine = Object(null);
    }
    if(createQueueFlag){
      machineButtonFlag  = false;
      lineButtonFlag = false;
      clearInterval(this.playEvent);
      clearInterval(this.replayEvent);
      queueButtonFlag = true;
      drawLine = Object(null);
    }

    if(!createQueueFlag){
      document.getElementById("queue")!.style.color = "white"
    }
    if(!createMachineFlag){
      document.getElementById("machine")!.style.color = "white"
    }
    if(!createLineFlag){
      document.getElementById("line")!.style.color = "white"
    }
  }

}
