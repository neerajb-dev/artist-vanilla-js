let selectedRow = null;
let users = []

window.addEventListener('DOMContentLoaded', function () {
    fetchUpdatedUsersFromLocal()
})

function fetchUpdatedUsersFromLocal() {
    const userFromLocal = JSON.parse(this.localStorage.getItem('users'))
    if (!users.length) {
        userFromLocal && users.push(...userFromLocal)
    }
    // console.log(users)
    users.forEach(user => {
        const row = document.createElement('tr')
        row.innerHTML = `
            <td>${user.id}</td> 
            <td>${user.name}</td> 
            <td>
                <button class="btn btn-warning btn-sm edit">Edit</button>
                <button class="btn btn-danger btn-sm delete">Delete</button>
            </td>
        `
        document.getElementById('user-list').appendChild(row)
    })
}

const userInput = document.getElementById('user-input')
const addUserBtn = document.getElementById('add-user-btn')

function clearFields() {
    document.querySelector('#user-input').value = "";
}

addUserBtn.addEventListener('click', () => {
    let newUser = userInput.value
    if (newUser) {
        if (!selectedRow) {
            createNewUser(newUser)
        } else {
            updateSelectedUser(newUser)
        }
    } else {
        console.log('Enter User Name')
    }
    clearFields()
})

// edit user data
document.querySelector('#user-list').addEventListener('click', (e) => {
    target = e.target
    if (target.classList.contains('edit')) {
        selectedRow = target.parentElement.parentElement
        userInput.value = selectedRow.children[1].innerText
        addUserBtn.innerText = 'Update'
        addUserBtn.classList.replace('btn-outline-secondary', 'btn-outline-primary')
    }
})

// delete user data
document.querySelector("#user-list").addEventListener('click', (e) => {
    let userId = ''
    target = e.target
    if (target.classList.contains('delete')) {
        target.parentElement.parentElement.remove()
        userId = target.parentElement.parentElement.firstElementChild.innerText
        users = users.filter(user => user.id !== userId)
        localStorage.setItem('users', JSON.stringify(users))
    }
})

// create new user function
function createNewUser(user) {
    const row = document.createElement('tr')
    const newUser = {
        id: randomId(),
        name: user
    }
    users.push(newUser)
    localStorage.setItem('users', JSON.stringify(users))
    row.innerHTML = `
        <td>${newUser.id}</td> 
        <td>${newUser.name}</td> 
        <td>
            <button class="btn btn-warning btn-sm edit">Edit</button>
            <button class="btn btn-danger btn-sm delete">Delete</button>
        </td>
    `
    document.getElementById('user-list').appendChild(row)
    clearFields()
}

// update selected user function
function updateSelectedUser(updatedUserName) {
    const userId = selectedRow.children[0].innerText
    selectedRow.children[1].innerText = updatedUserName 
    selectedRow = null
    addUserBtn.innerText = 'Add'
    addUserBtn.classList.replace('btn-outline-primary', 'btn-outline-secondary')
    users = users.map(user => user.id === userId ? {id: userId, name: updatedUserName} : user)
    localStorage.setItem('users', JSON.stringify(users))
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