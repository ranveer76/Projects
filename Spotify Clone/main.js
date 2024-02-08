console.log("Welcome");
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
    const response = await fetch('http://127.0.0.1:5500/songs');
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
    await getsong();
    for (let i in playlist) {
        if (doesPlaylistHaveSongs(playlist[i][0])) {
            let div = document.createElement("div");
            div.classList.add("list");
            div.id= playlist[i][0];

        }
    }

}

main();


async function getsong() {
    for (let i in playlist) {
        const response = await fetch(`http://127.0.0.1:5500/songs/${playlist[i]}`);
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
