import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

// GET: Fetch all recipes from Vercel Postgres
export async function GET() {
  try {
    const recipes = await (prisma as any).recipe.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(recipes);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch recipes" }, { status: 500 });
  }
}

// POST: Add a new sticky note recipe
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newRecipe = await (prisma as any).recipe.create({
      data: {
        title: body.title,
        category: body.category,
        prepTime: body.prepTime,
        servings: body.servings,
        notes: body.notes || null,
        ingredients: body.ingredients,
        steps: body.steps,
      },
    });
    return NextResponse.json(newRecipe, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create recipe" }, { status: 500 });
  }
}