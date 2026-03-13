import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "../db";
import { terms } from "../db/schema";
import { eq, asc, sql } from "drizzle-orm";
import { auth } from "../lib/auth";

const termSchema = z.object({
  name: z.string().min(1).max(255),
  definition: z.string().min(1),
  imageUrl: z.string().url().optional(),
});

const app = new Hono();

app.get("/", async (c) => {
  const allTerms = await db.query.terms.findMany({
    orderBy: [sql`LOWER(${terms.name})`],
  });
  return c.json(allTerms);
});

app.get("/:id", async (c) => {
  const id = c.req.param("id");
  const term = await db.query.terms.findFirst({
    where: eq(terms.id, id),
  });
  
  if (!term) {
    return c.json({ error: "Term not found" }, 404);
  }
  
  return c.json(term);
});

app.post("/", zValidator("json", termSchema), async (c) => {
  const session = await auth.api.getSession(c.req.raw);
  
  if (!session) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  
  const data = c.req.valid("json");
  
  const [newTerm] = await db.insert(terms).values({
    name: data.name,
    definition: data.definition,
    imageUrl: data.imageUrl,
  }).returning();
  
  return c.json(newTerm, 201);
});

app.put("/:id", zValidator("json", termSchema), async (c) => {
  const session = await auth.api.getSession(c.req.raw);
  
  if (!session) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  
  const id = c.req.param("id");
  const data = c.req.valid("json");
  
  const [updatedTerm] = await db
    .update(terms)
    .set({
      name: data.name,
      definition: data.definition,
      imageUrl: data.imageUrl,
      updatedAt: sql`NOW()`,
    })
    .where(eq(terms.id, id))
    .returning();
  
  if (!updatedTerm) {
    return c.json({ error: "Term not found" }, 404);
  }
  
  return c.json(updatedTerm);
});

app.delete("/:id", async (c) => {
  const session = await auth.api.getSession(c.req.raw);
  
  if (!session) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  
  const id = c.req.param("id");
  
  const [deletedTerm] = await db
    .delete(terms)
    .where(eq(terms.id, id))
    .returning();
  
  if (!deletedTerm) {
    return c.json({ error: "Term not found" }, 404);
  }
  
  return c.json({ message: "Term deleted successfully" });
});

export default app;