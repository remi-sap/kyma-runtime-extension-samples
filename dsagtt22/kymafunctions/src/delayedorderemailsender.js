const fetch = require('node-fetch');
const { CourierClient } = require("@trycourier/courier");
//npm i node-fetch@2 @trycourier/courier

module.exports = {
  main: async function (event, context) {
    const bodyJson = JSON.parse(event.extensions.request.body)
    const delayedOrderId = bodyJson.orderId

    console.log("Delayed OrderID from event: " + delayedOrderId)

    // Fetch order details to get latest email address
    const orderApiEndpoint = process.env.ORDER_SERVICE_ENDPOINT
    const readOrderUrl = `${orderApiEndpoint}/orders/${delayedOrderId}`

    const responseFromOrderService = await fetch(readOrderUrl,
      {
        method: 'GET',
      })

    let responseBodyFromOrderService = await responseFromOrderService.json()

    let email = ""

    if (responseBodyFromOrderService.length === 1) {
      console.log("Order retrieved")
      // If there is a reasonable email in the order we can use it from there
      //email = responseBodyFromOrderService[0].email
      //or we use some hardcoded value
      email = "Some hardcoded email"
    }
    else {
      console.log("Error when fetching the order")
      return
    }

    // Send email via Courier
    // https://www.courier.com/
    const courierApiKey = process.env.COURIER_API_KEY

    const courier = CourierClient({ authorizationToken: courierApiKey })

    const emailTitle = `Order ${delayedOrderId} - DELAYED`
    const emailBody = `We are sorry, but your order ${delayedOrderId} is delayed :-(`

    const { requestId } = await courier.send({
      message: {
        to: {
          email: email,
        },
        content: {
          title: emailTitle,
          body: emailBody,
        },
        routing: {
          method: "single",
          channels: ["email"],
        },
      },
    })

    console.log(`Email about delay of order ${delayedOrderId} sent via request ${requestId}`)

  }
}