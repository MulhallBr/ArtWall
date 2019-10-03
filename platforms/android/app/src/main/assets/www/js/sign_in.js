(function () {

    // Get elements
    const txtEmail = document.getElementById('inputEmail');
    const txtPassword = document.getElementById('inputPassword');
    const btnLogin = document.getElementById('submitBtn');
    const btnSignUp = document.getElementById('createBtn');

    // Add login event
    btnLogin.addEventListener('click', e => {
        // Get email and Pass
        const email = txtEmail.value;
        const pass = txtPassword.value;

        const auth = firebase.auth();
        // Sign in
        const promise = auth.signInWithEmailAndPassword(email, pass);
        promise.catch(function (e){
            alert(e.message);
        });
    });

    // Add sign up event
    btnSignUp.addEventListener('click', e => {
        // Get email and Pass
        const email = txtEmail.value;
        const pass = txtPassword.value;

        const auth = firebase.auth();
        // Sign in
        const promise = auth.createUserWithEmailAndPassword(email, pass);
        promise
            .catch(function (e) {
                alert(e.message);
            });
    });

    // Add a realtime listener
    firebase.auth().onAuthStateChanged(firebaseUser => {
        if(firebaseUser) {
            // Redirect to home page
            window.location.href = "index.html";
            }
    });



}());