$(document).ready(() => {

    SDK.User.loadNav();


    const $drikkevarerlist = $("#drikkevarer-tbody");

    SDK.Order.loadDrinks((err, data) => {

        if (err) {
            console.log("err");
        }

        //The data is serialized JSON (even though SDK.js parses it in its succes), we must deserialize it back to JSON before looping through its properties
        // https://stackoverflow.com/questions/7861032/loop-and-get-key-value-pair-for-json-array-using-jquery

        let deserializedJSON = $.parseJSON(data);

        deserializedJSON.forEach((item) => {

            const drikkeHtml = `
         <tr>
             <td>${item.productName}</td>
             <td>${item.productPrice}</td>
             <td><button type="button" class="btn btn-success order-button" data-item-id="${item.id}">Order this!</button></td>
       `;

            $drikkevarerlist.append(drikkeHtml);

        });

        $(".køb-button").click(function () {
            const itemId = $(this).data("item-id");
            const item = deserializedJSON.find((item) => item.id === itemId);


            SDK.Order.create(item);

            alert("Køb gennemført!");



        });


    });
});