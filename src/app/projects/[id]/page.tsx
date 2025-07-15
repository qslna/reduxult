import { notFound } from 'next/navigation';
import { PROJECTS, DESIGNERS } from '@/utils/constants';
import ProjectDetail from '@/components/projects/ProjectDetail';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export async function generateStaticParams() {
  return PROJECTS.map((project) => ({
    id: project.id,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const project = PROJECTS.find((p) => p.id === id);
  
  if (!project) {
    return {
      title: 'Project Not Found | REDUX',
    };
  }

  return {
    title: `${project.title} | REDUX`,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: Props) {
  const { id } = await params;
  const project = PROJECTS.find((p) => p.id === id);

  if (!project) {
    notFound();
  }

  // Get designer details for the project
  const projectDesigners = project.designers.map(designerId => 
    DESIGNERS.find(d => d.id === designerId)
  ).filter(Boolean);

  return <ProjectDetail project={project} designers={projectDesigners as typeof DESIGNERS} />;
}