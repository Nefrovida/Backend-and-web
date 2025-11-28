import z from "zod";

export const getFeedSchema = z.object({
  page: z.preprocess(
    (v) => Number(v ?? 0),
    z.number().int().nonnegative().default(0)
  ),
  forumId: z
    .preprocess((v) => Number(v ?? 0), z.number().int().nonnegative())
    .optional(),
});
