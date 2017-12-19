$(document).ready(() => {

    //SDK.User.loadNav();

    $("#Createbutton").click(() => {
        console.log('test');

        const username = $("#inputEmail").val();
        const password = $("#input-password").val();

        SDK.User.createUser(username, password, (err, data) => {
            alert('Bruger succesfuld oprettet');
            if (err && err.xhr.status === 401) {

                $(".form-group").addClass("has-error");

            }
            else if (err){
                console.log(err)

            }else {

                console.log(data);
                window.location.href = "index.html";
                SDK.Encryption.encryptDecrypt()

            }
        });
    });
});