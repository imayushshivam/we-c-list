// import { json } from "@remix-run/node";
// import db from "../db.server.js";
// import { cors } from "remix-utils/cors";

// export async function loader() {
//   return json({
//     ok: true,
//     message: "Hello from the wishlist API route",
//   });
// }

// // this is the code which are all realted to the how the data is going to be saved in the database. and handling of methods.

// export async function action({ request }) {
//   const method = request.method;

//   /* switch (method) {
//     case "POST":
//       return json({ message: "Success", method: "POST" });
//     case "PATCH":
//       return json({ message: "Success", method: "PATCH" });
//     default:
//       return new Response("Method not allowed", { status: 405 });
//   } */

//   let data = await request.formData();
//   data = Object.fromEntries(data);
//   const customerId = data.customerId;
//   const productId = data.productId;
//   const shop = data.shop;
//   const _action = data._action;

//   if (!customerId || !productId || !shop || !_action) {
//     return json({
//       message: "Missing Data.  Required data: customerId, productId, shop",
//       method: _action,
//     });
//   }
//   let response;

//   switch (_action) {
//     case "CREATE":
//       const wishlist = await db.wishlist.create({
//         data: {
//           customerId,
//           productId,
//           shop,
//         },
//       });
//       response = json({
//         message: "Product added to wishlist",
//         method: _action,
//         wishlisted: true,
//       });

//       return cors(request, response);

//     case "PATCH":
//       //handling PATCH req logic here
//       //for example, updating an  existing item in the database
//       //await db.wishlist.updateMany({ where: { customerId: customerId, shop: shop, productId: productId }, data: { wishlisted: true } });

//       return json({ message: "Success", method: "PATCH" });

//     case "DELETE":
//       //handling DELETE req logic here
//       await db.wishlist.deleteMany({
//         where: {
//           customerId: customerId,
//           shop: shop,
//           productId: productId,
//         },
//       });
//       response = json({
//         message: "Product removed from wishlist",
//         method: _action,
//         wishlisted: false,
//       });
//       return cors(request, response);

//     default:
//       //Optional: handle other methods or return a method not allowed response
//       return new Response("Method not allowed", { status: 405 });
//   }

//   //unreachable code
//   /* return json({ message: "Success" }); */
// }

import { json } from "@remix-run/node";
import db from "../db.server";
import { cors } from "remix-utils/cors";

// get request: accept request with request: customerId, shop, productId.
// read database and return wishlist items for that customer.
export async function loader({ request }) {
  const url = new URL(request.url);
  const customerId = url.searchParams.get("customerId");
  const shop = url.searchParams.get("shop");
  const productId = url.searchParams.get("productId");

  if (!customerId || !shop || !productId) {
    return json({
      message: "Missing data. Required data: customerId, productId, shop",
      method: "GET",
    });
  }

  // If customerId, shop, productId is provided, return wishlist items for that customer.
  const wishlist = await db.wishlist.findMany({
    where: {
      customerId: customerId,
      shop: shop,
      productId: productId,
    },
  });

  const response = json({
    ok: true,
    message: "Success",
    data: wishlist,
  });

  return cors(request, response);
}

// Expexted data comes from post request. If
// customerID, productID, shop
export async function action({ request }) {
  let data = await request.formData();
  data = Object.fromEntries(data);
  const customerId = data.customerId;
  const productId = data.productId;
  const shop = data.shop;
  const _action = data._action;

  if (!customerId || !productId || !shop || !_action) {
    return json({
      message:
        "Missing data. Required data: customerId, productId, shop, _action",
      method: _action,
    });
  }

  let response;

  switch (_action) {
    case "CREATE":
      // Handle POST request logic here
      // For example, adding a new item to the wishlist
      const wishlist = await db.wishlist.create({
        data: {
          customerId,
          productId,
          shop,
        },
      });

      response = json({
        message: "Product added to wishlist",
        method: _action,
        wishlisted: true,
      });
      return cors(request, response);

    case "PATCH":
      // Handle PATCH request logic here
      // For example, updating an existing item in the wishlist
      return json({ message: "Success", method: "Patch" });

    case "DELETE":
      // Handle DELETE request logic here (Not tested)
      // For example, removing an item from the wishlist
      await db.wishlist.deleteMany({
        where: {
          customerId: customerId,
          shop: shop,
          productId: productId,
        },
      });

      response = json({
        message: "Product removed from your wishlist",
        method: _action,
        wishlisted: false,
      });
      return cors(request, response);

    default:
      // Optional: handle other methods or return a method not allowed response
      return new Response("Method Not Allowed", { status: 405 });
  }
}
