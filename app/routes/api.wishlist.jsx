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
import db from "../db.server.js";
import { cors } from "remix-utils/cors";

export async function action({ request }) {
  const method = request.method;

  // Handle preflight OPTIONS request
  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*", // Allow requests from any origin
        "Access-Control-Allow-Methods": "POST, PATCH, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  let data = await request.formData();
  data = Object.fromEntries(data);
  const customerId = data.customerId;
  const productId = data.productId;
  const shop = data.shop;
  const _action = data._action;

  if (!customerId || !productId || !shop || !_action) {
    const response = json({
      message: "Missing Data. Required data: customerId, productId, shop",
      method: _action,
    });
    return cors(request, response, {
      origin: "*", // Allow from any origin
    });
  }

  let response;
  switch (_action) {
    case "CREATE":
      await db.wishlist.create({
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
      return cors(request, response, {
        origin: "*", // Allow from any origin
      });

    case "PATCH":
      response = json({ message: "Success", method: "PATCH" });
      return cors(request, response, {
        origin: "*",
      });

    case "DELETE":
      await db.wishlist.deleteMany({
        where: {
          customerId,
          shop,
          productId,
        },
      });
      response = json({
        message: "Product removed from wishlist",
        method: _action,
        wishlisted: false,
      });
      return cors(request, response, {
        origin: "*", // Allow from any origin
      });

    default:
      response = new Response("Method not allowed", { status: 405 });
      return cors(request, response, {
        origin: "*",
      });
  }
}
