import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async (req: VercelRequest, res: VercelResponse) => {
  if(req.method === 'GET') {
    const { pid } = req.body;
    res.status(200).send(pid);
  }
  else{
    res.status(400).send("Not a valid method");
  }
};