$(document).ready(() => {

    SDK.User.loadNav();

    //prøver at hente liste fra databasen med drikkevarerne


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
    //har brugt disse alerts som hjælp til at finde ud af hvorfor det ikke virker for mig
    alert("hallo");
    $(".order-button").click(function () {
        const itemId = $(this).data("item-id");
        const item = deserializedJSON.find((item) => item.id === itemId);
        alert("hallo");

        SDK.Order.create(item);

        alert("Køb gennemført!");



    });

})



});
