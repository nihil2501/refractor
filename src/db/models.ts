import { Schema } from "effect"
import { Model } from "effect/unstable/schema"

export class Project extends Model.Class<Project>("Project")({
  id: Model.Generated(Schema.Int),
  forge_id: Schema.String,
  forge_type: Schema.String
}) {}

export class Task extends Model.Class<Task>("Task")({
  id: Model.Generated(Schema.Int),
  forge_id: Schema.String,
  project_id: Schema.Int,
  description: Schema.String,
  created_at: Model.Generated(Schema.Date)
}) {}

export class Attempt extends Model.Class<Attempt>("Attempt")({
  id: Model.Generated(Schema.Int),
  forge_id: Schema.String,
  project_id: Schema.Int,
  created_at: Model.Generated(Schema.Date),
  ready_at: Schema.NullOr(Schema.Date)
}) {}

export class TaskAttempt extends Model.Class<TaskAttempt>("TaskAttempt")({
  task_id: Schema.Int,
  attempt_id: Schema.Int,
  project_id: Schema.Int
}) {}
