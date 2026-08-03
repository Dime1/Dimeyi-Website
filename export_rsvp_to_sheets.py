#!/usr/bin/env python3
"""
Daily export: Supabase 'rsvp' table -> Google Sheets (append mode).

Each run adds a fresh batch of rows to the sheet, tagged with the UTC
timestamp of the pull, so the sheet becomes a running history log rather
than being overwritten.

Required environment variables (set as GitHub Actions secrets):
  SUPABASE_URL                    - your Supabase project URL
  SUPABASE_KEY                    - a Supabase API key (service_role or anon, depending on RLS)
  GOOGLE_SERVICE_ACCOUNT_JSON_B64 - base64-encoded contents of your Google service account JSON key
  GOOGLE_SHEET_ID                 - the ID of the target Google Sheet (from its URL)
  GOOGLE_SHEET_TAB                - (optional) worksheet/tab name, defaults to "rsvp"
"""

import os
import json
import sys
import base64
from datetime import datetime, timezone

from supabase import create_client
import gspread
from google.oauth2.service_account import Credentials

TABLE_NAME = "rsvp"
SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]

# Only these columns are pulled from the table and written to the sheet.
# NOTE: "guest_count" is assumed — Postgres column names can't contain
# spaces, so if your actual column is named differently (e.g. "guests"),
# update it here.
SELECT_COLUMNS = ["name", "email", "attending", "guest_count", "phone", "plus_one_name"]


def get_supabase_rows():
    url = os.environ["SUPABASE_URL"]
    key = os.environ["SUPABASE_KEY"]
    client = create_client(url, key)
    response = client.table(TABLE_NAME).select(",".join(SELECT_COLUMNS)).execute()
    return response.data or []


def get_worksheet():
    encoded = os.environ["GOOGLE_SERVICE_ACCOUNT_JSON_B64"]
    creds_json = base64.b64decode(encoded).decode("utf-8")
    creds_dict = json.loads(creds_json)

    creds = Credentials.from_service_account_info(creds_dict, scopes=SCOPES)
    gc = gspread.authorize(creds)

    sheet_id = os.environ["GOOGLE_SHEET_ID"]
    tab_name = os.environ.get("GOOGLE_SHEET_TAB", "rsvp")

    sh = gc.open_by_key(sheet_id)
    try:
        worksheet = sh.worksheet(tab_name)
    except gspread.WorksheetNotFound:
        worksheet = sh.add_worksheet(title=tab_name, rows=1000, cols=26)
    return worksheet


def main():
    rows = get_supabase_rows()
    if not rows:
        print("No rows returned from Supabase 'rsvp' table. Nothing to append.")
        return

    columns = SELECT_COLUMNS

    worksheet = get_worksheet()
    existing_header = worksheet.row_values(1)

    pulled_at = datetime.now(timezone.utc).isoformat()
    header = ["pulled_at"] + columns

    if not existing_header:
        worksheet.append_row(header)
    elif existing_header != header:
        print(
            "Warning: sheet header does not match the current table columns.\n"
            f"  Sheet header:  {existing_header}\n"
            f"  Table columns: {header}\n"
            "New rows will still be appended, in the table's current column order."
        )

    data_rows = []
    for row in rows:
        data_rows.append([pulled_at] + [row.get(col, "") for col in columns])

    worksheet.append_rows(data_rows, value_input_option="USER_ENTERED")
    print(f"Appended {len(data_rows)} rows from '{TABLE_NAME}' at {pulled_at}.")


if __name__ == "__main__":
    try:
        main()
    except KeyError as e:
        print(f"Missing required environment variable: {e}", file=sys.stderr)
        sys.exit(1)
