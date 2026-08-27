import { NextRequest } from "next/server";
import { setupAssociations } from "@/lib/db/models/associations";
import { ResponseHelper } from "@/lib/helpers/ResponseHelper";
import { verifyAuth } from "@/lib/middleware/auth";
import categoryService from "@/lib/services/categoryService";

let initialized = false;
function ensureDb() {
  if (!initialized) { setupAssociations(); initialized = true; }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    ensureDb();
    const { id } = await params;
    const category = await categoryService.getByIdAsync(parseInt(id));
    if (!category) return ResponseHelper.notFound("Category not found");
    return ResponseHelper.success("Category retrieved successfully", category);
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
    const updated = await categoryService.updateAsync(parseInt(id), body);
    return ResponseHelper.success("Category updated successfully", updated);
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
    await categoryService.deleteAsync(parseInt(id));
    return ResponseHelper.success("Category deactivated successfully");
  } catch (error: any) {
    if (error.message === "No authentication token provided") return ResponseHelper.unauthorized();
    return ResponseHelper.error(error.message);
  }
}
