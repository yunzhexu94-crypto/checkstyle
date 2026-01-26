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
        Serve the ProjectReport as the index page.
        This provides immediate access to the Checkstyle report content.
      */}
      <Route path="/" component={ProjectReport} />
      
      {/* Fallback route for 404s */}
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
