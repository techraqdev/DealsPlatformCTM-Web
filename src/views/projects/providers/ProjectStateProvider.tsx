import React, { createContext, FC, useEffect, useState } from 'react';
import { get } from '../../../common/api-middleware/commonData.api';
import { config } from '../../../common/environment';
import { ProjectContextState, ProjectListItemType } from '../projectModels';

const contextDefaultValues: ProjectContextState = {
  projects: [],
}; 

export const ProjectContext = createContext<ProjectContextState>(contextDefaultValues);

const ProjectStateProvider: FC = ({ children }) => {
  const [projects, setProjects] = useState<ProjectListItemType[]>(contextDefaultValues.projects);

  useEffect(() => {
    //getProjList();
  }, []);

  const getProjList = async () => {
    const result = await getProjects();
    const d = result.data;
    //console.log(d);
    setProjects(d);
  };

  const getProjects = async () => {
    const queryUrl = `${config.Resource_Url}api/project`;
    return await get(queryUrl, '');
  };

  return <ProjectContext.Provider value={{ projects }}>{children}</ProjectContext.Provider>;
};
export default ProjectStateProvider;
