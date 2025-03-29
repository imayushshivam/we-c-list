import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }) => {
  const { shop, topic, payload } = await authenticate.webhook(request);
  
  console.log(`Received ${topic} webhook for ${shop}`);
  
  // For GDPR compliance, we should delete all shop data
  // The Shopify recommendation is to wait 48 hours before deletion
  // For simplicity, we'll implement immediate deletion here
  try {
    const shopDomain = payload.shop_domain;
    
    // Delete all wishlist items for this shop
    const deleteWishlistResult = await db.wishlist.deleteMany({ 
      where: { 
        shop: shopDomain
      } 
    });
    
    // Delete shop settings if any
    const deleteSettingsResult = await db.settings.deleteMany({
      where: {
        shop: shopDomain
      }
    });
    
    // Delete sessions (similar to app uninstalled webhook)
    const deleteSessionsResult = await db.session.deleteMany({ 
      where: { 
        shop: shopDomain
      } 
    });
    
    console.log(`For shop ${shopDomain}:`);
    console.log(`- Deleted ${deleteWishlistResult.count} wishlist items`);
    console.log(`- Deleted ${deleteSettingsResult.count} settings records`);
    console.log(`- Deleted ${deleteSessionsResult.count} session records`);
    
    // In a production environment, you might want to:
    // 1. Create a job to delete this data after 48 hours
    // 2. Mark the data for deletion and have a scheduled process handle it
  } catch (error) {
    console.error("Error redacting shop data:", error);
  }
  
  return new Response();
};
