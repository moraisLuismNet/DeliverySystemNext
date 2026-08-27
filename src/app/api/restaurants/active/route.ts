import { NextRequest } from "next/server";
import { setupAssociations } from "@/lib/db/models/associations";
import { ResponseHelper } from "@/lib/helpers/ResponseHelper";
import restaurantService from "@/lib/services/restaurantService";

let initialized = false;
function ensureDb() {
  if (!initialized) { setupAssociations(); initialized = true; }
}

export async function GET(request: NextRequest) {
  try {
    ensureDb();
    const restaurants = await restaurantService.getActiveAsync();
    return ResponseHelper.success("Active restaurants retrieved successfully", restaurants);
  } catch (error: any) {
    return ResponseHelper.error(error.message);
  }
}
