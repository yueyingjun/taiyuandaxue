window.onload=function (ev) {

    /*
    * 49
    * */

    var hash={
        49:{
            div:0,sound:400+400*(1/8)
        },
        50:{
            div:1,sound:400+400*(2/8)
        },
        51:{
            div:2,sound:400+400*(3/8)
        },
        52:{
            div:3,sound:400+400*(4/8)
        },
        53:{
            div:4,sound:400+400*(5/8)
        },
        54:{
            div:5,sound:400+400*(6/8)
        },
        55:{
            div:6,sound:400+400*(7/8)
        },
        56:{
            div:7,sound:400+400*(8/8)
        }
    }


    var keys=document.querySelectorAll(".key");

    var  audio=new AudioContext();
    var ao;
    var flag=true;
    document.onkeydown=function (e) {
        if(!flag){
            return;
        }
        flag=false;
        ao=audio.createOscillator();
        var as=audio.createAnalyser();
        var gain=audio.createGain();
        ao.connect(as);
        ao.connect(gain);
        gain.connect(audio.destination);
        ao.frequency.setValueAtTime(hash[e.keyCode].sound,audio.currentTime);
        ao.start(audio.currentTime);
        keys[hash[e.keyCode].div].style.boxShadow="0 0 20px #000 inset"
    }
    document.onkeyup=function (e) {
        flag=true;
        ao.stop(audio.currentTime);
        keys[hash[e.keyCode].div].style.boxShadow="none"
    }
}