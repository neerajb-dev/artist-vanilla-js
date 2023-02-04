let selectedRow = null;
let artists = []

window.addEventListener('DOMContentLoaded', function () {
    fetchUpdatedArtistsFromLocal()
})

function fetchUpdatedArtistsFromLocal() {
    const artistsFromLocal = JSON.parse(this.localStorage.getItem('artists'))
    if (!artists.length) {
        artistsFromLocal && artists.push.apply(artists, artistsFromLocal)
    }
    // console.log(artists)
    artists.forEach(artist => {
        const row = document.createElement('tr')
        row.innerHTML = `
            <td>${artist.id}</td> 
            <td>${artist.name}</td> 
            <td>
                <button class="btn btn-warning btn-sm edit">Edit</button>
                <button class="btn btn-danger btn-sm delete">Delete</button>
            </td>
        `
        document.getElementById('artist-list').appendChild(row)
    })
}

const artistInput = document.getElementById('artist-input')
const addArtistBtn = document.getElementById('add-artist-btn')

function clearFields() {
    document.querySelector('#artist-input').value = "";
}

addArtistBtn.addEventListener('click', () => {
    let newArtist = artistInput.value
    if (newArtist) {
        if (!selectedRow) {
            createNewArtist(newArtist)
        } else {
            updateSelectedArtist(newArtist)
        }
    } else {
        console.log('Enter Artist Name')
    }
    clearFields()
})

// edit artist data
document.querySelector('#artist-list').addEventListener('click', (e) => {
    target = e.target
    if (target.classList.contains('edit')) {
        selectedRow = target.parentElement.parentElement
        artistInput.value = selectedRow.children[1].innerText
        addArtistBtn.innerText = 'Update'
        addArtistBtn.classList.replace('btn-outline-secondary', 'btn-outline-primary')
    }
})

// delete artist data
document.querySelector("#artist-list").addEventListener('click', (e) => {
    let artistId = ''
    target = e.target
    if (target.classList.contains('delete')) {
        target.parentElement.parentElement.remove()
        artistId = target.parentElement.parentElement.firstElementChild.innerText
        artists = artists.filter(artist => artist.id !== artistId)
        localStorage.setItem('artists', JSON.stringify(artists))
    }
})

// create new artist function
function createNewArtist(artist) {
    const row = document.createElement('tr')
    const newArtist = {
        id: randomId(),
        name: artist
    }
    artists.push(newArtist)
    localStorage.setItem('artists', JSON.stringify(artists))
    row.innerHTML = `
        <td>${newArtist.id}</td> 
        <td>${newArtist.name}</td> 
        <td>
            <button class="btn btn-warning btn-sm edit">Edit</button>
            <button class="btn btn-danger btn-sm delete">Delete</button>
        </td>
    `
    document.getElementById('artist-list').appendChild(row)
    clearFields()
}

// update selected artist function
function updateSelectedArtist(updatedArtistName) {
    const artistId = selectedRow.children[0].innerText
    selectedRow.children[1].innerText = updatedArtistName
    selectedRow = null
    addArtistBtn.innerText = 'Add'
    addArtistBtn.classList.replace('btn-outline-primary', 'btn-outline-secondary')
    artists = artists.map(artist => artist.id === artistId ? {id: artistId, name: updatedArtistName} : artist)
    localStorage.setItem('artists', JSON.stringify(artists))
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