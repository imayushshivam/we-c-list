import { json } from "@remix-run/node";

export const loader = async () => {
  // Optionally load data or perform actions here
  return json({});
};

export default function ErrorPage() {
  return (
    <div>
      <h1>Something Went Wrong</h1>
      <p>
        We encountered an error while processing your upgrade. Please try again
        later or contact support if the issue persists.
      </p>
      <a href="/">Return to the home page</a>
    </div>
  );
}
