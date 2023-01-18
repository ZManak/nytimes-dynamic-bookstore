const firebaseConfig = {
    apiKey: "AIzaSyDE2M30uDisG8Am6pYpkakQsYZhatbQwz8",
    authDomain: "nyt-reads.firebaseapp.com",
    projectId: "nyt-reads",
    storageBucket: "nyt-reads.appspot.com",
    messagingSenderId: "523704806484",
    appId: "1:523704806484:web:9c47cd811a032bf831d1c1"
};

firebase.initializeApp(firebaseConfig);// Inicializaar app Firebase
const db = firebase.firestore();
const storageRef = firebase.storage().ref();

let canvasCategories = document.querySelector(".canvasCat");
let canvasBooks = document.querySelector(".canvasBooks")
let canvasFavs = document.querySelector(".canvasFavs")
let login = document.getElementById("log")
const arrayCategories = [];
const arrayBooks = [];
const botones = [];
const arrayFavs = [];

const createUser = (user) => {
    db.collection("users")
        .add(user)
        .then((docRef) => console.log("Document written with ID: ", docRef.id))
        .catch((error) => console.error("Error adding document: ", error));
};

const signUpUser = (email, password) => {
    firebase
        .auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            let user = userCredential.user;
            console.log(`se ha registrado ${user.email} ID:${user.uid}`)
            alert(`se ha registrado ${user.email} ID:${user.uid}`)
            createUser({
                id: user.uid,
                email: user.email
            });
        })
        .catch((error) => {
            let errorCode = error.code;
            let errorMessage = error.message;
            console.log("Error en el sistema" + errorCode + errorMessage);
        });
};


const signInUser = (email, password) => {
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in
            let user = userCredential.user;
            console.log(`se ha logado ${user.email} ID:${user.uid}`)
            alert(`se ha logado ${user.email} ID:${user.uid}`)
            console.log("USER", user);
        })
        .catch((error) => {
            let errorCode = error.code;
            let errorMessage = error.message;
            console.log(errorCode)
            console.log(errorMessage)
        });
}

const signOut = () => {
    let user = firebase.auth().currentUser;
    firebase.auth().signOut().then(() => {
        console.log("Sale del sistema: " + user.email)
    }).catch((error) => {
        console.log("hubo un error: " + error);
    });
}

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        let linkLogin = document.getElementById("session");
        linkLogin.style.display = "none";
        getAvatar(firebase.auth().currentUser.uid)
            .then((avatar) => { printAvatar(avatar.pic) })
        document.getElementById("avatar").style.display = "block"
        document.getElementById("log").style.display = "none"
        document.getElementById("logout").addEventListener("click", function () {
            signOut();
            document.location.reload("true")
        })
    } else {
        document.getElementById("session").style.display = "block";
        document.getElementById("avatar").style.display = "none"
        document.getElementById("logout").style.display = "none";
        document.getElementById("addAvatar").style.display = "none";
        document.getElementById("favorites").style.display = "none";
    }
});

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        console.log(`Está en el sistema:${user.email} ${user.uid}`);
    } else {
        console.log("no hay usuarios en el sistema");
    }
});

async function getCategories() {
    let resp = await fetch("https://api.nytimes.com/svc/books/v3/lists/names.json?api-key=GAcpHtEABQGQmAlDrXlHGWSjtTBLAo3A");
    let categories = await resp.json();
    document.getElementById("gif").style.display = "none";
    printCategories(categories, canvasCategories)
    buttonEvent();
}

async function getBooks(catName) {
    document.querySelector(".canvasCat").style.display = "none";
    document.getElementById("gif").style.display = "block";
    let resp = await fetch(`https://api.nytimes.com/svc/books/v3/lists/current/${catName}.json?api-key=GAcpHtEABQGQmAlDrXlHGWSjtTBLAo3A`);
    let books = await resp.json();
    document.getElementById("gif").style.display = "none";
    document.querySelector(".canvasBooks").style.display = "flex";
    document.querySelector(".canvasBooks").style.flexWrap = "wrap"
    //document.querySelector(".canvasBooks").style.flexDirection = "column";
    document.querySelector(".canvasBooks").style.justifyContent = "center";
    printBooks(books, canvasBooks);

}

function printCategories(categories, canvas) {
    let bookCategories = categories.results

    for (let i = 0; i < bookCategories.length; i++) {
        arrayCategories.push(bookCategories[i])
    }

    for (let i = 0; i < arrayCategories.length; i++) {
        let card = document.createElement("div")
        card.setAttribute("class", "catCard")
        card.innerHTML =
            `<h3>${bookCategories[i].display_name}</h3>
            <p>Last published: ${bookCategories[i].newest_published_date}</p>
            <p>Oldest Published: ${bookCategories[i].oldest_published_date}</p>
            <p>This list is updated ${bookCategories[i].updated}</p>
            <button class="readMore${i}">READ MORE</button>`
        canvas.appendChild(card);
    }
}

