const users = []
const artists = []
let ratings = []
let albums = []
let selectedUserId = ''

const selectUserOptions = document.getElementById('select-user')

// const stars = document.querySelectorAll(".stars a")

window.addEventListener('DOMContentLoaded', function () {
    fetchUsersFromLocal()
    fetchArtistsFromLocal()
    fetchAlbumsFromLocal()
    fetchRatingsFromLocal()
})

function fetchRatingsFromLocal() {
    const ratingsFromLocal = JSON.parse(localStorage.getItem('ratings'))
    if (!ratings.length) {
        ratingsFromLocal && ratings.push.apply(ratings, ratingsFromLocal)
    }
}

function fetchAlbumsFromLocal() {
    const albumsFromLocal = JSON.parse(localStorage.getItem('albums'))
    if (!albums.length) {
        albumsFromLocal && albums.push.apply(albums, albumsFromLocal)
    }
    albums && albums.forEach(album => generateAlbumCard(album))
}

function fetchUsersFromLocal() {
    const userFromLocal = JSON.parse(this.localStorage.getItem('users'))
    if (!users.length) {
        userFromLocal && users.push(...userFromLocal)
    }
    users && users.forEach(user => {
        const option = document.createElement('option')
        option.value = user.id
        option.innerText = user.name
        document.getElementById('select-user').appendChild(option)
    })
}

function fetchArtistsFromLocal() {
    const artistFromLocal = JSON.parse(localStorage.getItem('artists'))
    if (!artists.length) {
        artistFromLocal && artists.push.apply(artists, artistFromLocal)
    }
}

selectUserOptions.addEventListener('change', function (e) {
    selectedUserId = e.target.value
})

// generate album cards
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
                        <div class="stars">
                            <a>⭐</a>
                            <a>⭐</a>
                            <a>⭐</a>
                            <a>⭐</a>
                            <a>⭐</a>
                        </div>
                    </div>
                </div>
        `
    document.getElementById('album-list').appendChild(albumCard)
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

document.getElementById('album-list').addEventListener('click', function (e) {
    target = e.target
    if (target.parentElement.classList.contains('stars')) {
        let parent = target.parentNode
        // console.log(parent.parentElement.parentElement.parentElement.id)
        let albumId = parent.parentElement.parentElement.parentElement.id
        let index = Array.prototype.indexOf.call(parent.children, target)
        handleStarSelection(parent)
        const rating = {
            userId: selectedUserId,
            albumId: albumId,
            stars: index + 1
        }
        rateAlbum(rating)
        // const updatedAlbum = albums && albums.map(album => album.id === albumId ? ({
        //     ...album,
        //     stars: index + 1,
        //     starCount: [
        //         { count: 0, per: 0 },
        //         { count: 0, per: 0 },
        //         { count: 0, per: 0 },
        //         { count: 0, per: 0 },
        //         { count: 0, per: 0 }
        //     ]
        // }) : album)
        // console.log(updatedAlbum)
    }
})

function handleStarSelection(starNode) {
    Array.prototype.forEach.call(starNode.children, function (star, clkIdx) {
        star.addEventListener('click', function () {
            starNode.classList.add('disabled')
            Array.prototype.forEach.call(starNode.children, function (otherStar, otherIdx) {
                if (otherIdx <= clkIdx) {
                    otherStar.classList.add('active')
                }
            })
        })
    })
}

// stars.forEach((star, i) => {

//     star.addEventListener("click", function () {
//         console.log(`${i + 1} star`)
//     })
// })

function rateAlbum(rating) {
    const newRating = {
        ...rating,
        id: randomId()
    }
    const userRatings = ratings && ratings.filter(rating => (rating.userId === newRating.userId && rating.albumId === newRating.albumId))
    if (!userRatings.length) {
        ratings.push(newRating)
    } else {
        userRatings.map(userRating => {
            if (userRating.albumId === newRating.albumId && userRating.userId === newRating.userId) {
                console.log("user rating present", userRating)
                const updatedRatings = ratings.map(rate => rate.id === userRating.id ? newRating : rate)
                ratings = updatedRatings
            }
        })
    }
    localStorage.setItem('ratings', JSON.stringify(ratings))
}

// generate random Id 
function randomId() {
    let s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    //return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}