(function () {

   const btnLogout = document.getElementById('logOutBtn');
   const btnSignIn = document.getElementById('signInBtn');
   const bottomInfo = document.getElementById('bottomWelcome');
   const bottomPost = document.getElementById('bottomContent');

    // Add logout event
    btnLogout.addEventListener('click', e => {
       firebase.auth().signOut();
    });


    // Add a realtime listener
    firebase.auth().onAuthStateChanged(firebaseUser => {
        if(firebaseUser) {
            btnLogout.classList.remove('hide');
            btnSignIn.classList.add('hide');
            bottomInfo.classList.add('hide');
            bottomPost.classList.remove('hide');
        } else {
            btnLogout.classList.add('hide');
            btnSignIn.classList.remove('hide');
            bottomInfo.classList.remove('hide');
            bottomPost.classList.add('hide');
        }
    });

}());