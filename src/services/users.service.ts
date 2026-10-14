// src/services/users.service.ts
import { count, eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema";

// Columns safe to send to the client
const publicColumns = {
	id: users.id,
	name: users.name,
	email: users.email,
	createdAt: users.createdAt,
};

export const findAll = async ({
	page,
	limit,
}: {
	page: number;
	limit: number;
}) => {
	const items = await db
		.select(publicColumns)
		.from(users)
		.limit(limit)
		.offset((page - 1) * limit);

	const [{ value: total }] = await db.select({ value: count() }).from(users);

	return { items, total };
};

export const findById = async (id: number) => {
	const [user] = await db
		.select(publicColumns)
		.from(users)
		.where(eq(users.id, id));
	return user ?? null;
};

export const findByEmail = async (email: string) => {
	const [user] = await db
		.select(publicColumns)
		.from(users)
		.where(eq(users.email, email));
	return user ?? null;
};

export const create = async (data: {
	name: string;
	email: string;
	password: string;
}) => {
	const [user] = await db.insert(users).values(data).returning(publicColumns);
	return user;
};

export const update = async (
	id: number,
	data: Partial<{ name: string; email: string }>,
) => {
	const [user] = await db
		.update(users)
		.set(data)
		.where(eq(users.id, id))
		.returning(publicColumns);
	return user ?? null;
};

export const remove = async (id: number) => {
	const [deleted] = await db
		.delete(users)
		.where(eq(users.id, id))
		.returning({ id: users.id });
	return !!deleted;
};
