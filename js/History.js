$(document).ready(() => {
    //har prøvet at hente liste over brugerens tidligere køb

    const $historylist = $("#history-tbody");

    SDK.User.myReceipt((err, data) => {

        if(err) {
            console.log("err");
        }

        console.log(data);
        data.forEach((item) => {

            let $itemsOrdered = " ";

            let $itemsTotalPrice = 0;

            for(let i = 0; i < item.items.length; i++) {

                $itemsOrdered += " " + item.items[i].product.productName;

                $itemsTotalPrice += parseInt(item.items[i].product.productPrice);

            }

            const historyHtml = `
         <tr>
             <td>${item.id}</td>
             <td>${item.date}</td>
             <td>${$itemsOrdered}</td>
             <td>${$itemsTotalPrice}</td>
             <td>${item.userId}</td>
         </tr>
       `;

            $historylist.append(historyHtml);

        });

    })
    //navigationsbar
    SDK.User.loadNav();


});