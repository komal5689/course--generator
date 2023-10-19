// import { z } from "zod";

// export const createChaptersSchema = z.object({
//   title: z.string().min(3).max(100),
//   units: z.array(z.string()),
// });

import { z } from "zod";

export const createChaptersSchema = z.object({
  title: z.string().min(3).max(100),
  units: z.array(z.string()),
  courseCode: z.string(), // New field: Course Code
  branch: z.string(),     // New field: Branch
  category: z.string(),   // New field: Category
});