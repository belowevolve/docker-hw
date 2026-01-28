import { ArrowRight, CheckCircle2, ShieldAlert, Zap } from "lucide-react";

import { Example } from "@/components/example";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function NginxVerification() {
  return (
    <Example title="Nginx Configuration">
      <div className="grid w-full gap-4">
        {/* 1. Exact Match */}
        <div className="flex flex-col gap-2 rounded-lg border bg-yellow-50/50 p-4 dark:bg-yellow-900/10">
          <div className="flex items-center gap-2 font-semibold text-yellow-700 dark:text-yellow-500">
            <Zap className="h-4 w-4" />
            <span>1. Exact Match (=)</span>
          </div>
          <p className="text-muted-foreground text-sm">
            Highest priority. Returns raw text response directly from config.
          </p>
          <a
            className={cn(
              buttonVariants({ variant: "secondary", size: "sm" }),
              "mt-auto"
            )}
            href="/static/exact.html"
            rel="noopener noreferrer"
            target="_blank"
          >
            Check /static/exact.html <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </div>

        {/* 2. Priority Prefix */}
        <div className="flex flex-col gap-2 rounded-lg border bg-red-50/50 p-4 dark:bg-red-900/10">
          <div className="flex items-center gap-2 font-semibold text-red-700 dark:text-red-500">
            <ShieldAlert className="h-4 w-4" />
            <span>2. Priority Prefix (^~)</span>
          </div>
          <p className="text-muted-foreground text-sm">
            Stops regex search. Serves from <code>/static/priority/</code>.
          </p>
          <a
            className={cn(
              buttonVariants({ variant: "secondary", size: "sm" }),
              "mt-auto"
            )}
            href="/static/priority/"
            rel="noopener noreferrer"
            target="_blank"
          >
            Check /static/priority/ <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </div>

        {/* 3. Regex vs Alias */}
        <div className="flex flex-col gap-2 rounded-lg border bg-blue-50/50 p-4 dark:bg-blue-900/10">
          <div className="flex items-center gap-2 font-semibold text-blue-700 dark:text-blue-500">
            <CheckCircle2 className="h-4 w-4" />
            <span>3. Alias & Regex (/static/)</span>
          </div>
          <p className="text-muted-foreground text-sm">
            Standard prefix with Alias + Regex override for images.
          </p>
          <a
            className={cn(
              buttonVariants({ variant: "secondary", size: "sm" }),
              "mt-auto"
            )}
            href="/static/"
            rel="noopener noreferrer"
            target="_blank"
          >
            Check /static/ <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </div>

        {/* 4. API Proxy */}
        <div className="flex flex-col gap-2 rounded-lg border p-4">
          <div className="flex items-center gap-2 font-semibold">
            <Zap className="h-4 w-4" />
            <span>4. API Proxy (GitHub)</span>
          </div>
          <p className="text-muted-foreground text-sm">
            Proxies requests to GitHub API with connection pooling.
          </p>
          <a
            className={cn(
              buttonVariants({ variant: "secondary", size: "sm" }),
              "mt-auto"
            )}
            href="/api/users/octocat"
            rel="noopener noreferrer"
            target="_blank"
          >
            Check /api/users/octocat <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </div>
      </div>
    </Example>
  );
}
