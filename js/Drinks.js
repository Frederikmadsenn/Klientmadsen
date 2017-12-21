$(document).ready(() => {
    //navigationsbar i toppen af programmet
    SDK.User.loadNav();
    //prøver at hente liste fra databasen med drikkevarerne


    const $drikkevarerlist = $("#drikkevarer-tbody");

    SDK.Order.loadDrinks((err, data) => {

        if (err) {
            console.log("err");
        }

        //Dataene er serialiseret JSON. Vi skal deserialisere det tilbage til JSON, før vi løber gennem dets egenskaber
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
        //prøver her at lave funktionen til knappen hvor man køber
        $(".order-button").click(function () {
            const itemId = $(this).data("item-id");
            const item = deserializedJSON.find((item) => item.id === itemId);


            SDK.Order.create(item);

            alert("Køb gennemført!");



        });


    });
});
