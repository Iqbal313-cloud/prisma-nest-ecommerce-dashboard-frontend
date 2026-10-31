export interface MonitoringSummary {
  database: {
    name: string;
    size: string;
  };
  connections: {
    total: number;
    active: number;
    idle: number;
  };
  queries: {
    totalCalls: number;
    totalExecutionTimeMs: number;
    averageExecutionTimeMs: number;
  };
  generatedAt: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  lastPage: number;
  limit: number;
}

export interface MonitoringPaginationParams {
  page?: number;
  limit?: number;
}

export interface RecentQuery {
  time: string | null;
  username: string | null;
  client_ip: string | null;
  query: string | null;
  calls: number;
  total_time_ms: number;
  avg_time_ms: number;
  max_time_ms: number;
  rows: number;
  message: string | null;
  elevel: string | null;
}

export interface RecentQueriesResponse {
  data: RecentQuery[];
  meta: PaginationMeta;
}

export interface SlowQuery {
  queryid: string;
  query: string | null;
  calls: number;
  avg_time_ms: number;
  max_time_ms: number;
  total_time_ms: number;
  rows: number;
}

export interface SlowQueriesResponse {
  data: SlowQuery[];
  meta: PaginationMeta;
}

export interface TopQuery {
  queryid: string;
  query: string | null;
  calls: number;
  avg_time_ms: number;
  max_time_ms: number;
  total_time_ms: number;
  rows: number;
}

export interface TopQueriesResponse {
  data: TopQuery[];
  meta: PaginationMeta;
}
