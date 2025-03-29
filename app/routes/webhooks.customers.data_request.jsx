import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }) => {
  const { shop, topic, payload } = await authenticate.webhook(request);
  
  console.log(`Received ${topic} webhook for ${shop}`);
  
  try {
    // Get the customer ID from the payload
    const customerId = payload.customer.id;
    
    // Query the database for all wishlist items belonging to this customer
    const customerData = await db.wishlist.findMany({
      where: { 
        customerId: String(customerId),
        shop: shop 
      }
    });
    
    // Format the data for the response
    const customerWishlistData = {
      customer_id: customerId,
      wishlist_items: customerData.map(item => ({
        product_id: item.productId,
        added_at: item.createdAt
      }))
    };
    
    // Log the data being returned
    console.log(`Customer data request fulfilled for customer ${customerId} in shop ${shop}`);
    
    // In production, you should return this data to Shopify
    // This is typically done by sending the data to a designated endpoint or email
    // For now, we'll just log it
    console.log("Customer Data:", JSON.stringify(customerWishlistData, null, 2));
  } catch (error) {
    console.error("Error processing data request:", error);
  }
  
  // Return a 200 response to acknowledge receipt
  return new Response();
};
