// Import necessary modules
import { useLoaderData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";

export const loader = async ({ request }) => {
  const { authenticate, billing, session } = await import("../shopify.server");

  // Authenticate the request
  const shopSession = await authenticate(request);
  const { shop } = shopSession;
  const myShop = shop.replace(".myshopify.com", "");

  await billing.require({
    plans: ["MONTHLY_PLAN"],
    onFailure: async () =>
      billing.request({
        plan: "MONTHLY_PLAN",
        isTest: true,
        returnUrl: `https://admin.shopify.com/store/${myShop}/apps/${process.env.APP_NAME}/app/pricing`,
      }),
  });

  return json({ shop: myShop });
};

export default function UpgradePage() {
  const { shop } = useLoaderData();

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Upgrade Your Plan</h1>

      <p>
        Welcome to the upgrade page for <strong>{shop}.myshopify.com</strong>.
      </p>

      <p>
        To access all the premium features, you'll need to upgrade to our
        Monthly Plan.
      </p>

      <button
        onClick={() => {
          alert("Redirecting to upgrade plan...");
        }}
        style={{
          padding: "10px 20px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Upgrade Now
      </button>
    </div>
  );
}
