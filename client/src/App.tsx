import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import ProjectReport from "./pages/ProjectReport";
import NotFound from "./pages/not-found";

function Router() {
  return (
    <Switch>
      {/* 
        The prompt requests a specific report view. 
        We serve the ProjectReport page as the home route.
      */}
      <Route path="/" component={ProjectReport} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
