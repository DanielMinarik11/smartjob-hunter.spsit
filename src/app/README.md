# Štruktúra aplikácie

Kód je zoskupený podľa funkčných oblastí. Nové súbory patria do svojej feature,
nie do spoločného priečinka rozdeleného podľa typu súboru.

```text
src/app/
  core/                         # aplikácia-wide konfigurácia a služby
    config/firebase.config.ts
    guards/
    interceptors/
    services/
  features/
    auth/
      data-access/firebase-auth.service.ts
      pages/
      ui/
    jobs/
      data-access/
      models/
      pages/job-board.*
      ui/
    applications/
    profile/
  shared/
    components/
    directives/
    pipes/
  app.config.ts
  app.routes.ts                 # lazy-loaded feature routes
```

`core` je určený pre infraštruktúru používanú naprieč aplikáciou. `shared`
obsahuje znovupoužiteľné prvky bez väzby na konkrétnu feature. Každá feature
vlastní svoje stránky, UI, dátový prístup a modely; route feature sa načítava
len pri navigácii na ňu.
