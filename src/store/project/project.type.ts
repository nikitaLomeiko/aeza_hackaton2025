import { DockerComposeConfigWithCoords } from "types/docker-compose.type";

export interface IProjectState {
  projects: IProject[];
  currentId: string;
}

export interface IProject {
  id: string;
  name: string;
  status: string;
  docker?: DockerComposeConfigWithCoords;
}
