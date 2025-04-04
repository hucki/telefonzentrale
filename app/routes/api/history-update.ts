import type { ActionFunctionArgs } from "react-router";
import { getConfig } from "~/utils/config";

export async function action({ request }: ActionFunctionArgs) {
  // Parse the form data from the request
  const formData = await request.formData();
  const id = formData.get("id") as string;
  const note = formData.has("note")
    ? (formData.get("note") as string)
    : undefined;
  const archived = formData.has("archived")
    ? (formData.get("archived") as string)
    : undefined;
  const starred = formData.has("starred")
    ? (formData.get("starred") as string)
    : undefined;
  const read = formData.has("read")
    ? (formData.get("read") as string)
    : undefined;

  // Get API configuration
  const config = getConfig();
  const { BASE_URL, HISTORY_TOKEN_ID, HISTORY_TOKEN } = config;

  if (!BASE_URL) {
    return Response.json(
      { error: "API base URL is not configured" },
      { status: 500 }
    );
  }

  if (!HISTORY_TOKEN_ID || !HISTORY_TOKEN) {
    return Response.json(
      { error: "API authentication is not configured" },
      { status: 500 }
    );
  }

  // Construct the API URL
  const url = new URL(`/v2/history/${id}`, BASE_URL);

  // Determine update type
  const isNoteUpdate = note !== undefined;
  const isOtherAttributesUpdate =
    archived !== undefined || starred !== undefined || read !== undefined;

  try {
    // Set up the common request options
    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Basic ${btoa(`${HISTORY_TOKEN_ID}:${HISTORY_TOKEN}`)}`,
      },
      body: "",
    };

    let response;

    // Handle note updates (priority)
    if (isNoteUpdate) {
      requestOptions.body = JSON.stringify({ note });
      response = await fetch(url.toString(), requestOptions);
    }
    // Handle other attributes updates
    else if (isOtherAttributesUpdate) {
      const requestBody: Record<string, boolean> = {};

      if (archived !== undefined) requestBody.archived = archived === "true";
      if (starred !== undefined) requestBody.starred = starred === "true";
      if (read !== undefined) requestBody.read = read === "true";

      requestOptions.body = JSON.stringify(requestBody);
      response = await fetch(url.toString(), requestOptions);
    }
    // No valid update parameters provided
    else {
      return Response.json(
        { error: "No valid update parameters provided" },
        { status: 400 }
      );
    }

    // Process the response
    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error:", {
        status: response.status,
        statusText: response.statusText,
        responseText: errorText.substring(0, 200),
      });
      return Response.json(
        { error: `API request failed with status ${response.status}` },
        { status: response.status }
      );
    }

    // Return success response
    return Response.json({ success: true, id });
  } catch (error) {
    console.error("Error updating history item:", error);
    return Response.json(
      { error: "Failed to update history item" },
      { status: 500 }
    );
  }
}

// This is a resource route, no component needed - return 404 for direct access
export function loader() {
  return new Response("Not found", { status: 404 });
}
