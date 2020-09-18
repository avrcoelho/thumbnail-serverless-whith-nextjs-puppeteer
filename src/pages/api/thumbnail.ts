import { NextApiRequest, NextApiResponse } from "next";
import { getScreenshot } from "./_lib/chromium";
import getThubnailTemplate from "./_lib/thumbTemplate";

const isDev = !process.env.AWS_REGION;

export default async function (
  request: NextApiRequest,
  response: NextApiResponse
) {
  try {
    const title = String(request.query.title);

    if (!title) {
      throw new Error("Title is required");
    }

    const html = getThubnailTemplate(title);

    const file = await getScreenshot(html, isDev);

    response.setHeader("Content-Type", "image/png");
    response.setHeader(
      "Cache-Control",
      "public, immutable, no-transform, s-maxage=31536000, max-age=31536000"
    );

    return response.end(file);
  } catch (error) {
    console.log(error);

    return response.status(500).send("Internal server error");
  }
}
