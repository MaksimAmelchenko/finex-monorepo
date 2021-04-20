import { ISession } from '../../../../types/session';

export function decodeDBSession(session: any): ISession {
  return {
    id: session.id,
    userId: session.id_user,
    projectId: session.id_project,
    isActive: session.is_active,
    requestCount: session.requests_count,
    lastAccessAt: session.last_access_time,
    ip: session.ip,
    userAgent: session.user_agent,
    timeout: session.timeout,
    metadata: {
      createdAt: session.created_at,
      updatedAt: session.updated_at,
    },
  };
}
