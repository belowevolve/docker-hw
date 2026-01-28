import { Container, Layers, Server } from "lucide-react";
import { useEffect, useState } from "react";

import { Example } from "@/components/example";
import { Badge } from "@/components/ui/badge";

export function DockerVerification() {
  const [serverHeader, setServerHeader] = useState<string>("Checking...");

  useEffect(() => {
    fetch(window.location.href, { method: "HEAD" })
      .then((res) => {
        const server = res.headers.get("server");
        setServerHeader(server || "Hidden / Unknown");
      })
      .catch(() => setServerHeader("Error checking"));
  }, []);

  return (
    <Example title="Docker Environment">
      <div className="flex w-full flex-col gap-6">
        {/* Info Blocks */}
        <div className="grid gap-4">
          <div className="flex items-start gap-4 rounded-lg border p-4">
            <Container className="mt-1 h-5 w-5 text-blue-500" />
            <div className="space-y-1">
              <div className="font-semibold leading-none tracking-tight">
                Multi-Stage Build
              </div>
              <p className="text-muted-foreground text-sm">
                Built with <code>oven/bun:1-alpine</code>, served by{" "}
                <code>nginx:stable-alpine</code>.
              </p>
              <div className="flex gap-2 pt-2">
                <Badge className="text-xs" variant="outline">
                  Bun Build
                </Badge>
                <Badge className="text-xs" variant="outline">
                  Nginx Prod
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-lg border p-4">
            <Layers className="mt-1 h-5 w-5 text-green-500" />
            <div className="space-y-1">
              <div className="font-semibold leading-none tracking-tight">
                Optimization
              </div>
              <p className="text-muted-foreground text-sm">
                Static assets are pre-compressed and cached. Production image
                contains only artifacts.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-lg border bg-muted/50 p-4">
            <Server className="mt-1 h-5 w-5 text-purple-500" />
            <div className="space-y-1">
              <div className="font-semibold leading-none tracking-tight">
                Runtime Check
              </div>
              <p className="text-muted-foreground text-sm">
                Verifying server header from current response:
              </p>
              <div className="mt-2 rounded bg-background p-2 font-mono text-xs">
                Server: {serverHeader}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Example>
  );
}
