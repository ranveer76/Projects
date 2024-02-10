// console.log("Welcome");
// const web_name = (window.location.pathname).split("index")[0]+"songs/";
const web_name = "./songs/";
let playlist = {};

//edited
let data;
var currentsong;
var song_name;
var song_desc;
var song_img;
var duration;
var current_time;
var perc = 0;
var color = "#367ae8";
var playingsong;

data = getlocal();
function getlocal() {
    data = JSON.parse(localStorage.getItem("data"));
    if (data == null) {
        data = {
            "currentsong": "",
            "songname": "",
            "songdesc": "",
        }
    }
    return data;
}
function setlocal(data) {
    localStorage.setItem("data", JSON.stringify(data));
}
async function dataset(e) {
    currentsong = e.id;
    song_name = e.getElementsByTagName("h4")[0].innerHTML;
    song_desc = e.getElementsByTagName("p")[0].innerHTML;
    song_img = await getImageUrl(currentsong.split("/")[0], song_name.replaceAll(" ", "") + ".jpg");
    data = {
        "currentsong": currentsong,
        "songname": song_name,
        "songdesc": song_desc,
    }
    setlocal(data);
}
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

async function getplaylist() {
    try {
        const response = await fetch('http://localhost:3000/api/playlists'); // Fetch from the server endpoint
        const playlists = await response.json();
        var playlist = {};
        for (const i of playlists) {
            playlist[i] = await getSongsInPlaylist(i);
        }
        return playlist;
    } catch (e) {
        console.log(e);
    }
}

async function getSongsInPlaylist(playlistName) {
    try {
        const response = await fetch(`http://localhost:3000/api/playlist/${playlistName}`);
        const songs = await response.json();
        let song = [];
        for (const i of songs) {
            if (i.endsWith(".mp3")) {
                song.push(i);
            }
        }
        return song;
    } catch (e) {
        console.log(e);
        return [];
    }
}

