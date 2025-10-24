import { Edge, Node } from "@xyflow/react";

export interface IProjectState {
  projects: IProject[];
  currentId: string;
}

export interface IProject {
  id: string;
  name: string;
  status: string;
  nodes?: Node[];
  edges?: Edge[]
}
