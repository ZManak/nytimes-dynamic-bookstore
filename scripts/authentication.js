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

const createUser = (user) => {
  db.collection("users")
    .add(user)
    .then((docRef) => console.log("Document written with ID: ", docRef.id))
    .catch((error) => console.error("Error adding document: ", error));
};

const readAllUsers = (born) => {
  db.collection("users")
    .where("first", "==", born)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(doc.data());
      });
    });
};

function readOne(id) {
  db.collection("users")
    .doc(id)
    .get()
    .then((doc) => {
      if (doc.exists) {
        console.log("Document data:", doc.data());
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    })
    .catch((error) => {
      console.log("Error getting document:", error);
    });
}

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


const signInUser = (email, password) => {
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      let user = userCredential.user;
      console.log(`se ha logado ${user.email} ID:${user.uid}`)
      alert(`se ha logado ${user.email} ID:${user.uid}`)
      console.log("USER", user);
      console.log("Favoritos", user.favs)
      return user;
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

document.getElementById("signInForm").addEventListener("submit", function (event) {
  event.preventDefault()
  let email = document.querySelector("#uname").value;
  let password = document.querySelector("#psw").value;
  signInUser(email, password);
})

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    let linkLogin = document.getElementById("session");
    linkLogin.style.display = "none";
    linkLogin.innerHTML = `Loged as ${user.email}`
    getAvatar(firebase.auth().currentUser.uid)
      .then((avatar) => { printAvatar(avatar.pic) })
    document.getElementById("avatar").style.display = "block"
    document.getElementById("log").style.display = "none"
    document.getElementById("logout").addEventListener("click", function () {
      signOut();
    })
  } else {
    document.getElementById("session").innerHTML = "Login/Sign Up";
    document.getElementById("avatar").style.display = "none"
    document.getElementById("logout").style.display = "none";
    document.getElementById("addAvatar").style.display = "none";
    document.getElementById("favorites").style.display = "none";
  }
});

function getAvatar(userID) {
  return new Promise((resolve, reject) => {
    getUserById(userID)
      .then((user) => {
        resolve(user.data().avatar)
      }).catch((err) => reject(err))
  })
}

// Listener de usuario en el sistema
// Controlar usuario logado
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    console.log(`Está en el sistema:${user.email} ${user.uid}`);
  } else {
    console.log("no hay usuarios en el sistema");
  }
});
