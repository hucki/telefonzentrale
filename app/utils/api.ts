const {
  VITE_HISTORY_TOKEN_ID,
  VITE_HISTORY_TOKEN,
  VITE_BASE_URL,
  VITE_TOKEN_ID,
  VITE_TOKEN,
  VITE_USER_ID,
  VITE_FAXLINE_ID,
} = import.meta.env;

export const fetchHistoryWrapper = async ({
  type = "CALL",
  direction = "INCOMING",
  archived = false,
}) => {
  const tokenId = type === "FAX" ? VITE_TOKEN_ID : VITE_HISTORY_TOKEN_ID;
  const token = type === "FAX" ? VITE_TOKEN : VITE_HISTORY_TOKEN;
  const fetchHeaders = new Headers();
  fetchHeaders.append("Accept", "application/json");
  fetchHeaders.append("Content-Type", "application/json");
  fetchHeaders.append("Authorization", `Basic ${btoa(`${tokenId}:${token}`)}`);

  return fetch(
    `${VITE_BASE_URL}/history?types=${type}&offset=0&limit=20&archived=${archived}&directions=${direction}`,
    {
      method: "GET",
      headers: fetchHeaders,
    }
  ).then((res) => res.json());
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
  fetchHeaders.append(
    "Authorization",
    `Basic ${btoa(`${VITE_TOKEN_ID}:${VITE_TOKEN}`)}`
  );

  const taglineResponse = await fetch(
    `${VITE_BASE_URL}/${VITE_USER_ID}/faxlines/`,
    {
      method: "GET",
      headers: fetchHeaders,
    }
  ).then((res) => res.json());

  const tagline = taglineResponse.items.filter(
    (faxline: FaxlineItem) => faxline.id === VITE_FAXLINE_ID
  )[0].tagline;

  return {
    data: tagline,
  };
};

export const fetchCallerid = async () => {
  const fetchHeaders = new Headers();
  fetchHeaders.append("Accept", "application/json");
  fetchHeaders.append("Content-Type", "application/json");
  fetchHeaders.append(
    "Authorization",
    `Basic ${btoa(`${VITE_TOKEN_ID}:${VITE_TOKEN}`)}`
  );

  const calleridResponse = await fetch(
    `${VITE_BASE_URL}/${VITE_USER_ID}/faxlines/${VITE_FAXLINE_ID}/callerid`,
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
  fetchHeaders.append(
    "Authorization",
    `Basic ${btoa(`${VITE_TOKEN_ID}:${VITE_TOKEN}`)}`
  );

  const contactsResponse = await fetch(`${VITE_BASE_URL}/contacts`, {
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
    faxlineId: VITE_FAXLINE_ID,
    recipient,
    filename: fileName,
    base64Content,
  };
  const fetchHeaders = new Headers();
  fetchHeaders.append("Accept", "application/json");
  fetchHeaders.append("Content-Type", "application/json");
  fetchHeaders.append(
    "Authorization",
    `Basic ${btoa(`${VITE_TOKEN_ID}:${VITE_TOKEN}`)}`
  );

  const sendFaxResponse = await fetch(`${VITE_BASE_URL}/sessions/fax`, {
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
  fetchHeaders.append(
    "Authorization",
    `Basic ${btoa(`${VITE_TOKEN_ID}:${VITE_TOKEN}`)}`
  );

  const historyResponse = await fetch(`${VITE_BASE_URL}/history/${sessionId}`, {
    method: "GET",
    headers: fetchHeaders,
  }).then((res) => res.json());

  return {
    faxStatusType: historyResponse.faxStatusType,
  };
};
