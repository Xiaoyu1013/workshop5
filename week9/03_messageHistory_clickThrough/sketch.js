

let dataServer;
let pubKey = "pub-c-6493abc9-741f-4c44-bf53-01fbd9fc494d";
let subKey = "sub-c-2081cae9-8f73-45e7-8644-694fdb95eb79";
let secretKey = "sec-c-YjBmNGI3NmItYTZhOS00ZjcxLWIyNDAtMmFlNjQzYWQ4Njg0";

let channelName = "history";

let you;

//input variables for the form to PubNub

let count = 0;
let historyLength;
let allMessages = [];

function preload() { 

  // logic to create a random UUID
    you = random(0,1000000); 
    console.log(you);
    you = int(you);
    console.log(you);
    you = you.toString();
  
}


function setup() {

    createCanvas(windowWidth, windowHeight);

    dataServer = new PubNub({
      subscribeKey: subKey,
      publishKey: pubKey,
      uuid: you,
      secretKey: secretKey,
      heartbeatInterval: 0,
    });

     // listen for messages coming through the subcription feed on this specific channel. 

    dataServer.subscribe({ channels: [channelName] });
    dataServer.addListener({ message: readIncoming });
   
  
    textAlign(CENTER);
  

    fetchMessages();

}
  
function draw() {
 
  background(255);
  textSize(40);
  text(allMessages[count], windowWidth/2, windowHeight/2);

}

function mousePressed() {

  if (count < historyLength) {
    count++;

  } else {
    count = 0;
  }


}


function fetchMessages() {
console.log("fetching");

  dataServer.fetchMessages(
    {
        channels: [channelName],
        end: '15343325004275466',
        count: 100
    },
    (status, response) => {
     console.log(response.channels.history);
      
      historyLength = response.channels.history.length;

      for (let i = 0; i < historyLength; i++) {
    
        append(allMessages,response.channels.history[i].message.messageText);

    }
    }
  );
   
}

function drawMessages(messageHistory) {

  console.log("in draw messages");

  console.log(messageHistory);
  textSize(80);
  for (let i = 0; i < messageHistory.length; i++) {
    
      console.log(messageHistory[i]);
      text(messageHistory[i].message.messageText, windowWidth/2, 100 * (i+1));

  }

}
  // PubNub logic below
function sendTheMessage() {
  // Send Data to the server to draw it in all other canvases
  dataServer.publish({
    channel: channelName,
    message: {
      messageText: sendText.value()
    },
  });

  sendText.value("");

}

function readIncoming(inMessage) {
  console.log(inMessage);
  fetchMessages();

}
