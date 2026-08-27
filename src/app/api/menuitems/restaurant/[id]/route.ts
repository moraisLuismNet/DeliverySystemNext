import { NextRequest } from "next/server";
import { setupAssociations } from "@/lib/db/models/associations";
import { ResponseHelper } from "@/lib/helpers/ResponseHelper";
import menuItemService from "@/lib/services/menuItemService";

let initialized = false;
function ensureDb() {
  if (!initialized) { setupAssociations(); initialized = true; }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    ensureDb();
    const { id } = await params;
    const items = await menuItemService.getByRestaurantIdAsync(parseInt(id));
    return ResponseHelper.success("Menu items retrieved successfully", items);
  } catch (error: any) {
    return ResponseHelper.error(error.message);
  }
}
