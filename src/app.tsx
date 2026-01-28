import { ComponentExample } from "./components/component-example";
import { DockerVerification } from "./components/docker-verification";
import { ExampleWrapper } from "./components/example";
import { GithubRepos } from "./components/github-repos";
import { NginxVerification } from "./components/nginx-verification";

export function App() {
  return (
    <ExampleWrapper>
      <NginxVerification />
      <DockerVerification />
      <ComponentExample />
      <GithubRepos />
    </ExampleWrapper>
  );
}
