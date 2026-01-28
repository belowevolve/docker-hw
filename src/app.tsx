import { ComponentExample } from "./components/component-example";
import { ExampleWrapper } from "./components/example";
import { GithubRepos } from "./components/github-repos";

export function App() {
  return (
    <ExampleWrapper>
      <GithubRepos />
      <ComponentExample />
    </ExampleWrapper>
  );
}
