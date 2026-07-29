export interface AuditLogResponse {
  id: string;
  entityName: string;
  entityId: string;
  action: string;
  changesJson: string | null;
  performedByUserId: string | null;
  performedByEmail: string | null;
  timestamp: string;
}

export interface AuditLogsQuery {
  pageNumber: number;
  pageSize: number;
  entityName?: string;
  action?: string;
}
