import { json } from "@remix-run/node";

export const loader = async () => {
  return json({});
};

export default function SuccessUpgrade() {
  return (
    <div>
      <h1>Upgrade Successful!</h1>
      <p>
        Thank you for upgrading your subscription. Your new plan is now active.
      </p>
      <a href="/">Return to the home page</a>
    </div>
  );
}
