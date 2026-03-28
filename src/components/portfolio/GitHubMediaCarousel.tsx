"use client";

import { useEffect, useState } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, CarouselDots } from "@/components/ui/carousel";

interface GitHubFile {
  name: string;
  download_url: string;
  type: string;
}

interface GitHubMediaCarouselProps {
  githubUrl: string;         // e.g. https://github.com/aaditx23/krazyalarm
  screenshotsPath: string;   // e.g. "screenshots"
}

function parseGitHubApiUrl(githubUrl: string, screenshotsPath: string): string | null {
  try {
    const cleanRepo = githubUrl.replace(/\.git$/, "").replace(/\/$/, "");
    const repoMatch = cleanRepo.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!repoMatch) return null;
    const [, owner, repo] = repoMatch;

    // If screenshotsPath is a full GitHub URL (e.g. pasted tree URL), extract the folder path
    let folderPath = screenshotsPath.trim();
    const treeMatch = folderPath.match(/github\.com\/[^/]+\/[^/]+\/tree\/[^/]+\/(.+)/);
    if (treeMatch) {
      folderPath = treeMatch[1]; // e.g. "screenshots"
    }

    return `https://api.github.com/repos/${owner}/${repo}/contents/${folderPath}`;
  } catch {
    return null;
  }
}

const IMAGE_EXTS = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
const VIDEO_EXTS = [".mp4", ".webm", ".mov"];

function isImage(name: string) { return IMAGE_EXTS.some((e) => name.toLowerCase().endsWith(e)); }
function isVideo(name: string) { return VIDEO_EXTS.some((e) => name.toLowerCase().endsWith(e)); }

export default function GitHubMediaCarousel({ githubUrl, screenshotsPath }: GitHubMediaCarouselProps) {
  const [media, setMedia] = useState<GitHubFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const apiUrl = parseGitHubApiUrl(githubUrl, screenshotsPath);
    if (!apiUrl) {
      setError("Invalid GitHub URL");
      setLoading(false);
      return;
    }
    fetch(apiUrl, { headers: { Accept: "application/vnd.github.v3+json" } })
      .then((r) => r.json())
      .then((data: GitHubFile[]) => {
        if (!Array.isArray(data)) { setError("Folder not found or private repo"); return; }
        const mediaFiles = data.filter((f) => isImage(f.name) || isVideo(f.name));
        mediaFiles.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
        setMedia(mediaFiles);
      })
      .catch(() => setError("Failed to load media"))
      .finally(() => setLoading(false));
  }, [githubUrl, screenshotsPath]);

  if (loading) return (
    <div className="aspect-video w-full bg-muted animate-pulse rounded-lg flex items-center justify-center text-xs text-muted-foreground">
      Loading screenshots...
    </div>
  );

  if (error || media.length === 0) return null;

  return (
    <div className="w-full">
      <Carousel className="w-full">
        <CarouselContent>
          {media.map((file) => (
            <CarouselItem key={file.name}>
              {isVideo(file.name) ? (
                <div className="h-96 w-full flex items-center justify-center bg-black rounded-lg overflow-hidden">
                  <video
                    src={file.download_url}
                    className="h-full w-auto max-w-full rounded-lg"
                    controls
                    muted
                    loop
                    playsInline
                  />
                </div>
              ) : (
                <div className="h-96 w-full flex items-center justify-center bg-muted rounded-lg overflow-hidden">
                  <img
                    src={file.download_url}
                    alt={file.name}
                    className="h-full w-auto max-w-full object-contain rounded-lg"
                    loading="lazy"
                  />
                </div>
              )}
            </CarouselItem>
          ))}
        </CarouselContent>
        {media.length > 1 && (
          <>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </>
        )}
        <CarouselDots />
      </Carousel>
    </div>
  );
}
