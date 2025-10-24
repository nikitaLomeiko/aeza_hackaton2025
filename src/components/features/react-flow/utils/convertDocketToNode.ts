import { Node } from "@xyflow/react";
import { DockerComposeConfigWithCoords } from "types/docker-compose.type";

export const convertDockerToNode = (docker: DockerComposeConfigWithCoords) => {
  const nodes: Node[] = [];
  const serivces = docker.services;

  let xoffset = 0;
  let yoffset = 0;

  serivces.forEach((item) => {
    nodes.push({
      id: item.id,
      position: { x: item.x + xoffset, y: item.y + yoffset },
      type: "service",
      data: { ...item },
    });

    xoffset += 150;
    yoffset += 150;
  });

  return nodes;
};
