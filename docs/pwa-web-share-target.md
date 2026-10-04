# PWA Web Share Target API

## What is this feature?

The Web Share Target API allows a Progressive Web App (PWA) like Sulok to register as a target in the operating system's native share menu (e.g., the Share Sheet on Android or ChromeOS). When a user finds a link in another app (such as Chrome, Twitter, or YouTube) and clicks "Share," Sulok will appear as an option alongside native apps. Selecting Sulok opens the PWA and automatically passes the shared URL and title to the app, allowing the user to seamlessly save it to their library.

This bridges the gap between web apps and native apps, significantly improving the curation workflow on mobile devices without needing a dedicated native application.

## What to Cover

To implement this feature properly in Sulok, we need to address the following areas:

1. **Manifest Configuration:**
   Update the PWA manifest in `vite.config.ts` to include the `share_target` entry.
2. **Routing / State Handler:**
   Create a dedicated route (e.g., `/share-target`) or a global state handler that intercepts the app launch when triggered via a share action.
3. **UI Integration:**
   Automatically open the "Add Item" form (via `ItemDialog` or the global drawer system) pre-filled with the intercepted URL and title, ready for the user to select a folder.
4. **Fallback & Data Normalization:**
   Some apps put the URL in the `text` parameter rather than the `url` parameter. We must parse and normalize the incoming query parameters properly.

## How it Works

1. **Registration:**
   Inside `vite.config.ts` (using `vite-plugin-pwa`), we add the `share_target` configuration to the `manifest` object:
   ```json
   share_target: {
     action: "/share-target",
     method: "GET",
     params: {
       title: "title",
       text: "text",
       url: "url"
     }
   }
   ```
2. **Invocation:**
   When the user shares a link to Sulok from their OS, the browser launches the installed PWA and navigates to the `action` URL, appending the shared data as query string parameters.
   _Example: `https://sulok-app.vercel.app/share-target?title=Example&url=https://example.com`_

3. **Handling the Request:**
   Sulok's React Router intercepts the `/share-target` route. A dedicated component parses the search parameters. If a valid URL is detected, it triggers the global store to open the Add Item drawer, passing the pre-filled data. The user selects a folder, hits save, and the item is stored in IndexedDB.

## Limitations

1. **iOS/Safari Incompatibility:**
   The Web Share Target API is currently **NOT supported on iOS (Safari/WebKit)**. Apple has not implemented this standard. iOS users can install the PWA, but Sulok will not appear in the iOS native Share Sheet.
2. **Requires PWA Installation:**
   The share target functionality only works if the user has explicitly installed Sulok to their device (Add to Home Screen). It does not function through a standard browser tab.
3. **GET vs POST Constraints:**
   While using the `GET` method is simpler because the data arrives as URL parameters, it is subject to URL length limits. `POST` can handle larger payloads but requires complex Service Worker interception to read the `FormData` and pass it to the React client. For Sulok's purpose (saving links), `GET` is sufficient, but we must handle edge cases where extremely long URLs might be truncated.
4. **Data Inconsistency from Source Apps:**
   Different apps format shared data differently. For example, YouTube might put the URL in the `url` field, while Twitter might bundle the title and the URL together into the `text` field. The handler must use regex to intelligently extract the actual URL from the provided text payload.
