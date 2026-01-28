"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import {
  CalendarIcon,
  ExternalLinkIcon,
  GitForkIcon,
  Loader2Icon,
  StarIcon,
} from "lucide-react";
import * as React from "react";
import { useInView } from "react-intersection-observer";

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
import { Skeleton } from "@/components/ui/skeleton";

type Repo = {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  updated_at: string;
  topics: string[];
  owner: {
    login: string;
    avatar_url: string;
  };
};

const REPOS_PER_PAGE = 6;

async function fetchRepos({ pageParam = 1 }): Promise<Repo[]> {
  const response = await fetch(
    `/api/orgs/ktsstudio/repos?sort=updated&per_page=${REPOS_PER_PAGE}&page=${pageParam}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch repositories: ${response.statusText}`);
  }

  const contentType = response.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    throw new Error("Received non-JSON response from API");
  }

  return response.json();
}

export function GithubRepos() {
  const { ref, inView } = useInView();

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["repos"],
    queryFn: fetchRepos,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === REPOS_PER_PAGE
        ? allPages.length + 1
        : undefined;
    },
  });

  React.useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allRepos = data?.pages.flat() || [];

  return (
    <Example containerClassName="md:col-span-2" title="KTS Studio Repositories">
      <div className="grid w-full gap-4 md:grid-cols-2 lg:grid-cols-3">
        {status === "pending" &&
          Array.from({ length: 6 }).map((_, i) => (
            <Card className="flex h-full flex-col" key={i}>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-5 w-16" />
                </div>
                <div className="mt-2 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              </CardHeader>
              <CardContent className="mt-auto grow-0">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}

        {status === "error" && (
          <div className="col-span-full py-10 text-center text-destructive">
            Error: {(error as Error).message}
          </div>
        )}

        {status === "success" && allRepos.length === 0 && (
          <div className="col-span-full py-10 text-center text-muted-foreground">
            No repositories found.
          </div>
        )}

        {allRepos.map((repo) => (
          <Card className="flex h-full flex-col" key={repo.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col gap-1">
                  <CardTitle className="line-clamp-1">{repo.name}</CardTitle>
                  <div className="flex items-center gap-2 text-muted-foreground text-xs">
                    <img
                      alt={repo.owner.login}
                      className="h-4 w-4 rounded-full"
                      height={16}
                      src={repo.owner.avatar_url}
                      width={16}
                    />
                    <span>{repo.owner.login}</span>
                  </div>
                </div>
                <Badge variant="secondary">{repo.language || "N/A"}</Badge>
              </div>
              <CardDescription className="line-clamp-2 min-h-10">
                {repo.description || "No description provided."}
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-auto grow-0 space-y-4">
              <div className="flex flex-wrap gap-1">
                {repo.topics?.slice(0, 3).map((topic) => (
                  <Badge
                    className="px-1 py-0 text-[10px]"
                    key={topic}
                    variant="outline"
                  >
                    {topic}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center justify-between text-muted-foreground text-sm">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <StarIcon className="h-4 w-4" />
                    <span>{repo.stargazers_count}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <GitForkIcon className="h-4 w-4" />
                    <span>{repo.forks_count}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <CalendarIcon className="h-3 w-3" />
                  <span>{new Date(repo.updated_at).toLocaleDateString()}</span>
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

        {/* Infinite Scroll Trigger */}
        {(hasNextPage || isFetchingNextPage) && (
          <div className="col-span-full flex justify-center py-4" ref={ref}>
            {isFetchingNextPage ? (
              <Loader2Icon className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : null}
          </div>
        )}
      </div>
    </Example>
  );
}
