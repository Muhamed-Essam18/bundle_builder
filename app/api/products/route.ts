import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import fallbackData from "@/data/dataFallback.json";

const fallbackSteps = fallbackData.steps;
const fallbackProducts = fallbackData.products;
export async function GET() {
	try {
		const db = await getDb();

		const [steps, products] = await Promise.all([
			db.collection("Steps").find({}).toArray(),
			db.collection("Products").find({}).toArray(),
		]);

		return NextResponse.json({ steps, products }, { status: 200 });
	} catch (error) {
		console.error("Failed to fetch steps and products from MongoDB. Using fallback JSON.", error);

		return NextResponse.json(
			{ steps: fallbackSteps, products: fallbackProducts },
			{ status: 200 }
		);
	}
}
