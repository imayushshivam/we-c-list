import { redirect } from "@remix-run/node";
import { authenticate, MONTHLY_PLAN, ANNUAL_PLAN } from "../shopify.server";

export const loader = async ({ request }) => {
  try {
    const { billing, session } = await authenticate.admin(request);
    let { shop } = session;
    let myShop = shop.replace(".myshopify.com", "");
    console.log("myShop: ", myShop);

    await billing.require({
      plans: [MONTHLY_PLAN, ANNUAL_PLAN],
      onFailure: async () =>
        billing.request({
          plan: MONTHLY_PLAN,
          isTest: true,
          returnUrl: `https://admin.shopify.com/store/${myShop}/apps/${process.env.APP_NAME}/app/pricing`,
        }),
    });

    return redirect(`/app.success-upgrade`);
  } catch (error) {
    console.error("Upgrade failed: ", error);
    return redirect(`/app.error`);
  }
};
