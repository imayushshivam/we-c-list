import crypto from "crypto";

export const verifyHmac = async (request) => {
  const hmacHeader = request.headers.get("x-shopify-hmac-sha256");
  const body = await request.text();
  const secret = process.env.SHOPIFY_API_SECRET;

  // Created HMAC signature
  const hash = crypto
    .createHmac("sha256", secret)
    .update(body, "utf8", "hex")
    .digest("base64");

  // Compare the computed HMAC with the one from Shopify
  return hash === hmacHeader;
};
