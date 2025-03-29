import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }) => {
  const { shop, topic, payload } = await authenticate.webhook(request);
  
  console.log(`Received ${topic} webhook for ${shop}`);
  
  try {
    // Get the customer ID from the payload
    const customerId = payload.customer.id;
    
    // Delete all wishlist items for this customer
    const deleteResult = await db.wishlist.deleteMany({ 
      where: { 
        customerId: String(customerId),
        shop: shop 
      } 
    });
    
    console.log(`Deleted ${deleteResult.count} wishlist items for customer ${customerId} in shop ${shop}`);
  } catch (error) {
    console.error("Error redacting customer data:", error);
  }
  
  return new Response();
};
