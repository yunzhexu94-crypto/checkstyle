import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertReport } from "@shared/schema";

// GET /api/reports
export function useReports() {
  return useQuery({
    queryKey: [api.reports.list.path],
    queryFn: async () => {
      const res = await fetch(api.reports.list.path);
      if (!res.ok) throw new Error("Failed to fetch reports");
      return api.reports.list.responses[200].parse(await res.json());
    },
  });
}

// GET /api/reports/:id
export function useReport(id: number) {
  return useQuery({
    queryKey: [api.reports.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.reports.get.path, { id });
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch report");
      return api.reports.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

// POST /api/reports
export function useCreateReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertReport) => {
      const res = await fetch(api.reports.create.path, {
        method: api.reports.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          throw new Error("Invalid report data");
        }
        throw new Error("Failed to create report");
      }
      return api.reports.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.reports.list.path] });
    },
  });
}
