import { authenticate } from "../shopify.server.js";
import db from "../db.server.js";
import { verifyHmac } from "../shopify-webhook.js";

export const action = async ({ request }) => {
  try {
    // Verify HMAC signature
    const isValidHmac = await verifyHmac(request);
    if (!isValidHmac) {
      console.warn("Invalid HMAC signature");
      return new Response("Invalid HMAC signature", { status: 403 });
    }

    const { topic, shop, session, admin } = await authenticate.webhook(request);

    if (!admin && topic !== "SHOP_REDACT") {
      // The admin context isn't returned if the webhook fired after a shop was uninstalled.
      // The SHOP_REDACT webhook will be fired up to 48 hours after a shop uninstalls the app.
      // Because of this, no admin context is available.
      console.warn(`Unauthorized access attempt for topic: ${topic}`);
      return new Response("Unauthorized", { status: 403 });
    }
    // The topics handled here should be declared in the shopify.app.toml.
    // More info: https://shopify.dev/docs/apps/build/cli-for-apps/app-configuration

    switch (topic) {
      case "APP_UNINSTALLED":
        if (session) {
          await db.session.deleteMany({ where: { shop } });
        }
        console.info(`Handled APP_UNINSTALLED for shop: ${shop}`);
        break;
      case "CUSTOMERS_DATA_REQUEST":
      case "CUSTOMERS_REDACT":
      case "SHOP_REDACT":
        // Add any necessary logic for these topics if applicable
        console.info(`Handled topic: ${topic}`);
        break;
      default:
        console.warn(`Unhandled webhook topic: ${topic}`);
        return new Response("Unhandled webhook topic", { status: 404 });
    }

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error(`Error handling webhook: ${error.message}`);
    return new Response("Error processing webhook", { status: 500 });
  }
};
