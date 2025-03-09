import { json } from "@remix-run/node";
import db from "../db.server.js";

export async function loader() {
  // Check database connection
  try {
    await db.$queryRaw`SELECT 1`;
    
    return json({
      status: "ok",
      message: "Service is healthy",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Health check failed:", error);
    
    return json({
      status: "error",
      message: "Database connection failed",
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
