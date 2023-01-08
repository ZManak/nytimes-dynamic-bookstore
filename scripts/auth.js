  const firebaseConfig = {
    apiKey: "AIzaSyDE2M30uDisG8Am6pYpkakQsYZhatbQwz8",
    authDomain: "nyt-reads.firebaseapp.com",
    projectId: "nyt-reads",
    storageBucket: "nyt-reads.appspot.com",
    messagingSenderId: "523704806484",
    appId: "1:523704806484:web:9c47cd811a032bf831d1c1"
  };

    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();
    /*
    firebaseAuth = initializeAuth(firebaseApp, {
      persistence: browserSessionPersistence,
      popupRedirectResolver: browserPopupRedirectResolver,
    });
    */


function handleSignUp() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    if (email.length < 4) {
      alert('Please enter an email address.');
      return;
    }
    if (password.length < 4) {
      alert('Please enter a password.');
      return;
    }
    // Create user with email and pass.
    firebaseApp.default.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode == 'auth/weak-password') {
        alert('The password is too weak.');
      } else {
        alert(errorMessage);
      }
      console.log(error);
    });
  }
const signUp = document.querySelector(".signupbtn")
signUp.addEventListener("click", function() {
    handleSignUp() 
})
