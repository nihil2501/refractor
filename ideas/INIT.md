### Data model
```
project : (repo)
  id, forge_id
  forge_type

task : (issue)
  id, forge_id
  project_id
  description
  created_at

attempt : (pull_request)
  id, forge_id
  project_id
  created_at
  ready_at

task_attempts : (issue_pr_link)
  task_id
  attempt_id
  project_id
```

### Design
Control plane deterministically associates workspaces w/ forge entities. E.g., consider the feature to complete a task with a particular attempt. This maps to accepting a GH PR that names a particular GH issue. This op can be performed in either control plane, ours or theirs. That state should be synchronized, either by being propagated to both or by having one state derive from the other.
