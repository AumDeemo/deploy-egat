//server/api/admin/material.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;

  if (method === 'GET') {
    return await prisma.material.findMany();
  }

  if (method === 'POST') {
    const body = await readBody(event);
    return await prisma.material.create({ data: body });
  }

  if (method === 'PUT') {
    const body = await readBody(event);
    const { id, ...data } = body;
    return await prisma.material.update({ where: { id }, data });
  }

  if (method === 'DELETE') {
    const query = getQuery(event);
    const id = Number(query.id);


    return await prisma.material.delete({ where: { id } });
  }
  
});
