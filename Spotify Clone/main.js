console.log("Welcome");

const web_name = "http://127.0.0.1:5500/Spotify%20Clone/songs/";

let playlist = {};
function doesPlaylistHaveSongs(playlistName) {
    const mp3Extension = ".mp3";

    if (playlist[playlistName]) {
        const songCount = playlist[playlistName].filter(name => name.endsWith(mp3Extension)).length;

        if (songCount > 0) {
            // console.log(`The playlist "${playlistName}" contains ${songCount} songs.`);
            return true;
        } else {
            // console.log(`The playlist "${playlistName}" does not contain any songs.`);
            return false;
        }
    } else {
        // console.log(`The playlist "${playlistName}" does not exist.`);
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

var currentsong = localStorage.getItem('song');

// function playSong(song) {
//     currentsong = new Audio(song);
//     localStorage.setItem('song', song);
//     currentsong.play();
//     document.getElementById("playpause").src='./images/pause_logo.svg';
// }

async function getplaylist() {
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
}

async function main() {
    playlist = await getplaylist();
    console.log(playlist);
    await getsong();
    let element=document.getElementsByClassName('main')[0];
    for (let i in playlist) {
        if (doesPlaylistHaveSongs(playlist[i][0])) {
            element.innerHTML +=`<h2>${playlist[i][0]}</h2><div class="list" id="${playlist[i][0]}"></div>`;
            let e = document.getElementById(playlist[i][0]);
            for(let j=1;j<playlist[i].length;j++){
                let song_name = playlist[i][j].split(".mp3")[0].split("[")[0];
                let song_desc = playlist[i][j].split("]")[0].split("[")[1];
                // console.log(song_desc);
                e.innerHTML +=`<div class="item" id="${playlist[i][j]}">
                <img src="./songs/${playlist[i][0]}/${song_name.replaceAll(" ","")}.jpg" alt="" />
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

async function getsong() {
    for (let i in playlist) {
        const response = await fetch(web_name+"/"+playlist[i]);
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
}
main();