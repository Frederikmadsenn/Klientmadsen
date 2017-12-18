$(document).ready(() => {

  //SDK.User.loadNav();

  $("#login-button").click(() => {

    const username = $("#inputUsername").val();
    const password = $("#inputPassword").val();

    SDK.User.login(username, password, (err, data) => {
      if (err && err.xhr.status === 401) {
        $(".form-group").addClass("has-error");
      }
      else if (err) {
        console.log("stuff happened")
      } else {
        var hey = JSON.parse(data);
        console.log(hey);
        SDK.Storage.persist("Username", hey.username);
        SDK.Storage.persist("Password", hey.password);
        SDK.Storage.persist("Token", hey.token);
        window.location.href = "index.html";
      }
    });

  });

});