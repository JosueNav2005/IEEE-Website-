# IEEE-Website-
Website for the IEEE UCSC club

## Upcoming Events (Google Calendar)

The Upcoming Events cards on the home page fill themselves in with the next 3 events from the club Google Calendar (`ieeeucsc26@gmail.com`). To add an event to the website, just add it to the calendar.

Each card shows the event's **title**, **date and time**, **location**, and the start of its **description**, and links to the event in Google Calendar.

### One-time setup

1. **Make the calendar public.** In Google Calendar, open the club calendar's *Settings and sharing* → *Access permissions for events* → check **Make available to public** and choose **See all event details**.
2. **Create an API key.** Go to [console.cloud.google.com](https://console.cloud.google.com), create a project, open *APIs & Services* → *Library*, and enable **Google Calendar API**. Then go to *Credentials* → *Create credentials* → **API key**.
3. **Lock the key down.** Edit the key:
   - *Application restrictions* → **Websites**, and add the site's address (for example `https://josuenav2005.github.io/*`) and `http://localhost/*` for testing.
   - *API restrictions* → **Restrict key** → only **Google Calendar API**.
4. **Paste the key** into `GOOGLE_API_KEY` near the bottom of `script.js`.

The key is visible to anyone who views the page source. That is normal for this kind of key, and the restrictions in step 3 stop anyone else from using it.

If the key is missing or the calendar can't be reached, the section shows "No upcoming events right now" and points people to the calendar below.
