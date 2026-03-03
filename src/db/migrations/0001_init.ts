import { Effect } from "effect"
import { SqlClient } from "effect/unstable/sql"

export default Effect.gen(function*() {
  const sql = yield* SqlClient.SqlClient

  yield* sql`
    CREATE TABLE IF NOT EXISTS project (
      id SERIAL PRIMARY KEY,
      forge_id TEXT NOT NULL,
      forge_type TEXT NOT NULL,
      UNIQUE (forge_type, forge_id)
    )
  `

  yield* sql`
    CREATE TABLE IF NOT EXISTS task (
      id SERIAL PRIMARY KEY,
      forge_id TEXT NOT NULL,
      project_id INTEGER NOT NULL REFERENCES project(id) ON DELETE CASCADE,
      description TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (id, project_id),
      UNIQUE (project_id, forge_id)
    )
  `

  yield* sql`
    CREATE TABLE IF NOT EXISTS attempt (
      id SERIAL PRIMARY KEY,
      forge_id TEXT NOT NULL,
      project_id INTEGER NOT NULL REFERENCES project(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      ready_at TIMESTAMPTZ,
      UNIQUE (id, project_id),
      UNIQUE (project_id, forge_id)
    )
  `

  yield* sql`
    CREATE TABLE IF NOT EXISTS task_attempts (
      task_id INTEGER NOT NULL,
      attempt_id INTEGER NOT NULL,
      project_id INTEGER NOT NULL,
      PRIMARY KEY (task_id, attempt_id),
      UNIQUE (attempt_id),
      FOREIGN KEY (task_id, project_id) REFERENCES task(id, project_id) ON DELETE CASCADE,
      FOREIGN KEY (attempt_id, project_id) REFERENCES attempt(id, project_id) ON DELETE CASCADE
    )
  `

  yield* sql`CREATE INDEX IF NOT EXISTS task_project_id_idx ON task (project_id)`
  yield* sql`CREATE INDEX IF NOT EXISTS attempt_project_id_idx ON attempt (project_id)`
  yield* sql`CREATE INDEX IF NOT EXISTS task_attempts_project_id_idx ON task_attempts (project_id)`
})
