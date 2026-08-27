import { NextRequest } from "next/server";
import { setupAssociations } from "@/lib/db/models/associations";
import { ResponseHelper } from "@/lib/helpers/ResponseHelper";
import { verifyAuth } from "@/lib/middleware/auth";
import restaurantService from "@/lib/services/restaurantService";

let initialized = false;
function ensureDb() {
  if (!initialized) { setupAssociations(); initialized = true; }
}

export async function GET(request: NextRequest) {
  try {
    ensureDb();
    const restaurants = await restaurantService.getAllAsync();
    return ResponseHelper.success("Restaurants retrieved successfully", restaurants);
  } catch (error: any) {
    return ResponseHelper.error(error.message);
  }
}

export async function POST(request: NextRequest) {
  try {
    ensureDb();
    const user = await verifyAuth(request);
    if (user.role !== "Admin") return ResponseHelper.forbidden();

    const body = await request.json();
    const created = await restaurantService.createAsync(body);
    return ResponseHelper.created("Restaurant created successfully", created);
  } catch (error: any) {
    if (error.message === "No authentication token provided") return ResponseHelper.unauthorized();
    return ResponseHelper.badRequest(error.message);
  }
}
