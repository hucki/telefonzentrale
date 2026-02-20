export type HistoryItemType = "CALL" | "VOICEMAIL" | "SMS" | "FAX";

export type HistoryPanelId =
  | "missed"
  | "incoming"
  | "outgoing"
  | "voicemail"
  | "fax-incoming"
  | "fax-outgoing";

export type HistoryItemEndpoint = {
  type: string;
  endpoint: {
    extension: string;
    type: string;
  };
};
export type HistoryItem = {
  id: string;
  source: string;
  target: string;
  sourceAlias: string;
  targetAlias: string;
  type: HistoryItemType;
  created: string;
  lastModified: string;
  direction: "INCOMING" | "OUTGOING" | "MISSED_INCOMING";
  incoming: boolean;
  status: string;
  connectionIds: string[];
  read: boolean;
  archived: boolean;
  note: string | null;
  endpoints: HistoryItemEndpoint[];
  starred: boolean;
  labels: string[];
  faxStatusType?: string;
  documentUrl?: string;
  reportUrl?: string;
  previewUrl?: string;
  pageCount?: number;
  transcription?: string;
  recordingUrl?: string;
  duration?: number;
};

export type FaxHistoryItem = {
  id: string;
  source: string;
  target: string;
  sourceAlias: string;
  targetAlias: string;
  type: "FAX";
  created: string;
  lastModified: string;
  direction: "INCOMING" | "OUTGOING";
  incoming: boolean;
  status: string;
  connectionIds: string[];
  read: boolean;
  archived: boolean;
  note: string | null;
  endpoints: {
    type: string;
    endpoint: {
      extension: string;
      type: string;
    };
  }[];
  starred: boolean;
  labels: string[];
  faxStatusType: string;
  documentUrl: string;
  reportUrl: string;
  previewUrl: string;
  pageCount: number;
};

export type FaxHistoryResult = {
  data: {
    items: FaxHistoryItem[];
  };
};
