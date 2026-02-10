import { Path } from "react-hook-form";

export function makeName<T>(prefix: string, name: string): Path<T> {
  return `${prefix}.${name}` as Path<T>;
}
