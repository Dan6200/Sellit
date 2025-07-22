## Additional Rules For You the Assistant

- Commit and push (if you can before making any changes)
- Run tests, Tests you should run are postfixed with `:assistant` in `package.json`.
- When something doesn't work, try logging, to see what is happing.
- `For every command in development and testing, they have a debug mode, post-fixed with `:debug`
  - Run both the debug server and tests when something isn't working
- For difficult to fix bugs, look at the supabase container logs with docker to get more clues:
- Query the database directly:

  - <example>

  bash```
  $ docker ps
  CONTAINER ID IMAGE COMMAND CREATED STATUS PORTS NAMES
  ee075817423b public.ecr.aws/supabase/postgres:17.4.1.054 "sh -c '\ncat <<'EOF'…" 4 hours ago Up 4 hours (healthy) 0.0.0.0:54322->5432/tcp, [::]:54322->5432/tcp supabase_db_thrift-api
  c0d0bc82a1c6 public.ecr.aws/supabase/gotrue:v2.177.0 "auth" 4 hours ago Up 4 hours (healthy) 9999/tcp supabase_auth_thrift-api
  261e175ca32b public.ecr.aws/supabase/kong:2.8.1 "sh -c 'cat <<'EOF' …" 4 hours ago Up 4 hours (healthy) 8001/tcp, 8088/tcp, 8443-8444/tcp, 0.0.0.0:54321->8000/tcp, [::]:54321->8000/tcp supabase_kong_thrift-api
  69a7d6d358ab ghcr.io/open-webui/open-webui:main "bash start.sh" 2 months ago Up 4 hours (healthy) 0.0.0.0:6600->8080/tcp, [::]:6600->8080/tcp open-webui
  $ docker exec -it ee bash -c "PAGER='' psql -U postgres -c 'select id from profiles'"
  id

  ***

  a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11
  b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22
  c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33
  d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44
  e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55
  f1eebc99-9c0b-4ef8-bb6d-6bb9bd380a66
  a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a77
  e3eebc99-9c0b-4ef8-bb6d-6bb9bd380a88
  14eebc99-9c0b-4ef8-bb6d-6bb9bd380a99
  45eebc99-9c0b-4ef8-bb6d-6bb9bd380b00
  (10 rows)

  ```

  </example>
  ```

### Relevant files

- DB schema: `supabase/migrations/20250702000000_initial_schema.sql`
- All API routes: `api/index.ts`
- Central Function To process all routes: `server/src/controllers/process-routes.ts`
- Central Response Validator: `server/src/controllers/utils/response-validation.ts`
- Central Request Validator: `server/src/controllers/utils/request-validation.ts`
- Package.json: `package.json`
- Integrated Tests: `server/src/tests/integrated/index.ts`
