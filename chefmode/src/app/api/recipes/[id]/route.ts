import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// DELETE a recipe
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.recipe.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete recipe" }, { status: 500 });
  }
}

// PUT / UPDATE a recipe
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, category, prepTime, servings, notes, ingredients, steps } = body;

    const updatedRecipe = await prisma.recipe.update({
      where: { id },
      data: {
        title,
        category,
        prepTime,
        servings,
        notes,
        ingredients,
        steps,
      },
    });

    return NextResponse.json(updatedRecipe);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update recipe" }, { status: 500 });
  }
}