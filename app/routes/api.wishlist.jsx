import { json } from "@remix-run/node";

export async function loader() {
  return json({
    ok: true,
    message: "Hello from the wishlist API route",
  });
}

// this is the code which are all realted to the how the data is going to be saved in the database. and handling of methods.

export async function action({ request }) {
  const method = request.method;

  switch (method) {
    case "POST":
      return json({ message: "Success", method: "POST" });
    case "PATCH":
      return json({ message: "Success", method: "PATCH" });
    default:
      return new Response("Method not allowed", { status: 405 });
  }
  //unreachable code
  /* return json({ message: "Success" }); */
}
