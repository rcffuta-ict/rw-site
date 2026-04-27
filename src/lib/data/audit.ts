type AuditEvent = {
  id: string;
  at: string;
  type: "order_created" | "receipt_submitted" | "status_changed";
  orderId: string;
  meta?: Record<string, string>;
};

const events: AuditEvent[] = [];

function id() {
  return `evt_${Math.random().toString(36).slice(2, 10)}${Date.now()
    .toString(36)
    .slice(2, 7)}`;
}

export const Audit = {
  record(e: Omit<AuditEvent, "id" | "at">) {
    events.unshift({ ...e, id: id(), at: new Date().toISOString() });
  },
  list() {
    return events;
  },
};