function printBooks(books, canvas) {
    let bookList = books.results.books

    for (let i = 0; i < bookList.length; i++) {
        arrayBooks.push(bookList[i])
    }

    for (let i = 0; i < arrayBooks.length; i++) {
        let card = document.createElement("div")
        card.setAttribute("class", "bookCard")
        card.innerHTML =
            `<h3>#${arrayBooks[i].rank} ${arrayBooks[i].title}</h3>
            <img class="bookImg" src=${arrayBooks[i].book_image} alt=${bookList[i].title}>
            <p><b>Weeks on chart:</b> ${arrayBooks[i].weeks_on_list}</p>
            <p><b>Description:</b> ${bookList[i].description}</p>
            <a href=${bookList[i].amazon_product_url} target="_blank"}>BUY</a>
            <button style = "button" id="addFav${i}">Add to Favorites</button>`
        canvas.appendChild(card);
        const favBook =
        {
            title: bookList[i].title,
            description: bookList[i].description,
            buy: bookList[i].amazon_product_url
        }
        const favButton = document.getElementById(`addFav${i}`)
        favButton.addEventListener('click', function () {
            addFav(firebase.auth().currentUser.uid, favBook)
        })
    }
    scroll(0, 0)
}

function buttonEvent() {
    for (let i = 0; i < arrayCategories.length; i++) {
        let boton = document.querySelector(`.readMore${i}`);
        botones.push(boton);

    }
    botones.forEach((element, i) => element.addEventListener("click", function () {
        getBooks(arrayCategories[i].list_name_encoded)
    }));
}

getCategories()

function getUserById(userId) {
    return new Promise((resolve, reject) => {
        db.collection('users')
            .where('id', '==', userId)
            .get()
            .then((snapshot) => {
                snapshot.forEach((doc) => resolve(doc))
            })
            .catch((err) => { reject(err) })
    })
}

function addFav(userID, bookObject) {
    getUserById(userID)
        .then((user) => {
            if (!user.data().hasOwnProperty('favs')) {
                user.ref.update({ favs: [bookObject] });
            } else {
                user.ref.update({ favs: user.data().favs.concat(bookObject) })
            }
            alert('Added to Favorites')
        })
}

function getFavs(userID) {
    return new Promise((resolve, reject) => {
        getUserById(userID)
            .then((user) => {
                resolve(user.data().favs)
            }).catch((err) => reject(err))
    })
}

function printFavs(favs) {
    favs.forEach((fav) => {
        let card = document.createElement("div")
        card.setAttribute("class", "bookCard")
        card.innerHTML =
            `<h3>${fav.title}</h3>
            <p><b>Description:</b> ${fav.description}</p>
            <a href=${fav.buy} target="_blank"}>BUY</a>`
        canvasFavs.appendChild(card);
    })
}

function addAvatar(userID, url) {
    getUserById(userID)
        .then((user) => {
            if (!user.data().hasOwnProperty('avatar')) {
                user.ref.update({ avatar: url });
            } else {
                user.ref.update({ avatar: url })
            }
        })
    alert('Added avatar')
}

function uploadAvatar(event) {{
        event.stopPropagation();
        event.preventDefault();
        let file = event.target.files[0];

        var metadata = {
            'contentType': file.type
        };

        // Push to child path.
        storageRef.child('images/' + file.name).put(file, metadata).then(function (snapshot) {
            console.log('Uploaded', snapshot.totalBytes, 'bytes.');
            console.log('File metadata:', snapshot.metadata);
            // Let's get a download URL for the file.
            snapshot.ref.getDownloadURL().then(function (url) {
                console.log('File available at', url);
            });
        }).catch(function (error) {
            console.error('Upload failed:', error);
        });
    }
    alert('Uploaded avatar')
}

function getAvatar(userID) {
    return new Promise((resolve, reject) => {
        getUserById(userID)
            .then((user) => {
                resolve(user.data().avatar)
            }).catch((err) => reject(err))
    })
}

const printAvatar = (url) => {
    let picture = document.getElementById("avatar");
    picture.setAttribute('src', url);
}

document.getElementById("back").addEventListener("click", () => {
    canvasCategories.style.display = "flex"
    document.location.reload("true");
    scroll(0, 0);
})

document.getElementById("session").addEventListener("click", () => {
    document.getElementById("log").style.display = "flex"
    document.getElementById("log").style.flexDirection = "column"
    canvasBooks.style.display = "none"
    canvasCategories.style.display = "none"
})

document.getElementById("addAvatar").addEventListener("click", () => {
    if (document.getElementById("fileSelect")) {
        document.getElementById("fileSelect").click();
    }
    });

window.onload = function () {
    document.getElementById('fileSelect').addEventListener('change', uploadAvatar)}

document.getElementById("favorites").addEventListener("click", () => {
    getFavs(firebase.auth().currentUser.uid).then((favs) => printFavs(favs));
    canvasBooks.style.display = "none";
    canvasCategories.style.display = "none"
    login.style.display = "none"
})

document.getElementById("signInForm").addEventListener("submit", function (event) {
    event.preventDefault()
    let email = document.querySelector("#uname").value;
    let password = document.querySelector("#psw").value;
    signInUser(email, password)
})

document.getElementById("signUpForm").addEventListener("submit", function (event) {
    event.preventDefault()
    let email = document.querySelector("#email").value;
    let pass = document.querySelector("#password").value;
    let pass2 = document.querySelector("#password2").value;
    if (pass === pass2) {
        signUpUser(email, pass);
    } else {
        alert("Passwords did not match")
    }
})