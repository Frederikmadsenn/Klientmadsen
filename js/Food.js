$(document).ready(() => {

    SDK.User.loadNav();


    const $madlist = $("#mad-tbody");

    SDK.Order.loadFood((err, data) => {

        if(err) {
            console.log("err");
        }

        console.log(data);



        //See drikkevarer.js for explanation
        let deserializedJSON = $.parseJSON(data);

        deserializedJSON.forEach((item) => {

            const FoodHtml = `
         <tr>
             <td>${item.productName}</td>
             <td>${item.productPrice}</td>
             <td><button type="button" class="btn btn-success order-button" data-item-id="${item.id}">Køb</button></td>
       `;

            $madlist.append(FoodHtml);

        });

        $(".order-button").click(function () {
            const itemId = $(this).data("item-id");
            const item = deserializedJSON.find((item) => item.id === itemId);


            SDK.Order.create(item);

            alert("Køb gennemført!");



        });

    })



});