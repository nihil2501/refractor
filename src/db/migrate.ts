import { PgClient, PgMigrator } from "@effect/sql-pg"
import { Config, Effect, FileSystem, Layer, ManagedRuntime, Path } from "effect"
import * as ChildProcessSpawner from "effect/unstable/process/ChildProcessSpawner"
import migration0001Init from "./migrations/0001_init"

const migrationRuntime = ManagedRuntime.make(Layer.mergeAll(
  PgClient.layerConfig({
    url: Config.redacted("DATABASE_URL")
  }),
  Path.layer,
  FileSystem.layerNoop({}),
  Layer.succeed(ChildProcessSpawner.ChildProcessSpawner)(
    ChildProcessSpawner.make(() => Effect.die("Child processes are unavailable in migrations"))
  )
))

const migrationProgram = PgMigrator.run({
  loader: PgMigrator.fromRecord({
    "0001_init": migration0001Init
  })
})

export const migrate = (): Promise<ReadonlyArray<readonly [id: number, name: string]>> =>
  migrationRuntime.runPromise(migrationProgram)

if (import.meta.main) {
  const completed = await migrate()

  if (completed.length === 0) {
    console.log("No migrations to apply")
  } else {
    const labels = completed.map(([id, name]) => `${id}_${name}`).join(", ")
    console.log(`Applied migrations: ${labels}`)
  }
}
