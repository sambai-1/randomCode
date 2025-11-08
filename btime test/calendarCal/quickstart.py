from collections import defaultdict
import datetime
import json
import os.path

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

# If modifying these scopes, delete the file token.json.
SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"]


def main():
  """Shows basic usage of the Google Calendar API.
  Prints the start and name of the next 10 events on the user's calendar.
  """
  creds = None
  # The file token.json stores the user's access and refresh tokens, and is
  # created automatically when the authorization flow completes for the first
  # time.
  if os.path.exists("token.json"):
    creds = Credentials.from_authorized_user_file("token.json", SCOPES)
  # If there are no (valid) credentials available, let the user log in.
  if not creds or not creds.valid:
    if creds and creds.expired and creds.refresh_token:
      creds.refresh(Request())
    else:
      flow = InstalledAppFlow.from_client_secrets_file(
          "credentials.json", SCOPES
      )
      creds = flow.run_local_server(port=0)
    # Save the credentials for the next run
    with open("token.json", "w") as token:
      token.write(creds.to_json())

  try:
    service = build("calendar", "v3", credentials=creds)

    # Call the Calendar API
    start_time = datetime.datetime(
        2020, 12, 1, tzinfo=datetime.timezone.utc
    ).isoformat()
    target_calendar = "Student Enrollment Calendar"

    def resolve_calendar_id(calendar_service, summary):
      """Return the calendarId for the calendar whose summary matches."""
      page_token = None
      while True:
        calendar_list = (
            calendar_service.calendarList().list(pageToken=page_token).execute()
        )
        for entry in calendar_list.get("items", []):
          if entry.get("summary") == summary:
            return entry.get("id")
        page_token = calendar_list.get("nextPageToken")
        if not page_token:
          break
      raise ValueError(f"Calendar named '{summary}' was not found.")

    calendar_id = resolve_calendar_id(service, target_calendar)
    print(f"Getting events from December 2020 onward for {target_calendar!r}")
    events = []
    page_token = None
    while True:
      events_result = (
          service.events()
          .list(
              calendarId=calendar_id,
              timeMin=start_time,
              singleEvents=True,
              orderBy="startTime",
              pageToken=page_token,
          )
          .execute()
      )
      events.extend(events_result.get("items", []))
      page_token = events_result.get("nextPageToken")
      if not page_token:
        break
    
    print(events)

    events_by_semester = defaultdict(list)
    for event in events:
      start = event["start"].get("dateTime", event["start"].get("date"))
      summary = event.get("summary", "Untitled event").strip()

      semester = "Uncategorized"
      year = start[0:4]
      if summary[0:4] == "Fall":
        semester = "Fall"
        summary = summary[7:]
      elif summary[0:6] == "Spring":
        semester = "Spring"
        summary = summary[9:]
      elif summary[0:2] == "FA":
        semester = "Fall"
        year = "20" + summary[2:4]
        summary = summary[5:]
      elif summary[0:2] == "SP":
        semester = "Spring"
        year = "20" + summary[2:4]
        summary = summary[5:]
      
      if "Week" in summary:
        continue
      name = semester + " " + year
      events_by_semester[name].append(
          {"description": summary, "date": start}
      )
    
    data = dict(events_by_semester)

    with open("test.json", "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)
    

  except HttpError as error:
    print(f"An error occurred: {error}")
  except ValueError as error:
    print(error)


if __name__ == "__main__":
  main()
