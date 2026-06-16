# Family Tree Selection — Memory

Session handoff log for implementation context.

---

## Status

**Unblocked.** Milestone 1 scaffold complete; begin Phase A (service abstraction).

---

## Decisions

- Service abstraction is part of this feature (not a separate feature folder).
- `getMember()` implemented on service in Phase A; first UI consumer is the member-detail feature (Milestone 5).

---

## Open Issues

- Tree discovery mechanism (static manifest vs. explicit asset paths) to be decided during Phase A implementation.

---

## Next Steps

1. Mark Phase A as In Progress in [progress.md](progress.md).
2. Implement models, service interface, and `JsonFamilyTreeService` per [developmentplan.md](developmentplan.md).
