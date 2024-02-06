import { NextApiRequest, NextApiResponse } from "next";

export default async function webhookHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log(req.body);
  res.status(200).json({ message: "Webhook received" });
}
