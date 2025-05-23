import { z, ZodType } from "zod";

export const validate = <T extends ZodType<any, any, any>>({
  schema,
  data,
}: {
  schema: T;
  data: unknown;
}): z.infer<T> => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(error.issues[0].message);
    }

    throw new Error("Validation error");
  }
};
