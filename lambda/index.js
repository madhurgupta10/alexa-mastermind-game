"use strict";

var Alexa = require("alexa-sdk");
var SKILL_NAME = "Mastermind Game";
var APP_ID = undefined;

exports.handler = function(event, context, callback){
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
}

var myList = ["red", "yellow", "blue", "orange", "purple", "white", "black", "green"];

var secretPatternList = [
        myList[Math.floor(Math.random()* myList.length)],
        myList[Math.floor(Math.random()* myList.length)],
        myList[Math.floor(Math.random()* myList.length)],
        myList[Math.floor(Math.random()* myList.length)]
    ];

console.log(secretPatternList);

var count = 0;
var trueAnswer = [ 1, 1, 1, 1 ];

// function generatePattern() {
//     var myList = ["red", "yellow", "blue", "orange", "purple", "white", "black", "green"];

//     var secretPatternList = [
//             myList[Math.floor(Math.random()* myList.length)],
//             myList[Math.floor(Math.random()* myList.length)],
//             myList[Math.floor(Math.random()* myList.length)],
//             myList[Math.floor(Math.random()* myList.length)]
//         ];

//     console.log(secretPatternList);

//     var count = 0;
//     var trueAnswer = [ 1, 1, 1, 1 ];
// }
var handlers = {
    'LaunchRequest': function() {
        this.emit('startGameIntent');
    },

    'startGameIntent': function() {
        console.log(secretPatternList);   
        // generatePattern();
        var reprompt = "Try saying 4 colors like red, yellow, blue, red,";
        this.emit(':ask', "Hi Welcome to this game of mastermind. If you dont know about the rules of this game just say, Help and I will help you out with rules. Lets get started. Tell me your first pattern", reprompt);
    },

    'userAnswerIntent': function() {
        this.attributes['COLORONE'] = this.event.request.intent.slots.COLORONE.value;
            this.attributes['COLORTWO'] = this.event.request.intent.slots.COLORTWO.value;    
            this.attributes['COLORTHREE'] = this.event.request.intent.slots.COLORTHREE.value;
            this.attributes['COLORFOUR'] = this.event.request.intent.slots.COLORFOUR.value;

            var userAnswer = (
                this.attributes['COLORONE']
                +" "+
                this.attributes['COLORTWO']
                +" "+
                this.attributes['COLORTHREE']
                +" "+
                this.attributes['COLORFOUR']
            );

            var userAnswerList = userAnswer.split(" ");
            var sp = mine(userAnswerList);
            //this.response.speak(""+sp).listen("think of a new pattern and try again");
            this.emit(":ask", sp[0], sp[1]);
            //this.emit(':responseReady');
    },

    'AMAZON.HelpIntent': function() {
        var speechOutput = "In the game of mastermind you need to guess my four color secret pattern by saying any four color names from red, yellow, green, blue, orange, purple, white and black. Please note that there can be identical colors in the pattern. For each of your four responses I will tell you a number which is either zero or one, where one means your response is correct at the correct position and zero which means your response is in correct. For example if the secret pattern is red, yellow, blue, red, and you say red, white, blue, red, I will say 1, 0, 1, 1,. The goal here is to minimize the number of trials to guess the correct pattern. If you are playing for the first time then grabbing a pen and a paper will be handy.";
        var reprompt = "Try saying 4 colors like red, yellow, blue, red,";
        this.emit(":ask", speechOutput, reprompt);
        
    },

    'AMAZON.StopIntent': function() {
        this.emit(':tell', "Thanks for playing, GoodBye!");
        
    },
    'AMAZON.CancelIntent': function() {
        this.emit(':tell', "Thanks for playing, GoodBye!");

    }

}

function mine(userAnswerList) {
    var ans = [ 0, 0, 0, 0 ];
    console.log(userAnswerList);

// for (var j = 0; j < myList.length; j++) {
//     if (myList.indexOf(userAnswerList[j]) < 0) {
//         var negative = true;
//         break;
//     }
//     else {
//         var negative = false;
//     }
// }

//try {
    for (var i = 0; i < 4; i++) {
        if (secretPatternList[i] == userAnswerList[i]) {
            ans[i] = 1;
        }
    }
    var ansString = ""+ans[0]+", "+ans[1]+", "+ans[2]+", "+ans[3];
    console.log(ans);
    if (String(ans) == String(trueAnswer)) {
        var answerResponse = "You got it, your number of trials to guess the correct pattern are "+count+". To play again say, start game, or, exit to stop game.";
        var reprompt = "Try saying start game, to play again"
        count = 0;
        secretPatternList = [
        myList[Math.floor(Math.random()* myList.length)],
        myList[Math.floor(Math.random()* myList.length)],
        myList[Math.floor(Math.random()* myList.length)],
        myList[Math.floor(Math.random()* myList.length)]
    ];
    }
    else {
        var answerResponse = ansString+". try again";
        var reprompt = "Try saying 4 colors like red, yellow, blue, red,";
    }
    count++;
    return [answerResponse, reprompt];
// }
// finally {
//     return "Your response is invalid, please try choosing four colors from names from red, yellow, green, blue, orange, purple, white and black."
// }
}