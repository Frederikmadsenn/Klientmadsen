const SDK = {
    serverURL: "http://localhost:8080/api",
    request: (options, cb) => {

        let headers = {};
        if (options.headers) {
            Object.keys(options.headers).forEach((h) => {
                headers[h] = (typeof options.headers[h] === 'object') ? JSON.stringify(options.headers[h]) : options.headers[h];
            });
        }

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

        loadFood: (cb) => {
            SDK.request({
                method: "GET",
                url: "/food",
                headers: {authorization: SDK.Storage.load("token")}
            }, (err, data) => {

                let decryptedData = SDK.Crypter.encryptDecrypt(data);

                if(err) return cb(err);

                cb(null, decryptedData);
            })

        },

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


    /*   Book: {
           addToBasket: (book) => {
               let basket = SDK.Storage.load("basket");

               //Has anything been added to the basket before?
               if (!basket) {
                   return SDK.Storage.persist("basket", [{
                       count: 1,
                       book: book
                   }]);
               }

               //Does the book already exist?
               let foundBook = basket.find(b => b.book.id === book.id);
               if (foundBook) {
                   let i = basket.indexOf(foundBook);
                   basket[i].count++;
               } else {
                   basket.push({
                       count: 1,
                       book: book
                   });
               }

               SDK.Storage.persist("basket", basket);
           },
           findAll: (cb) => {
               SDK.request({
                   method: "GET",
                   url: "/books",
                   headers: {
                       filter: {
                           include: ["authors"]
                       }
                   }
               }, cb);
           },
           create: (data, cb) => {
               SDK.request({
                   method: "POST",
                   url: "/books",
                   data: data,
                   headers: {authorization: SDK.Storage.load("tokenId")}
               }, cb);
           }
       },
       Author: {
           findAll: (cb) => {
               SDK.request({method: "GET", url: "/authors"}, cb);
           }
       },
       Order: {
           create: (data, cb) => {
               SDK.request({
                   method: "POST",
                   url: "/orders",
                   data: data,
                   headers: {authorization: SDK.Storage.load("tokenId")}
               }, cb);
           },
           findMine: (cb) => {
               SDK.request({
                   method: "GET",
                   url: "/orders/" + SDK.User.current().id + "/allorders",
                   headers: {
                       authorization: SDK.Storage.load("tokenId")
                   }
               }, cb);
           }
       },*/


    User: {
        findAll: (cb) => {
            SDK.request({method: "GET", url: "/users"}, cb);
        },
        current: () => {
            return SDK.Storage.load("users");
        },
        logOut: () => {
            SDK.Storage.remove("tokenId");
            SDK.Storage.remove("userId");
            SDK.Storage.remove("user");
            window.location.href = "Login.html";
        },
        login: (username, password, cb) => {
            SDK.request({
                data: {
                    username: username,
                    password: password
                },
                url: "/users/login/",
                method: "POST"
            }, (err, data) => {

                //On login-error
                if (err) return cb(err);

                SDK.Storage.persist("token", data.id);
                SDK.Storage.persist("id", data.User);
                SDK.Storage.persist("username", data.username);

                cb(null, data);

            });
        },
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

    //Method for encrypting the data to the server
    encrypt:
        (encrypt) => {
        if (encrypt !== undefined && encrypt.length !== 0) {
            //Encrypt key
            const key = ['L', 'O', 'L'];
            let isEncrypted = "";
            for (let i = 0; i < encrypt.length; i++) {
                isEncrypted += (String.fromCharCode((encrypt.charAt(i)).charCodeAt(0) ^ (key[i % key.length]).charCodeAt(0)))
            }
            return isEncrypted;
        } else {
            return encrypt;
        }
    },

    //Method for decrypting the data from the server
    decrypt:
        (decrypt) => {
            if (decrypt !== undefined && decrypt.length !== 0) {
                //Decrypt key
                const key = ['L', 'O', 'L'];
                let isDecrypted = "";
                for (let i = 0; i < decrypt.length; i++) {
                    isDecrypted += (String.fromCharCode((decrypt.charAt(i)).charCodeAt(0) ^ (key[i % key.length]).charCodeAt(0)))
                }
                return isDecrypted;
            } else {
                return decrypt;
            }
        },


};
