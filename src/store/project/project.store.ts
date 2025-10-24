import { createEvent, createStore } from "effector";
import { IProject, IProjectState } from "./project.type";
import { DockerComposeConfigWithCoords, ServiceConfigWithCoords } from "types/docker-compose.type";

const STORAGE_KEY = "projects";

// Загрузка из localStorage при инициализации
const loadFromStorage = (): IProjectState => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? { currentId: "", projects: JSON.parse(stored) } : { currentId: "", projects: [] };
};

// Сохранение в localStorage
const saveToStorage = (projects: IProject[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
};

// События
export const addNewProject = createEvent<IProject>();
export const deleteProject = createEvent<string>();
export const updateProject = createEvent<IProject>();
export const selectProject = createEvent<string>();

export const updateDrockerSevices = createEvent<Record<string, ServiceConfigWithCoords>>();

// Стор
export const $project = createStore<IProjectState>(loadFromStorage())
  .on(addNewProject, (project, newProject) => {
    const updatedProjects = [...project.projects, newProject];
    saveToStorage(updatedProjects);
    return { ...project, projects: updatedProjects };
  })
  .on(deleteProject, (project, projectId) => {
    const updatedProjects = project.projects.filter((project) => project.id !== projectId);
    saveToStorage(updatedProjects);
    return { ...project, projects: updatedProjects };
  })
  .on(updateProject, (project, updatedProject) => {
    const updatedProjects = project.projects.map((project) =>
      project.id === updatedProject.id ? updatedProject : project
    );
    saveToStorage(updatedProjects);
    return { ...project, projects: updatedProjects };
  })
  .on(updateDrockerSevices, (project, services) => {
    const updatedProjects = project.projects.map((prj) =>
      prj.id === project.currentId ? { ...prj, docker: { ...prj.docker, services: services  } } : prj
    );
    saveToStorage(updatedProjects);
    return { ...project, projects: updatedProjects };
  })
  .on(selectProject, (project, id) => {
    return { ...project, currentId: id };
  });
