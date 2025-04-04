import { getConfig } from "./config";

const {
  BASE_URL,
  HISTORY_TOKEN_ID,
  HISTORY_TOKEN,
  TOKEN_ID,
  TOKEN,
  USER_ID,
  FAXLINE_ID,
} = getConfig(); // import.meta.env;

export const fetchHistoryWrapper = async ({
  type = "CALL",
  direction = "INCOMING",
  archived = false,
}) => {
  if (!BASE_URL) {
    console.error("No BASE_URL provided in configuration");
    throw new Error("API base URL is not configured");
  }
  const url = new URL("/v2/history", BASE_URL);
  // Add query parameters
  url.searchParams.append("types", type);
  url.searchParams.append("offset", "0");
  url.searchParams.append("limit", "20");
  url.searchParams.append("archived", archived.toString());
  url.searchParams.append("directions", direction);

  // Make sure we have authentication credentials
  const tokenId = type === "FAX" ? TOKEN_ID : HISTORY_TOKEN_ID;
  const token = type === "FAX" ? TOKEN : HISTORY_TOKEN;

  if (!tokenId || !token) {
    console.error("Missing authentication credentials");
    throw new Error("API authentication is not configured");
  }

  const fetchHeaders = new Headers();
  fetchHeaders.append("Accept", "application/json");
  fetchHeaders.append("Content-Type", "application/json");
  fetchHeaders.append("Cache-Control", "max-age=5, stale-while-revalidate=10");
  fetchHeaders.append("Authorization", `Basic ${btoa(`${tokenId}:${token}`)}`);

  return fetch(url.toString(), {
    method: "GET",
    headers: fetchHeaders,
  }).then((res) => res.json());
};

type FaxlineItem = {
  id: string;
  alias: string;
  tagline: string;
  canSend: boolean;
  canReceive: boolean;
};
export type FaxLinesResult = {
  data: {
    items: FaxlineItem[];
  };
};

export const fetchTagline = async () => {
  const fetchHeaders = new Headers();
  fetchHeaders.append("Accept", "application/json");
  fetchHeaders.append("Content-Type", "application/json");
  fetchHeaders.append("Authorization", `Basic ${btoa(`${TOKEN_ID}:${TOKEN}`)}`);

  const url = new URL(`/v2/${USER_ID}/faxlines/`, BASE_URL);
  const taglineResponse = await fetch(url.toString(), {
    method: "GET",
    headers: fetchHeaders,
  }).then((res) => res.json());

  const tagline = taglineResponse.items.filter(
    (faxline: FaxlineItem) => faxline.id === FAXLINE_ID
  )[0].tagline;

  return {
    data: tagline,
  };
};

export const fetchCallerid = async () => {
  const fetchHeaders = new Headers();
  fetchHeaders.append("Accept", "application/json");
  fetchHeaders.append("Content-Type", "application/json");
  fetchHeaders.append("Authorization", `Basic ${btoa(`${TOKEN_ID}:${TOKEN}`)}`);

  const calleridResponse = await fetch(
    `${BASE_URL}/v2/${USER_ID}/faxlines/${FAXLINE_ID}/callerid`,
    {
      method: "GET",
      headers: fetchHeaders,
    }
  ).then((res) => res.json());

  return {
    data: calleridResponse,
  };
};

export const fetchContacts = async () => {
  const fetchHeaders = new Headers();
  fetchHeaders.append("Accept", "application/json");
  fetchHeaders.append("Content-Type", "application/json");
  fetchHeaders.append("Authorization", `Basic ${btoa(`${TOKEN_ID}:${TOKEN}`)}`);

  const contactsResponse = await fetch(`${BASE_URL}/v2/contacts`, {
    method: "GET",
    headers: fetchHeaders,
  }).then((res) => res.json());

  return contactsResponse;
};

/**
 *
 * @param {string} recipient
 * @param {string} filePath
 */
export const sendFax = async (
  recipient: string,
  base64Content: string,
  fileName: string
) => {
  const data = {
    faxlineId: FAXLINE_ID,
    recipient,
    filename: fileName,
    base64Content,
  };
  const fetchHeaders = new Headers();
  fetchHeaders.append("Accept", "application/json");
  fetchHeaders.append("Content-Type", "application/json");
  fetchHeaders.append("Authorization", `Basic ${btoa(`${TOKEN_ID}:${TOKEN}`)}`);

  const sendFaxResponse = await fetch(`${BASE_URL}/v2/sessions/fax`, {
    method: "POST",
    headers: fetchHeaders,
    body: JSON.stringify(data),
  }).then((res) => res.json());

  return sendFaxResponse;
};

export const fetchFaxStatus = async (sessionId: string) => {
  const fetchHeaders = new Headers();
  fetchHeaders.append("Accept", "application/json");
  fetchHeaders.append("Content-Type", "application/json");
  fetchHeaders.append("Authorization", `Basic ${btoa(`${TOKEN_ID}:${TOKEN}`)}`);

  const historyResponse = await fetch(`${BASE_URL}/v2/history/${sessionId}`, {
    method: "GET",
    headers: fetchHeaders,
  }).then((res) => res.json());

  return {
    faxStatusType: historyResponse.faxStatusType,
  };
};

export type HistoryItemUpdateProps = {
  id: string;
  note?: string | null;
  archived?: boolean;
  starred?: boolean;
  read?: boolean;
};
export type PutHistoryItemDataProps = {
  id: string;
} & (
  | {
      note: string | null;
    }
  | {
      archived: boolean;
      starred: boolean;
      read: boolean;
    }
);

export const putHistoryItemData = async ({
  id,
  ...updateData
}: PutHistoryItemDataProps) => {
  let note: string | null = null;
  let archived: boolean | undefined;
  let starred: boolean | undefined;
  let read: boolean | undefined;
  console.log("baseurl", BASE_URL);
  const isUpdateNote = "note" in updateData;
  if (isUpdateNote) {
    note = updateData.note;
  } else {
    ({ archived, starred, read } = updateData);
  }
  const fetchHeaders = new Headers();
  fetchHeaders.append("Accept", "application/json");
  fetchHeaders.append("Content-Type", "application/json");
  fetchHeaders.append(
    "Authorization",
    `Basic ${btoa(`${HISTORY_TOKEN_ID}:${HISTORY_TOKEN}`)}`
  );

  // update Note currently yields an HTTP 500 error
  const body = isUpdateNote
    ? { note }
    : {
        archived,
        starred,
        read,
      };
  const historyItemUpdateResponse = await fetch(
    `${BASE_URL}/v2/history/${id}`,
    {
      method: "PUT",
      headers: fetchHeaders,
      body: JSON.stringify(body),
    }
  );

  return historyItemUpdateResponse;
};
