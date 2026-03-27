import { ProjectEntity } from "../entities/project.entity";

export class PortfolioUseCase {
    /**
     * Extracts bullet points if the raw description uses bullet format markdown (-)
     */
    static parseProjectDescription(rawContent: string): string[] {
        if (!rawContent) return [];
        return rawContent
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.startsWith('-'))
            .map(line => line.replace(/^-\s*/, ''));
    }

    /**
     * Extracts a raw github user content repository url from a standard github url
     * Ex: https://github.com/aaditx23/krazyalarm -> https://raw.githubusercontent.com/aaditx23/krazyalarm/main/screenshots/
     */
    static getScreenshotsBaseUrl(githubUrl: string): string {
        try {
           const parsed = new URL(githubUrl);
           if(parsed.hostname === "github.com") {
               return `https://raw.githubusercontent.com${parsed.pathname}/main/screenshots/`;
           }
           return '';
        } catch(e) {
            return '';
        }
    }

    /**
     * Maps convex DB responses to clean architecture entities
     */
    static mapConvexProjectToEntity(convexProj: any): ProjectEntity {
        return {
            id: convexProj._id,
            userId: convexProj.userId,
            title: convexProj.title,
            category: convexProj.category,
            description: convexProj.description,
            githubUrl: convexProj.githubUrl,
            liveLink: convexProj.liveLink,
            order: convexProj.order,
            screenshotsUrlBase: this.getScreenshotsBaseUrl(convexProj.githubUrl),
            bulletPoints: this.parseProjectDescription(convexProj.description)
        };
    }
}