async function createElement() {
    let element = document.getElementsByClassName('main')[0];
    for (let i in playlist) {
        if (doesPlaylistHaveSongs(i)) {
            element.innerHTML += `<h2>${i}</h2><div class="list" id="${i}"></div>`;
            let e = document.getElementById(i);
            for (let j = 0; j < playlist[i].length; j++) {
                let song_name = playlist[i][j].split("[")[0];
                let song_desc = playlist[i][j].split("]")[0].split("[")[1];
                // console.log(song_desc);
                e.innerHTML += `<div class="item" id="${i + '/' + playlist[i][j]}">
            <img src="${await getImageUrl(i, song_name.replaceAll(" ", "") + ".jpg")}" alt="" />
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
    onclickitem();
    updateDynamicContent();
}
async function getImageUrl(p, songPath) {
    try {
        const response = await fetch(`http://localhost:3000/api/images/${p}/${songPath}`);
        const imageBlob = await response.blob();
        const imageUrl = await URL.createObjectURL(imageBlob);
        return imageUrl;
    } catch (error) {
        console.error('Error fetching image:', error);
    }
}
// Example client-side code
const play_Song = async (playlist) => {
    try {
        // console.log(playlist);
        const response = await fetch(`http://localhost:3000/api/songs/${playlist[0]}/${playlist[1]}`);
        const audioBlob = await response.blob();
        const audioUrl = await URL.createObjectURL(audioBlob);
        return audioUrl;
    } catch (error) {
        console.error('Error playing song:', error);
    }
};

function playsong() {
    try {
        playingsong.play();
    } catch (e) {
        console.log(e);
    }
    document.getElementById("playpause").src = './images/pause_logo.svg';
    let e = document.getElementsByClassName("song_info")[0];
    e.getElementsByTagName("img")[0].src = song_img;
    e.getElementsByTagName("h4")[0].innerHTML = song_name;
    e.getElementsByTagName("p")[0].innerHTML = song_desc;
    // console.log(song_name, song_img, song_desc);
}
function pausesong() {
    try {
        playingsong.pause();
    } catch {
        console.log(e);
    }
    document.getElementById("playpause").src = './images/play_logo.svg';
}
async function next_play() {
    let a = currentsong.split('/');
    let index = playlist[a[0]].indexOf(a[1]);
    // console.log(playlist[a[0]].indexOf(a[1]));
    // console.log(playlist);
    if (index + 1 < playlist[a[0]].length) {
        let e = document.getElementById(a[0]).getElementsByClassName("item")[index + 1];
        dataset(e);
        playingsong.src = await play_Song(currentsong.split("/"));
        playsong();
    } else {
        let e = document.getElementById(a[0]).getElementsByClassName("item")[0];
        dataset(e);
        playingsong.src = await play_Song(currentsong.split("/"));
        playsong();
    }

}
async function prev_play() {
    let a = currentsong.split('/');
    let index = playlist[a[0]].indexOf(a[1]);
    if (index - 1 >= 0) {
        let e = document.getElementById(a[0]).getElementsByClassName("item")[index - 1];
        dataset(e);
        playingsong.src = await play_Song(currentsong.split("/"));
        playsong();
    } else {
        let e = document.getElementById(a[0]).getElementsByClassName("item")[playlist[a[0]].length - 1];
        dataset(e);
        playingsong.src = await play_Song(currentsong.split("/"));
        playsong();
    }
}

function onclickitem() {
    Array.from(document.getElementsByClassName("list")).forEach(element => {
        Array.from(element.getElementsByClassName("item")).forEach(e => {
            // console.log(e);
            e.addEventListener("click", async function () {
                dataset(e);
                playingsong.src = await play_Song(currentsong.split("/"));
                playsong();
            })
        });
    });
}

async function main() {
    try {
        playlist = await getplaylist();
        createElement();
        playingsong = new Audio();
    } catch (e) {
        console.log(e);
    }
    song_img = await getImageUrl(currentsong.split("/")[0], song_name.replaceAll(" ", "") + ".jpg");
    playingsong.src = await play_Song(currentsong.split("/"));
    // playingsong.play();
    duration = stm(playingsong.duration);
    current_time = stm(playingsong.currentTime);

    // console.log(currentsong);
    document.getElementById("playpause").addEventListener("click", function () {
        if (playingsong.paused) {
            playsong();
        } else {
            pausesong();
            // console.log("pause");
        }
    });

    var next = document.getElementById("next");
    var prev = document.getElementById("prev");
    next.addEventListener("click", async function () { await next_play(); });
    prev.addEventListener("click", async function () { await prev_play(); });
    playingsong.addEventListener("loadeddata", () => {
        duration = stm(playingsong.duration);
        current_time = stm(playingsong.currentTime);
        document.getElementById("duration").innerHTML = duration;
        document.getElementById("current_time").innerHTML = current_time;
        let e = document.getElementsByClassName("song_info")[0];
        e.getElementsByTagName("img")[0].src = song_img;
        e.getElementsByTagName("h4")[0].innerHTML = song_name;
        e.getElementsByTagName("p")[0].innerHTML = song_desc;
        updateDynamicContent();
    });
    playingsong.addEventListener("timeupdate", async () => {
        duration = playingsong.duration;
        current_time = playingsong.currentTime;
        document.getElementById("duration").innerHTML = stm(duration);
        let e = document.getElementById("play-bar");
        document.getElementById("current_time").innerHTML = stm(current_time);
        perc = (current_time / duration) * 100;
        e.value = parseFloat(perc);
        e.style.background = `linear-gradient(to right,${color} 0%, ${color} ${perc}%, #ffffffba ${perc}%,#ffffffba 100%)`;
        if (current_time >= duration) {
            await next_play();
        }
    });
    var e = document.getElementById("play-bar");
    e.onmouseover = () => {
        color = "#18b459";
        e.style.background = `linear-gradient(to right,${color} 0%, ${color} ${perc}%, #ffffffba ${perc}%,#ffffffba 100%)`;
    };
    e.onmouseout = () => {
        color = "#367ae8";
        e.style.background = `linear-gradient(to right,${color} 0%, ${color} ${perc}%, #ffffffba ${perc}%,#ffffffba 100%)`;
    };
    var e = document.getElementById("play-bar");
    e.addEventListener("input", () => {
        let perc = e.value / 100 * duration;
        if (isFinite(perc)) {
            playingsong.currentTime = (perc);
        }
        playsong();
    });
}


function updateDynamicContent(callback) {

    const textElements = document.querySelectorAll(".text p");

    textElements.forEach(element => {
        const scrollContainer = element.closest(".text");
        // console.log("Element:", element);
        // console.log("Scroll Width:", element.scrollWidth);
        // console.log("Container Width:", scrollContainer.offsetWidth);
        if (element.scrollWidth > scrollContainer.offsetWidth) {
            element.classList.add("animate");
        } else {
            element.classList.remove("animate");
        }

    });
    const textElement = document.querySelectorAll(".text h4");

    textElement.forEach(element => {
        const scrollContainer = element.closest(".text");
        // console.log("Element:", element);
        // console.log("Scroll Width:", element.scrollWidth);
        // console.log("Container Width:", scrollContainer.offsetWidth);
        if (element.scrollWidth > scrollContainer.offsetWidth) {
            element.classList.add("animate");
        } else {
            element.classList.remove("animate");
        }

    });
}

main();

