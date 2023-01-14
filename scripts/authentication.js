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
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in
            let user = userCredential.user;
            console.log(`se ha registrado ${user.email} ID:${user.uid}`)
            alert(`se ha registrado ${user.email} ID:${user.uid}`)
            // ...
            // Guarda El usuario en Firestore
            createUser({
                id: user.uid,
                email: user.email
            });
        })
        .catch((error) => {
            let errorCode = error.code;
            let errorMessage = error.message;
            console.log("Error en el sistema" + error.message);
        });
};

document.getElementById("signup").addEventListener("click", function () {
    let email = document.querySelector("#email").value;
    let pass = document.querySelector("#password").value;
    signUpUser(email, pass)
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

document.getElementById("login").addEventListener("click", function () {
    let email = document.querySelector("#uname").value;
    let password = document.querySelector("#psw").value;
    document.location.assign("../index.html");
    signInUser(email, password);
  })

  document.getElementById("signup").addEventListener("click", function () {
    let email = document.querySelector("#email").value;
    let pass = document.querySelector("#password").value;
    signUpUser(email, pass);
  })

  function getAvatar(userID) {
    return new Promise((resolve, reject) => {
        getUserById(userID)
            .then((user) => {
                resolve(user.data().avatar)
            }).catch((err) => reject(err))
    })
}

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      let linkLogin = document.getElementById("session");
      linkLogin.innerHTML = `Loged as ${user.email}`
      getAvatar(firebase.auth().currentUser.uid)
        .then((avatar) => {printAvatar(avatar.pic)})
      document.getElementById("logout").addEventListener("click", function () {
      signOut();
    })} else {
      document.getElementById("session").innerHTML = "Login/Sign Up";
      document.getElementById("logout").style.display = "none";
      document.getElementById("addAvatar").style.display = "none";
    }
  });

// Listener de usuario en el sistema
// Controlar usuario logado
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    console.log(`Está en el sistema:${user.email} ${user.uid}`);
  } else {
    console.log("no hay usuarios en el sistema");
  }
});
