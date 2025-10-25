import { ReactNode } from "react";

export type RouterType = {
  path: string;
  component: ReactNode;
  childRoutes?: RouterType[];
};
