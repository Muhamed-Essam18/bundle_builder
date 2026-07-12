import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET() {
	try {
		const db = await getDb();

		const [steps, products] = await Promise.all([
			db.collection("Steps").find({}).toArray(),
			db.collection("Products").find({}).toArray(),
		]);

		return NextResponse.json({ steps, products }, { status: 200 });
	} catch (error) {
		console.error("Failed to fetch steps and products", error);

		return NextResponse.json(
			{ error: "Failed to fetch data from database" },
			{ status: 500 }
		);
	}
}
