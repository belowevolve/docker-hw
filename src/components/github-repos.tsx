"use client";

import { ExternalLinkIcon, GitForkIcon, StarIcon } from "lucide-react";
import * as React from "react";

import { Example } from "@/components/example";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Repo = {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
};

export function GithubRepos() {
  const [repos, setRepos] = React.useState<Repo[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchRepos() {
      try {
        setLoading(true);
        // Using the proxy defined in nginx.conf: /api/ -> https://api.github.com/
        const response = await fetch(
          "/api/orgs/ktsstudio/repos?sort=updated&per_page=6"
        );

        const contentType = response.headers.get("content-type");
        if (!response.ok) {
          throw new Error(
            `Failed to fetch repositories: ${response.statusText}`
          );
        }

        if (!contentType?.includes("application/json")) {
          throw new Error("Received non-JSON response from API");
        }

        const data = await response.json();
        setRepos(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchRepos();
  }, []);

  return (
    <Example containerClassName="md:col-span-2" title="KTS Studio Repositories">
      <div className="grid w-full gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading && (
          <div className="col-span-full py-10 text-center text-muted-foreground">
            Loading repositories...
          </div>
        )}

        {error && (
          <div className="col-span-full py-10 text-center text-destructive">
            Error: {error}
          </div>
        )}

        {!(loading || error) && repos.length === 0 && (
          <div className="col-span-full py-10 text-center text-muted-foreground">
            No repositories found.
          </div>
        )}

        {!(loading || error) &&
          repos.map((repo) => (
            <Card className="flex h-full flex-col" key={repo.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="line-clamp-1">{repo.name}</CardTitle>
                  <Badge variant="secondary">{repo.language || "N/A"}</Badge>
                </div>
                <CardDescription className="line-clamp-2 min-h-10">
                  {repo.description || "No description provided."}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto grow-0">
                <div className="flex items-center gap-4 text-muted-foreground text-sm">
                  <div className="flex items-center gap-1">
                    <StarIcon className="h-4 w-4" />
                    <span>{repo.stargazers_count}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <GitForkIcon className="h-4 w-4" />
                    <span>{repo.forks_count}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  nativeButton={false}
                  render={
                    <a
                      href={repo.html_url}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      View on GitHub
                      <ExternalLinkIcon className="ml-2 h-4 w-4" />
                    </a>
                  }
                  variant="outline"
                />
              </CardFooter>
            </Card>
          ))}
      </div>
    </Example>
  );
}
