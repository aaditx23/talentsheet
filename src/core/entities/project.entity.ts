export interface ProjectEntity {
    id: string;
    userId: string;
    title: string;
    category: string;
    description: string;
    githubUrl: string;
    liveLink?: string;
    order: number;
    
    // Abstracted fields derived specifically in the use case layer
    screenshotsUrlBase?: string; 
    bulletPoints?: string[]; // Derived from parsing markdown list `- item` in description
}
