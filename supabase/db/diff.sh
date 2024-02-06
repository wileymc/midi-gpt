#!/bin/bash

SUPABASE_CLI=${SUPABASE_CLI:-$(which supabase)}
[[ -z $SUPABASE_CLI ]] && { echo "Missing 'supabase' command in path"; exit 2; }

[[ -z $1 ]] && { echo "USAGE $0 <name>"; exit 2; }
exec $SUPABASE_CLI db diff --use-migra --file $1 --schema public,internal
