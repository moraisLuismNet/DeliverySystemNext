import { NextRequest } from "next/server";
import { setupAssociations } from "@/lib/db/models/associations";
import { ResponseHelper } from "@/lib/helpers/ResponseHelper";
import { verifyAuth } from "@/lib/middleware/auth";
import restaurantService from "@/lib/services/restaurantService";

let initialized = false;
function ensureDb() {
  if (!initialized) { setupAssociations(); initialized = true; }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    ensureDb();
    const { id } = await params;
    const restaurant = await restaurantService.getByIdAsync(parseInt(id));
    if (!restaurant) return ResponseHelper.notFound("Restaurant not found");
    return ResponseHelper.success("Restaurant retrieved successfully", restaurant);
  } catch (error: any) {
    return ResponseHelper.error(error.message);
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    ensureDb();
    const user = await verifyAuth(request);
    if (user.role !== "Admin") return ResponseHelper.forbidden();

    const { id } = await params;
    const body = await request.json();
    const updated = await restaurantService.updateAsync(parseInt(id), body);
    return ResponseHelper.success("Restaurant updated successfully", updated);
  } catch (error: any) {
    if (error.message === "No authentication token provided") return ResponseHelper.unauthorized();
    return ResponseHelper.error(error.message);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    ensureDb();
    const user = await verifyAuth(request);
    if (user.role !== "Admin") return ResponseHelper.forbidden();

    const { id } = await params;
    await restaurantService.deleteAsync(parseInt(id));
    return ResponseHelper.success("Restaurant deactivated successfully");
  } catch (error: any) {
    if (error.message === "No authentication token provided") return ResponseHelper.unauthorized();
    return ResponseHelper.error(error.message);
  }
}
