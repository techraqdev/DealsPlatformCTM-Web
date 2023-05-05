import React, { FC } from 'react';
import ProjectList from './ProjectList';
import ProjectStateProvider from './providers/ProjectStateProvider';

const ProjectContainer: FC = () => {
  return (
    <div>
      <ProjectStateProvider>
        <ProjectList />
      </ProjectStateProvider>
    </div>
  );
};
export default ProjectContainer;
