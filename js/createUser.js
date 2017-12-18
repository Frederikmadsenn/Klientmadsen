$(document).ready(() => {

    //SDK.User.loadNav();

    $("#Createuserbutton").click(() => {
        console.log('test');

        const username = $("#inputEmail").val();
        const password = $("#input-password").val();

        SDK.User.createUser(username, password, (err, data) => {
            alert('1');
            if (err && err.xhr.status === 401) {
                alert('2');
                $(".form-group").addClass("has-error");

            }
            else if (err){
                console.log(err)
alert('hej3');
            }else {
                alert('hej4');
                console.log(data);
                window.location.href = "index.html";
                SDK.Encryption.encryptDecrypt()

            }
        });
    });
});