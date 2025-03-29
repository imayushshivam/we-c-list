import { json } from "@remix-run/node";
import db from "../db.server.js";
import { cors } from "remix-utils/cors";

// This ensures that all responses have the proper CORS headers
const corsOptions = {
  origin: "*",
  methods: "GET, POST, PATCH, DELETE, OPTIONS",
  headers: "Content-Type",
};

// Handle GET requests to return wishlist items for a customer
export async function loader({ request }) {
  // Handle preflight OPTIONS request
  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  const url = new URL(request.url);
  const customerId = url.searchParams.get("customerId");
  const shop = url.searchParams.get("shop");
  const productId = url.searchParams.get("productId");

  if (!customerId || !shop || !productId) {
    const response = json({
      message: "Missing data. Required data: customerId, productId, shop",
      method: "GET",
    });
    return cors(request, response, corsOptions);
  }

  try {
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

    return cors(request, response, corsOptions);
  } catch (error) {
    console.error(`Error fetching wishlist data: ${error.message}`);
    const response = json({
      ok: false,
      message: "Error fetching wishlist data",
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
    }, { status: 500 });
    
    return cors(request, response, corsOptions);
  }
}

// Handle POST, PATCH, and DELETE requests to manipulate wishlist items
export async function action({ request }) {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
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
      message:
        "Missing data. Required data: customerId, productId, shop, _action",
      method: _action,
    });
    return cors(request, response, corsOptions);
  }

  try {
    let response;

    switch (_action) {
      case "CREATE":
        const existingItem = await db.wishlist.findFirst({
          where: {
            customerId,
            productId,
            shop,
          }
        });
        
        if (existingItem) {
          response = json({
            message: "Item already in wishlist",
            method: _action,
            wishlisted: true,
          });
          return cors(request, response, corsOptions);
        }
        
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
        return cors(request, response, corsOptions);

      case "PATCH":
        // Update wishlist item logic
        response = json({ message: "Success", method: "PATCH" });
        return cors(request, response, corsOptions);

      case "DELETE":
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
        return cors(request, response, corsOptions);

      default:
        response = new Response("Method Not Allowed", { status: 405 });
        return cors(request, response, corsOptions);
    }
  } catch (error) {
    console.error(`Error processing wishlist action: ${error.message}`);
    const response = json({
      ok: false,
      message: "Error processing request",
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
    }, { status: 500 });
    
    return cors(request, response, corsOptions);
  }
}
