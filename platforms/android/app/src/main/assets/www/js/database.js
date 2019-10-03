
    // Database Reference
    const dbRefObject = firebase.database().ref().child('posts');

    // Get Button Elements from DOM
    const fileButton = document.getElementById('fileBtn');
    const uploadButton = document.getElementById('uploadBtn');
    const cameraButton = document.getElementById('cameraBtn');

    // Sync object changes
    dbRefObject.once('value', function(snapshot) {

        // Keep track of the number of posts using local storage
        var postCount = snapshot.numChildren();
        localStorage['postCount'] = (postCount + 1).toString();

        for (var postID in snapshot.val()) {
            displayPost(postID, snapshot.val()[postID].url, snapshot.val()[postID].description, snapshot.val()[postID].thumbs);
        }

    });

    // Download the posts to the feed and place on the DOM
    function displayPost(postID, url, desc, thumbs){
        var newDiv = document.createElement("div");
        newDiv.className = "col-lg-3 col-md-4 col-sm-6 mt-2";
        newDiv.id = postID;

        var newLink = document.createElement("a");
        newLink.id = "link";
        newLink.href = url;
        newLink.className = "d-block mb-2 h-80";
        newLink.target = "_blank";

        var img = document.createElement("img");
        img.className = "img-fluid img-thumbnail";
        img.src = url;

        var newDivTwo = document.createElement("div");
        newDivTwo.className = "mb-4 h-20 ml-2 mr-2";

        var newParOne = document.createElement("div");
        newParOne.id = "desc";
        newParOne.className = "col-10";
        newParOne.innerHTML = desc;

        var newBtn = document.createElement("button");
        newBtn.id = "likeBtn";
        newBtn.className = "btn btn-danger col-2";
        newBtn.type = "button";
        newBtn.innerHTML = thumbs + "&nbsp <i class=\"fas fa-heart\"></i>";
        newBtn.setAttribute("onclick", "liked(this);")

        document.getElementById("feed").appendChild(newDiv).appendChild(newLink).appendChild(img);
        document.getElementById(postID).appendChild(newDivTwo).appendChild(newParOne);
        document.getElementById(postID).appendChild(newDivTwo).appendChild(newBtn);
        document.getElementById("link").removeAttribute("id");
    }

    function liked(elem){

        var user = firebase.auth().currentUser;

        if (user) {
            // User is signed in.
            var currentThumbs = elem.innerHTML.match(/\d/g).join("");
            var newThumbs = parseInt(currentThumbs) + 1;

            elem.innerHTML = newThumbs.toString() + "&nbsp <i class=\"fas fa-heart\"></i>";

            dbRefObject.child(elem.parentElement.parentElement.id).update({
                thumbs : newThumbs
            });
        } else {
            // No user is signed in.
            alert("Please Sign In to Like a post.")
        }
    }

    // Upload a brand new post to the database and display
    fileButton.addEventListener('change', function(e) {
        chooseFile(e);
    });

    function writeNewPost(postID, desc, imageUrl) {
        firebase.database().ref('posts/' + postID).set({
            description : desc,
            thumbs : 0,
            url : imageUrl
        });
    }

    function chooseFile(e) {

        // Check for the various File API support.
        if (window.File && window.FileReader && window.FileList && window.Blob) {

            // Get file
            var file = e.target.files[0];

            if (!file.type.match('image.*')) {
                alert("Selected file must be an image.")
            }

            reader = new FileReader();
            reader.onload = (function () {
                return function (evt) {

                    document.getElementById('modalImage').src = evt.target.result;

                    $('#uploadModal').modal('show');
                };
            }(file));
            reader.readAsDataURL(file);

            uploadButton.addEventListener('click', function () {
                uploadFile(file);
            });

        } else {
            alert('The File APIs are not fully supported in this browser.');
        }
    }

    function uploadFile(file) {

        // Values
        var description = document.getElementById('modalDesc').value;
        var postID = 'p' + localStorage['postCount'];

        // Create Storage Ref
        var storageRef = firebase.storage().ref('images/pic' + localStorage['postCount']);

        // Upload file
        var task = storageRef.put(file);

        var promise = new Promise(function(resolve, reject) {
            setTimeout(function() {

                // Grab the files url
                storageRef.getDownloadURL().then(function (url) {

                    writeNewPost(postID, description, url);
                    location.reload();

                });

            }, 3000);
        });

    }

    function b64toBlob(dataURI) {

        var byteString = atob(dataURI.split(',')[1]);
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);

        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: 'image/jpeg' });
    }

    let app = {
        init: function(){
            cameraButton.addEventListener('click', function () {
                app.takePhoto();
            });

        },
        takePhoto: function(){
            let opts = {
                quality: 50,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                mediaType: Camera.MediaType.PICTURE,
                encodingType: Camera.EncodingType.JPEG,
                cameraDirection: Camera.Direction.BACK,
                correctOrientation: true,
                allowEdit: false
            };
            navigator.camera.getPicture(app.cameraSuccess, app.cameraFail, opts);
        },
        cameraSuccess: function (imgURI) {

            var blob = b64toBlob("data:image/jpeg;base64," + imgURI);

            document.getElementById('modalImage').src = "data:image/jpeg;base64," + imgURI;
            $('#uploadModal').modal('show');

            uploadButton.addEventListener('click', function () {
                uploadFile(blob);
            });

        },
        cameraFail: function (errorMsg) {
            alert.log(errorMsg);
        }
    };

    document.addEventListener('deviceready', app.init, false);