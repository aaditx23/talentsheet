"use client";

import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselDots,
} from "@/components/ui/carousel";

interface MediaFile {
  name: string;
  downloadUrl: string;
}

const IMAGE_EXTS = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
const VIDEO_EXTS = [".mp4", ".webm", ".mov"];
const isImage = (name: string) =>
  IMAGE_EXTS.some((e) => name.toLowerCase().endsWith(e));
const isVideo = (name: string) =>
  VIDEO_EXTS.some((e) => name.toLowerCase().endsWith(e));
const isMedia = (name: string) => isImage(name) || isVideo(name);

/** Extract owner/repo and detect platform from a GitHub or GitLab URL */
function parseRepoUrl(
  repoUrl: string,
): { host: "github" | "gitlab"; owner: string; repo: string } | null {
  const clean = repoUrl.replace(/\.git$/, "").replace(/\/$/, "");
  const ghMatch = clean.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (ghMatch) return { host: "github", owner: ghMatch[1], repo: ghMatch[2] };
  const glMatch = clean.match(/gitlab\.com\/([^/]+)\/([^/]+)/);
  if (glMatch) return { host: "gitlab", owner: glMatch[1], repo: glMatch[2] };
  return null;
}

/** Strip full tree URLs down to just the folder path */
function normalisePath(raw: string): string {
  const treeMatch = raw.match(
    /(?:github|gitlab)\.com\/[^/]+\/[^/]+\/(?:tree|-\/tree)\/[^/]+\/(.+)/,
  );
  return treeMatch ? treeMatch[1] : raw.trim();
}

async function fetchGitHubMedia(
  owner: string,
  repo: string,
  folderPath: string,
): Promise<MediaFile[]> {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${folderPath}`,
    { headers: { Accept: "application/vnd.github.v3+json" } },
  );
  const data = await res.json();
  if (!Array.isArray(data)) throw new Error("Not found");
  return data
    .filter((f: any) => isMedia(f.name))
    .map((f: any) => ({ name: f.name, downloadUrl: f.download_url }));
}

async function fetchGitLabMedia(
  owner: string,
  repo: string,
  folderPath: string,
): Promise<MediaFile[]> {
  const projectId = encodeURIComponent(`${owner}/${repo}`);
  const res = await fetch(
    `https://gitlab.com/api/v4/projects/${projectId}/repository/tree?path=${encodeURIComponent(folderPath)}&ref=HEAD&per_page=100`,
  );
  const data = await res.json();
  if (!Array.isArray(data)) throw new Error("Not found");
  return data
    .filter((f: any) => f.type === "blob" && isMedia(f.name))
    .map((f: any) => ({
      name: f.name,
      downloadUrl: `https://gitlab.com/${owner}/${repo}/-/raw/HEAD/${f.path}`,
    }));
}

interface RepoMediaCarouselProps {
  repoUrl: string;
  screenshotsPath: string;
}

export default function RepoMediaCarousel({
  repoUrl,
  screenshotsPath,
}: RepoMediaCarouselProps) {
  const [media, setMedia] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const parsed = parseRepoUrl(repoUrl);
    const folder = normalisePath(screenshotsPath);
    if (!parsed || !folder) {
      setLoading(false);
      return;
    }

    const { host, owner, repo } = parsed;
    const fetcher = host === "github" ? fetchGitHubMedia : fetchGitLabMedia;

    fetcher(owner, repo, folder)
      .then((files) => {
        files.sort((a, b) =>
          a.name.localeCompare(b.name, undefined, { numeric: true }),
        );
        setMedia(files);
      })
      .catch(() => setMedia([]))
      .finally(() => setLoading(false));
  }, [repoUrl, screenshotsPath]);

  if (loading)
    return (
      <div style={{paddingLeft: '0.8rem', paddingRight: '0.8rem'}}>
        <div className="h-96 bg-muted animate-pulse rounded-lg flex items-center justify-center text-xs text-muted-foreground" >
          Loading screenshots...
        </div>
      </div>
    );

  if (media.length === 0) return null;

  return (
    <div className="w-full rounded-lg"  style={{paddingLeft: '0.8rem', paddingRight: '0.8rem'}}>
      <Carousel className="w-full rounded-lg">
        <CarouselContent>
          {media.map((file) => (
            <CarouselItem key={file.name}>
              {isVideo(file.name) ? (
                <div className="h-96 w-full flex items-center justify-center bg-black rounded-lg overflow-hidden">
                  <video
                    src={file.downloadUrl}
                    className="h-full w-auto max-w-full rounded-lg"
                    controls
                    muted
                    loop
                    playsInline
                  />
                </div>
              ) : (
                // Cinematic fill: blurred copy of the image fills the background
                // so portrait images don't get jarring flat-color side gaps
                <div className="h-96 w-full overflow-hidden relative rounded-lg">
                  <div
                    className="absolute inset-0 bg-cover bg-center scale-110 rounded-lg blur-2xl opacity-60"
                    style={{ backgroundImage: `url(${file.downloadUrl})` }}
                  />
                  <img
                    src={file.downloadUrl}
                    alt={file.name}
                    className="relative z-10 h-full w-auto max-w-full rounded-lg object-contain mx-auto block"
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
