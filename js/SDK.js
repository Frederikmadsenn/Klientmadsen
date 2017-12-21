const SDK = {
    //serverens url
    serverURL: "http://localhost:8080/api",
    request: (options, cb) => {

        let headers = {};
        if (options.headers) {
            Object.keys(options.headers).forEach((h) => {
                headers[h] = (typeof options.headers[h] === 'object') ? JSON.stringify(options.headers[h]) : options.headers[h];
            });
        }
        //Asynkront kald til server

        alert(JSON.stringify(options.data));
        $.ajax({
            url: SDK.serverURL + options.url,
            method: options.method,
            headers: headers,
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(options.data),
            success: (data, status, xhr) => {
                cb(null, data, status, xhr);
            },
            error: (xhr, status, errorThrown) => {
                cb({xhr: xhr, status: status, error: errorThrown});
            }
        });
//ordre funktion til brugeren
    },
    Order: {
        create: (data, cb) => {
            SDK.request({
                method: "POST",
                url: "/users/order/16",
                data: data.id,
                headers: {authorization: SDK.Storage.load("tokenId")}
            }, cb, (err) => {
                if(err) return cb(err);

                cb(null);
            });
        },
//metode til en hente maden
        loadFood: (cb) => {
            SDK.request({
                method: "GET",
                url: "/food",
                headers: {authorization: SDK.Storage.load("token")}
            }, (err, data) => {



                if(err) return cb(err);


            })

        },
//metode til at hente drikkevarer
        loadDrinks: (cb) => {
            SDK.request({
                method: "GET",
                url: "/drink",
                headers: {authorization: SDK.Storage.load("token")}
            }, (err, data) => {

                let decryptedData = SDK.Crypter.encryptDecrypt(data);

                if(err) return cb(err);

                cb(null, decryptedData);

            });

        }
    },





    User: {
        findAll: (cb) => {
            SDK.request({method: "GET", url: "/users"}, cb);
        },
        current: () => {
            return SDK.Storage.load("users");
        },
        //lod ug funktion
        logOut: () => {
            SDK.Storage.remove("tokenId");
            SDK.Storage.remove("userId");
            SDK.Storage.remove("user");
            window.location.href = "Login.html";
        },
        //anmodning til log in
        login: (username, password, cb) => {
            SDK.request({
                data: {
                    username: username,
                    password: password
                },
                url: "/users/login/",
                method: "POST"
            }, (err, data) => {

                //Hvis der sker fejl vedr. log in
                if (err) return cb(err);

                SDK.Storage.persist("token", data.id);
                SDK.Storage.persist("id", data.User);
                SDK.Storage.persist("username", data.username);

                cb(null, data);

            });
        },
        //anmodning til opret bruger
        createUser: (username, password, cb) => {
            SDK.request({
                    data: {
                        username: username,
                        password: password
                    },
                    url: "/users/create/",
                    method: "POST"
                },
                (err, data) => {
                    alert('after url' + err);
                    if (err) return cb(err);

                    SDK.Storage.persist("token", data.id);
                    SDK.Storage.persist("id", data.User);
                    SDK.Storage.persist("username", data.username);
                    alert('calling cb');
                    cb(null, data);


                });
        },
        //kvittering på køb
        myReceipt: (cb) => {
            SDK.request({
                url: "/History",
                method: "GET",
                headers: {
                    authorization: SDK.Storage.load("token")
                }
            }, (err, data) => {

                if(err) return cb(err);

                cb(null, data);
            })

        },
        //navigationsbar, inspiration fra vejledernes client dokument

        loadNav: (cb) => {
            $("#nav-container").load("nav.html", () => {
                const currentUser = SDK.User.current();
                if (currentUser) {
                    $(".navbar-right").html(`
          <li><a href="index.html">Your orders</a></li>
          <li><a href="#" id="logout-link">Logout</a></li>
        `);
                } else {
                    $(".navbar-right").html(`
          <li><a href="Login.html">Log ud <span class="sr-only">(current)</span></a></li>
        `);
                }
                $("#logout-link").click(() => SDK.User.logOut());
                cb && cb();
            });
        }
    },
    //storage funktion
    Storage: {
        prefix: "testSDK",
        persist: (key, value) => {
            window.localStorage.setItem(SDK.Storage.prefix + key, (typeof value === 'object') ? JSON.stringify(value) : value)
        },
        load: (key) => {
            const val = window.localStorage.getItem(SDK.Storage.prefix + key);
            try {
                return JSON.parse(val);
            }
            catch (e) {
                return val;
            }
        },
        remove: (key) => {
            window.localStorage.removeItem(SDK.Storage.prefix + key);
        }
    },
    //kryptering
    Crypter: {

        encryptDecrypt(input)
        {
            var key = ['L', 'O', 'L']; //Kan være hvilken som helst "chars" og enhver str. array
            var output = [];

            for (var i = 0; i < input.length; i++) {
                var charCode = input.charCodeAt(i) ^ key[i % key.length].charCodeAt(0);
                output.push(String.fromCharCode(charCode));
            }
            return output.join("");
        }
    },


};


