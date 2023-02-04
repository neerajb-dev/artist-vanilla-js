const artists = []
let albums = []
let selectedCard = null
let isEdit = false

let albumData = {
    id: '',
    artistId: '',
    albumName: '',
    albumArt: ''
}

const addAlbumBtn = document.getElementById('add-new-album')

window.addEventListener('DOMContentLoaded', function () {
    fetchArtistsFromLocal()
    fetchAlbumsFromLocal()
})

function clearFields() {
    document.getElementById('select-artist').selectedIndex = 0
    document.getElementById('album-input').value = ''
    document.getElementById('album-art').value = ''
}

function fetchAlbumsFromLocal() {
    const albumsFromLocal = JSON.parse(localStorage.getItem('albums'))
    if (!albums.length) {
        albumsFromLocal && albums.push.apply(albums, albumsFromLocal)
    }
    // console.log(albums)
    albums.forEach(album => generateAlbumCard(album))
}

function getArtistNameFromId(id) {
    let artistName = ''
    return new Promise(function (res, rej) {
        artistName = artists.length && artists.filter(artist => artist.id === id)[0].name
        if (artistName) {
            res(artistName)
        }
    })
}

function fetchArtistsFromLocal() {
    const artistFromLocal = JSON.parse(localStorage.getItem('artists'))
    if (!artists.length) {
        artistFromLocal && artists.push.apply(artists, artistFromLocal)
    }
    artists.forEach(artist => {
        const option = document.createElement('option')
        option.value = artist.id
        option.innerText = artist.name
        document.getElementById('select-artist').appendChild(option)
    })
}

document.getElementById('select-artist').addEventListener('change', function (e) {
    albumData.artistId = e.target.value
    // console.log(albumData)
})

document.getElementById('album-input').addEventListener('input', function (e) {
    albumData.albumName = e.target.value
    // console.log(albumData)
})

document.getElementById('album-art').addEventListener('input', function (e) {
    albumData.albumArt = e.target.value
    // console.log(albumData)
})

// create new album or edit existing
document.getElementById('add-new-album').addEventListener('click', function () {
    if (!isEdit) {
        createNewAlbum(albumData)
    } else {
        updateAlbum(albumData)
    }
    clearFields()
})

function createNewAlbum(newAlbum) {
    // console.log(newAlbum)
    newAlbum.id = randomId()
    const newAlbums = [...albums, newAlbum]
    localStorage.setItem('albums', JSON.stringify(newAlbums))
    generateAlbumCard(newAlbum)
}

async function updateAlbum(updatedAlbum) {
    albums = albums.map(album => album.id === updatedAlbum.id ? updatedAlbum : album)
    localStorage.setItem('albums', JSON.stringify(albums))
    const cardTitle = selectedCard.children[0].children[1].firstElementChild
    const artistName = selectedCard.children[0].children[1].firstElementChild.nextElementSibling
    const albumArt = selectedCard.children[0].firstElementChild
    cardTitle.innerText = updatedAlbum.albumName
    artistName.innerText = await getArtistNameFromId(updatedAlbum.artistId)
    albumArt.src = updatedAlbum.albumArt
    addAlbumBtn.innerText = 'Add Album'
    addAlbumBtn.classList.replace('btn-warning', 'btn-primary')
    isEdit = false
    selectedCard = null
}

// delete album
document.querySelector('#album-list').addEventListener('click', function (e) {
    target = e.target
    if (target.classList.contains('delete')) {
        selectedCard = target.parentElement.parentElement.parentElement
        deleteAlbum(selectedCard.id)
    }
    if (target.classList.contains('fa-trash')) {
        selectedCard = target.parentElement.parentElement.parentElement.parentElement
        deleteAlbum(selectedCard.id)
    }
    if (target.classList.contains('edit') || target.classList.contains('fa-pen')) {
        selectedCard = target.parentElement.parentElement.parentElement
        editAlbum(selectedCard.id)
    }
    if (target.classList.contains('fa-pen')) {
        selectedCard = target.parentElement.parentElement.parentElement.parentElement
        editAlbum(selectedCard.id)
    }
})

function editAlbum(id) {
    albumToEdit = albums.filter(album => album.id === id)[0]
    const indexOfArtist = albumToEdit?.artistId && artists.findIndex((item, i) => item.id === albumToEdit.artistId)
    if (albumToEdit?.albumName && albumToEdit?.albumArt) {
        document.getElementById('select-artist').selectedIndex = indexOfArtist + 1
        document.getElementById('album-input').value = albumToEdit?.albumName && albumToEdit.albumName
        document.getElementById('album-art').value = albumToEdit?.albumArt && albumToEdit.albumArt
        albumData = {
            ...albumData,
            id: albumToEdit.id,
            artistId: albumToEdit.artistId,
            albumName: albumToEdit.albumName,
            albumArt: albumToEdit.albumArt
        }
        addAlbumBtn.innerText = 'Update'
        addAlbumBtn.classList.replace('btn-primary', 'btn-warning')
        isEdit = true
    }
}

function deleteAlbum(id) {
    albums = albums.filter(album => album.id !== id)
    localStorage.setItem('albums', JSON.stringify(albums))
    selectedCard.remove()
    selectedCard = null
}

async function generateAlbumCard(album) {
    const albumCard = document.createElement("div")
    let artistName = await getArtistNameFromId(album.artistId)
    albumCard.className = 'col'
    albumCard.id = album.id
    albumCard.innerHTML = `
            <div class="card text-bg-dark m-2"
                    style="max-width: 300px; max-height: 300px;  min-width: 150px; min-height: 150px;">
                    <img src=${album.albumArt} class="card-img" alt="..." style="opacity: 0.15">
                    <div class="card-img-overlay">
                        <h5 class="card-title">${album.albumName}</h5>
                        <p class="card-text">${artistName}</p>
                        <button class="btn btn-outline-light edit">
                            <i class="fas fa-pen"></i>
                        </button>
                        <button class="btn btn-outline-light delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
        `
    document.getElementById('album-list').appendChild(albumCard)
}

function randomId() {
    let s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    //return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}