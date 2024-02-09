// console.log("Welcome");
// const web_name = (window.location.pathname).split("index")[0]+"songs/";
const web_name = "./songs/";
let data;
var currentsong;
var song_name;
var song_desc;
var song_img;
var duration;
var current_time;
var color= "#367ae8";
var playingsong;

data = getlocal();
function getlocal(){
    data = JSON.parse(localStorage.getItem("data"));
    if (data == null) {
        data = {
            "currentsong" : "",
            "songname" : "",
            "songdesc" : "",
            "songimg" : ""
        }
    }
    return data;
}
function setlocal(data){
    localStorage.setItem("data", JSON.stringify(data));
}
function dataset(e){
    currentsong = `./songs/${e.id}`;
    song_name=e.getElementsByTagName("h4")[0].innerHTML;
    song_desc=e.getElementsByTagName("p")[0].innerHTML;
    song_img=e.getElementsByTagName("img")[0].src;
    data = {
        "currentsong" : currentsong,
        "songname" : song_name,
        "songdesc" : song_desc,
        "songimg" : song_img
    }
    setlocal(data);
    playingsong.src = currentsong;
}
let playlist = {};
function doesPlaylistHaveSongs(playlistName) {
    const mp3Extension = ".mp3";

    if (playlist[playlistName]) {
        const songCount = playlist[playlistName].filter(name => name.endsWith(mp3Extension)).length;

        if (songCount > 0) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}
function stm(seconds) {
    if (seconds < 0) {
        return "Invalid input";
    }

    const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
    const remainingSeconds = String(Math.floor(seconds % 60)).padStart(2, '0');

    return `${minutes}:${remainingSeconds}`;
}
currentsong = data['currentsong'];
song_name = data['songname'];
song_desc = data['songdesc'];
song_img = data['songimg'];

async function getplaylist() {
    try{
        const response = await fetch(web_name);
        const data = await response.text();
        let div = document.createElement('div');
        div.innerHTML = data;
        let playlists = {};
    
        let as = div.getElementsByTagName('a');
        for (let i = 0; i < as.length; i++) {
            let x = (as[i].href).split("/songs/");
            if (x[1] != undefined) {
                let playlistName = x[1].replaceAll("%20", " ");
                if (!playlists[playlistName]) {
                    playlists[playlistName] = [];
                }
                playlists[playlistName].push(as[i].title);
            }
        }
        return playlists;
    } catch (e) {
        console.log(e);
    }
}
async function getsong() {
    try{
        for (let i in playlist) {
            const response = await fetch("./songs/" + playlist[i]);
            const data = await response.text();
            let div = document.createElement('div');
            div.innerHTML = data;
            let as = div.getElementsByTagName('a');
            for (let j = 0; j < as.length; j++) {
                let x = as[j].title;
                if (x.endsWith('.mp3')) {
                    playlist[i].push(x);
                }
            }
        }
    } catch (e){
        console.log(e);
    }
}


function createElement() {
    let element = document.getElementsByClassName('main')[0];
    for (let i in playlist) {
        if (doesPlaylistHaveSongs(playlist[i][0])) {
            element.innerHTML += `<h2>${playlist[i][0]}</h2><div class="list" id="${playlist[i][0]}"></div>`;
            let e = document.getElementById(playlist[i][0]);
            for (let j = 1; j < playlist[i].length; j++) {
                let song_name = playlist[i][j].split(".mp3")[0].split("[")[0];
                let song_desc = playlist[i][j].split("]")[0].split("[")[1];
                // console.log(song_desc);
                e.innerHTML += `<div class="item" id="${playlist[i][0]+'/'+playlist[i][j]}">
            <img src="./songs/${playlist[i][0]}/${song_name.replaceAll(" ", "")}.jpg" alt="" />
            <div class="play">
            <img class="p-2" src="./images/play_logo.svg" alt="" />
            </div>
            <div class="text">
            <h4>${song_name}</h4>
            <p>${song_desc}</p>
            </div>
            </div>`;
                // console.log(playlist[i][j]);
            }
        }
    }
}

function playsong(){
    try{
        playingsong.play();
    } catch (e) {
        console.log(e);
    }
    document.getElementById("playpause").src='./images/pause_logo.svg';
    let e= document.getElementsByClassName("song_info")[0];
    e.getElementsByTagName("img")[0].src = song_img;
    e.getElementsByTagName("h4")[0].innerHTML = song_name;
    e.getElementsByTagName("p")[0].innerHTML = song_desc;
    // console.log(song_name, song_img, song_desc);
}
function pausesong(){
    try{
        playingsong.pause();
    } catch{
        console.log(e);
    }
    document.getElementById("playpause").src='./images/play_logo.svg';
}
function next_play(){
    let a=currentsong.split('/songs/')[1].split('/');
    let index=playlist[a[0]].indexOf(a[1]);
    // console.log(playlist[a[0]].indexOf(a[1]));
    // console.log(playlist);
    if(index+1 <playlist[a[0]].length){
        let e= document.getElementById(a[0]).getElementsByClassName("item")[index];
        dataset(e);
        playingsong.src = currentsong;
        playsong();
    } else{
        let e= document.getElementById(a[0]).getElementsByClassName("item")[0];
        dataset(e);
        playingsong.src = currentsong;
        playsong();
    }

}
function prev_play(){
    let a=currentsong.split('/songs/')[1].split('/');
    let index=playlist[a[0]].indexOf(a[1]) -1;
    if(index-1 >= 0){
        let e= document.getElementById(a[0]).getElementsByClassName("item")[index-1];
        dataset(e);
        playingsong.src = currentsong;
        playsong();
    } else{
        let e= document.getElementById(a[0]).getElementsByClassName("item")[playlist[a[0]].length -2];
        dataset(e);
        playingsong.src = currentsong;
        playsong();
    }
}

function onclickitem(){
    Array.from(document.getElementsByClassName("list")).forEach(element => {
        Array.from(element.getElementsByClassName("item")).forEach(e=>{
            e.addEventListener("click", function (){
                dataset(e);
                playingsong.src = currentsong;
                playsong();
            })
        });
    });
}

async function main() {
    try{
        playlist = await getplaylist();
        // console.log(playlist);
        await getsong();
        createElement();
    } catch(e) {
        console.log(e);
    }

    playingsong = new Audio(currentsong);
    duration = stm(playingsong.duration);
    current_time = stm(playingsong.currentTime);

    // console.log(currentsong);
    onclickitem();
    document.getElementById("playpause").addEventListener("click", function() {
        if (playingsong.paused) {
            playsong();
        } else {
            pausesong();
            // console.log("pause");
        }
    });

    var next = document.getElementById("next");
    var prev = document.getElementById("prev");
    next.addEventListener("click", function() {next_play();});
    prev.addEventListener("click", function() {prev_play();});

    playingsong.addEventListener("loadeddata", () => {
        duration = stm(playingsong.duration);
        current_time = stm(playingsong.currentTime);
        document.getElementById("duration").innerHTML = duration;
        document.getElementById("current_time").innerHTML = current_time;
        let e= document.getElementsByClassName("song_info")[0];
        e.getElementsByTagName("img")[0].src = song_img;
        e.getElementsByTagName("h4")[0].innerHTML = song_name;
        e.getElementsByTagName("p")[0].innerHTML = song_desc;
    });
    playingsong.addEventListener("timeupdate", () => {
        duration = playingsong.duration;
        current_time = playingsong.currentTime;
        document.getElementById("duration").innerHTML = stm(duration);
        let e= document.getElementById("play-bar");
        document.getElementById("current_time").innerHTML = stm(current_time);
        let perc=(current_time/duration) *100;
        e.value=parseFloat(perc);
        e.style.background= `linear-gradient(to right,${color} 0%, ${color} ${perc}%, #ffffffba ${perc}%,#ffffffba 100%)`;
        e.onmouseover = ()=>{
            color= "#18b459";
        };
        e.onmouseout = ()=>{
            color= "#367ae8";
        };
        if(current_time >= duration){
            next_play();
        }
    });

    var e= document.getElementById("play-bar");
    e.addEventListener("input", ()=>{
        let perc=e.value/100*duration;
        if(isFinite(perc)){
            playingsong.currentTime = (perc);
        }
        playsong();
    });
}


main();