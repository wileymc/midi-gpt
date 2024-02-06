#!/bin/bash

set -e

DIR=$(realpath $(dirname "$0"))
SUPABASE_DIR=$(echo $DIR | grep -o ".*supabase")

SUPABASE_CLI=${SUPABASE_CLI:-$(which supabase)}
[[ -z $SUPABASE_CLI ]] && { echo "Missing 'supabase' command in path"; exit 2; }

function cleanup() {
  echo "Performing cleanup..."
  rm -rf $SUPABASE_DIR/migrations
  mv $SUPABASE_DIR/migrations.stashed $SUPABASE_DIR/migrations
  echo "Done"
}

echo "Stashing migrations..."
mv $SUPABASE_DIR/migrations $SUPABASE_DIR/migrations.stashed
mkdir -p $SUPABASE_DIR/migrations
trap cleanup EXIT

cp $DIR/base.sql      $SUPABASE_DIR/migrations/00_base.sql
# cp $DIR/types.sql     $SUPABASE_DIR/migrations/01_types.sql
cp $DIR/tables.sql    $SUPABASE_DIR/migrations/02_tables.sql
# cp $DIR/functions.sql $SUPABASE_DIR/migrations/03_functions.sql
cp $DIR/triggers.sql  $SUPABASE_DIR/migrations/04_triggers.sql
# cp $DIR/policies.sql  $SUPABASE_DIR/migrations/05_policies.sql
# cp $DIR/views.sql     $SUPABASE_DIR/migrations/06_views.sql
# cp $DIR/seeds.sql     $SUPABASE_DIR/migrations/07_seeds.sql

$SUPABASE_CLI db reset
