import { NextRequest } from "next/server";
import { setupAssociations } from "@/lib/db/models/associations";
import { ResponseHelper } from "@/lib/helpers/ResponseHelper";
import { verifyAuth } from "@/lib/middleware/auth";
import menuItemService from "@/lib/services/menuItemService";

let initialized = false;
function ensureDb() {
  if (!initialized) { setupAssociations(); initialized = true; }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    ensureDb();
    const { id } = await params;
    const item = await menuItemService.getByIdAsync(parseInt(id));
    if (!item) return ResponseHelper.notFound("Menu item not found");
    return ResponseHelper.success("Menu item retrieved successfully", item);
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
    const updated = await menuItemService.updateAsync(parseInt(id), body);
    return ResponseHelper.success("Menu item updated successfully", updated);
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
    await menuItemService.deleteAsync(parseInt(id));
    return ResponseHelper.success("Menu item deleted successfully");
  } catch (error: any) {
    if (error.message === "No authentication token provided") return ResponseHelper.unauthorized();
    return ResponseHelper.error(error.message);
  }
}
