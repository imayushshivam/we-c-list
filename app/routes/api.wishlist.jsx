import { json } from "@remix-run/node";
import db from "../db.server";
import { cors } from "remix-utils/cors";

export async function loader() {
  return json({
    ok: true,
    message: "Hello from the wishlist API route",
  });
}

// this is the code which are all realted to the how the data is going to be saved in the database. and handling of methods.

export async function action({ request }) {
  const method = request.method;

  /* switch (method) {
    case "POST":
      return json({ message: "Success", method: "POST" });
    case "PATCH":
      return json({ message: "Success", method: "PATCH" });
    default:
      return new Response("Method not allowed", { status: 405 });
  } */

  let data = await request.formData();
  data = Object.fromEntries(data);
  const customerId = data.customerId;
  const productId = data.productId;
  const shop = data.shop;

  if (!customerId || !productId || !shop) {
    return json({
      message: "Missing Data.  Required data: customerId, productId, shop",
      method: method,
    });
  }

  switch (method) {
    case "POST":
      const wishlist = await db.wishlist.create({
        data: {
          customerId,
          productId,
          shop,
        },
      });
      const response = json({
        message: "Product added to wishlist",
        method: "POST",
        wishlist: wishlist,
      });

      return cors(request, response);

    case "PATCH":
      return json({ message: "Success", method: "PATCH" });
    default:
      return new Response("Method not allowed", { status: 405 });
  }

  //unreachable code
  /* return json({ message: "Success" }); */
}
