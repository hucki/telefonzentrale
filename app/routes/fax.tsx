import { useCallback, useEffect, useState } from "react";
import {
  useFetchers,
  useLoaderData,
  type ActionFunctionArgs,
} from "react-router";
import type { Route } from "./+types/fax";
import { useDropzone } from "react-dropzone";
import { createPdf } from "../utils/pdf";
import type { Contact, FaxContact } from "../types/contacts";
import type { FaxHistoryResult } from "../types/history";
import {
  fetchCallerid,
  fetchContacts,
  fetchHistoryWrapper,
  fetchTagline,
  resendFax,
  sendFax,
} from "../utils/api";
import { Input } from "../forms/input";
import { Container } from "../components/container";
import {
  DeleteButton,
  TactileButton,
  ToggleButton,
} from "../components/buttons";
import FaxHistoryView from "../history/FaxHistoryView";
import { CoverPageForm } from "~/forms/coverPageForm";
import { FaxPreview } from "~/components/faxPreview";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Fax" },
    { name: "description", content: "Telefonzentrale Fax" },
  ];
}
export type FaxSendResult = {
  result: "success" | "error";
  message: string;
  error?: string;
};
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const recipientName = String(formData.get("recipientName"));
  const recipientNumber = String(formData.get("recipientNumber"));
  const fileName = String(formData.get("fileName"));
  const pdf = String(formData.get("pdf"));
  const actionType = String(formData.get("actionType"));
  const faxId = String(formData.get("faxId"));

  // invariant(recipientNumber.length, "has to have a recipientNumber");
  // invariant(
  //   recipientNumber.match(/^\+[1-9]\d{1,14}$/),
  //   "recipientNumber has to match +49123456789"
  // );

  if (actionType !== "sendFax" && actionType !== "resendFax") {
    return {
      result: "error",
      message: "Unbekannte Aktion",
      error: `actionType ${actionType} is not supported`,
    };
  }

  if (actionType === "resendFax" && faxId) {
    // resend fax
    try {
      const result = await resendFax(faxId);
      const sessionId = result?.data.sessionId || "unknown";
      if (sessionId === "unknown") {
        return {
          result: "error",
          message: "Fax konnte nicht erneut gesendet werden",
          error: "sessionId not found in response",
        };
      }
      return {
        result: "success",
        message: `FaxID ${faxId} erneut gesendet (Session ID: ${sessionId})`,
        error: undefined,
      };
    } catch (error) {
      return {
        result: "error",
        message: `FaxID ${faxId} konnte nicht gesendet werden`,
        error,
      };
    }
  }
  // send fax
  if (!recipientName || !recipientNumber || !pdf || !fileName) {
    return {
      result: "error",
      message: "Fax konnte nicht gesendet werden",
      error: "recipientName, recipientNumber, pdf and fileName are required",
    };
  }

  try {
    const result = await sendFax(recipientNumber, pdf, fileName);
    const sessionId = result?.data.sessionId || "unknown";
    if (sessionId === "unknown") {
      return {
        result: "error",
        message: "Fax konnte nicht gesendet werden",
        error: "sessionId not found in response",
      };
    }
    return {
      result: "success",
      message: `Fax gesendet an ${recipientName} mit der Nummer ${recipientNumber} (Session ID: ${sessionId})`,
      error: undefined,
    };
  } catch (error) {
    return {
      result: "error",
      message: "Fax konnte nicht gesendet werden",
      error,
    };
  }
}

type UploadMetaData = {
  name: string;
  size: number;
  lastModifiedDate: Date;
};

const defaultState = {
  sender: "Mundwerk Logopädische Praxis",
  recipientName: "",
  recipientNumber: "",
  content: "",
};

export const getFaxContacts = (contacts: Contact[]): FaxContact[] => {
  return contacts
    .filter((contact) => {
      return contact.numbers.some((number) => number.type.includes("fax"));
    })
    .map((contact) => {
      return {
        id: contact.id,
        name: contact.name,
        givenName: contact.givenname,
        familyName: contact.familyname,
        numberType: "fax",
        number: contact.numbers.find((number) => number.type.includes("fax"))
          ?.number,
      };
    });
};

export type LoaderResult = {
  status: string;
  contacts: Contact[];
  faxHistory: FaxHistoryResult[];
  callerid?: string;
  tagline?: string;
};

export const loader = async (): Promise<LoaderResult> => {
  let fetchError = false;
  const contacts: Contact[] = [];
  const faxHistory: FaxHistoryResult[] = [];
  let callerid: string | undefined = undefined;
  let tagline: string | undefined = undefined;
  try {
    const taglineFetchResult = await fetchTagline();
    if (taglineFetchResult) {
      tagline = taglineFetchResult.data;
    }
    const calleridFetchResult = await fetchCallerid();
    if (calleridFetchResult) {
      callerid = calleridFetchResult.data.value;
    }
    const contactsFetchResult = await fetchContacts();
    if (contactsFetchResult.items.length) {
      contacts.push(...contactsFetchResult.items);
    }

    const faxIncomingHistoryResult = await fetchHistoryWrapper({
      type: "FAX",
      direction: "INCOMING",
      archived: false,
    });
    const faxOutgoingHistoryResult = await fetchHistoryWrapper({
      type: "FAX",
      direction: "OUTGOING",
      archived: false,
    });
    if (faxIncomingHistoryResult?.items.length) {
      faxHistory.push(...faxIncomingHistoryResult.items);
    }
    if (faxOutgoingHistoryResult?.items.length) {
      faxHistory.push(...faxOutgoingHistoryResult.items);
    }
  } catch (error) {
    console.error(error);
    fetchError = true;
  }
  if (fetchError) {
    console.error("Error fetching data");
    return {
      status: "" + (fetchError && "fetchError"),
      contacts,
      faxHistory: [],
      callerid,
      tagline,
    };
  } else {
    return {
      status: "ok",
      contacts,
      faxHistory,
      callerid,
      tagline,
    };
  }
};

export default function Fax() {
  const loaderData = useLoaderData<typeof loader>();
  const fetchers = useFetchers();
  const [hasCoverPage, setHasCoverPage] = useState(true);
  const [sender, setSender] = useState<string>("");
  const [senderNumber, setSenderNumber] = useState<string>("");
  const [patientName, setPatientName] = useState<string>("");
  const [prescriptionDate, setPrescriptionDate] = useState<string>("");
  const [faxContacts, setFaxContacts] = useState<FaxContact[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [filteredContacts, setFilteredContacts] = useState<FaxContact[]>([]);
  const [recipientName, setRecipientName] = useState<string>(
    defaultState.recipientName
  );
  const [recipientNumber, setRecipientNumber] = useState<string>(
    defaultState.recipientNumber
  );
  const [currentSendActionKey, setCurrentSendActionKey] = useState<string>("");
  const [content, setContent] = useState<string>(defaultState.content);
  const [uploadedPdf, setUploadedPdf] = useState<ArrayBuffer | undefined>();
  const [uploadMetaData, setUploadMetaData] = useState<
    UploadMetaData | undefined
  >();
  const [resultingPDF, setResultingPDF] = useState<Uint8Array | undefined>();
  const [resultingPDFBase64, setResultingPDFBase64] = useState<
    string | undefined
  >();
  const now = new Date();
  const today = `${now.getFullYear()}-${(now.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${now.getDate()}`;

  const fileName = today + "_fax-an_" + recipientNumber.replace(" ", "_");

  const initUpload = () => {
    setUploadedPdf(undefined);
    setUploadMetaData(undefined);
    setResultingPDF(undefined);
    setResultingPDFBase64(undefined);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // as maxFiles: 1 we can safely assume there will be only one file
    initUpload();
    const file = acceptedFiles[0];
    if (file) {
      setUploadMetaData({
        name: file.name,
        size: file.size,
        lastModifiedDate: new Date(file.lastModified),
      });
      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        // Do whatever you want with the file contents
        const { result } = reader;

        if (result && typeof result !== "string") {
          setUploadedPdf(result);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
  });

  useEffect(() => {
    if (faxContacts.length) {
      return;
    }
    if (loaderData?.status === "ok" && loaderData.contacts) {
      setFaxContacts(getFaxContacts(loaderData.contacts as Contact[]));
    }
  }, [loaderData?.contacts, faxContacts, loaderData?.status]);

  useEffect(() => {
    if (loaderData?.tagline) {
      setSender(loaderData.tagline);
    }
    if (loaderData?.callerid) {
      setSenderNumber(loaderData.callerid);
    }
  }, [loaderData?.callerid, loaderData?.tagline]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (resultingPDF) setResultingPDF(undefined);
    const field = e.currentTarget.name;
    e.preventDefault();
    if (field === "recipientName") setRecipientName(e.currentTarget.value);
    if (field === "recipientNumber") setRecipientNumber(e.currentTarget.value);
    if (field === "content") setContent(e.currentTarget.value);
    if (field === "patientName") setPatientName(e.currentTarget.value);
    if (field === "prescriptionDate")
      setPrescriptionDate(e.currentTarget.value);
  };

  const handleReset = (onlyResultingPdf: boolean = false) => {
    if (!onlyResultingPdf) {
      setRecipientName(defaultState.recipientName);
      setRecipientNumber(defaultState.recipientNumber);
      setContent(defaultState.content);
    }
    initUpload();
    setCurrentSendActionKey("");
  };
  const handleCreatePdf = async () => {
    if (
      uploadedPdf &&
      ((sender && recipientName && content) || !hasCoverPage)
    ) {
      try {
        const result = await createPdf({
          coverPage: hasCoverPage
            ? {
                recipient: recipientName,
                recipientNumber,
                content,
                patientName,
                prescriptionDate,
              }
            : undefined,
          pdfAttachment: {
            bytes: uploadedPdf,
            fileName,
            description: "pdfAnhang",
            creationDate: now.toISOString(),
            modificationDate: now.toISOString(),
          },
        });
        if (result) {
          const { doc, base64string } = result;
          setResultingPDF(doc);
          setResultingPDFBase64(base64string);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const resultingPdfUrl = resultingPDF
    ? URL.createObjectURL(new Blob([resultingPDF], { type: "application/pdf" }))
    : undefined;

  const recipientNumberMatch = Boolean(
    recipientNumber.match(/^\+[1-9]\d{7,14}$/)
  );
  useEffect(() => {
    const sendAction = fetchers.find(
      (fetcher) => fetcher.formAction === "/fax/send"
    );
    if (sendAction) {
      setCurrentSendActionKey(sendAction.key);
    }
  }, [fetchers]);

  const currentSendActionResult = fetchers.find(
    (fetcher) => fetcher.key === currentSendActionKey
  )?.data as FaxSendResult;

  const coverPageIncomplete =
    !sender || !recipientName || !content || !patientName || !prescriptionDate;
  const readyCoverPage =
    !hasCoverPage || (hasCoverPage && !coverPageIncomplete);
  const readyToCreateFax =
    recipientNumberMatch && uploadedPdf && readyCoverPage;
  const canSendFax = Boolean(
    loaderData?.status === "ok" &&
      readyCoverPage &&
      readyToCreateFax &&
      resultingPdfUrl &&
      resultingPDFBase64
  );
  useEffect(() => {
    if (searchValue === "") {
      setFilteredContacts([]);
    }
  }, [searchValue]);
  const handleSelectFaxContact = (contact: FaxContact) => {
    setRecipientNumber(contact.number || "");
    setRecipientName(
      contact.familyName + (contact.givenName ? ", " + contact.givenName : "")
    );
    setSearchValue("");
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-2 md:h-full">
      <Container className="max-h-full overflow-y-auto">
        <div className="grid grid-rows-1 gap-2">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Fax Empfänger
          </h2>
          <Input
            label="Suche"
            placeholder="🔍 in Addressbuch suchen oder unten manuell eingeben"
            name="search"
            autoComplete="off"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              setFilteredContacts(
                faxContacts.filter((contact) =>
                  contact.name.toLowerCase().includes(searchValue.toLowerCase())
                )
              );
              if (searchValue === "") {
                setFilteredContacts([]);
              }
            }}
          />
          {filteredContacts.length > 0 && searchValue !== "" && (
            <div className="relative">
              <div className="absolute z-50 bg-white dark:bg-gray-700 border border-blue-500 dark:border-white rounded-md mt-2 w-full grid grid-cols-1">
                {filteredContacts.map((contact) => (
                  <button
                    key={contact.id}
                    className="p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 text-start"
                    onKeyDown={() => handleSelectFaxContact(contact)}
                    onClick={() => handleSelectFaxContact(contact)}
                  >
                    {contact.familyName}, {contact.givenName} - {contact.number}
                  </button>
                ))}
              </div>
            </div>
          )}
          <Input
            label="Faxnummer"
            placeholder="Faxnummer im Format +49293112345"
            type="tel"
            required
            title="Faxnummer im Format +49293112345"
            pattern="^\+[1-9]\d{1,14}$"
            name="recipientNumber"
            value={recipientNumber}
            onChange={handleChange}
          />

          {hasCoverPage && (
            <CoverPageForm
              {...{
                sender,
                senderNumber,
                recipientName,
                patientName,
                prescriptionDate,
                content,
                onChange: handleChange,
                onRemove: () => setHasCoverPage(false),
              }}
            />
          )}
          {/* add a toggle for the CoverPage */}
          {!hasCoverPage && (
            <ToggleButton
              label="⊕ Deckblatt hinzufügen"
              value={!hasCoverPage}
              onChange={() => {
                if (resultingPdfUrl) handleReset(true);
                setHasCoverPage(!hasCoverPage);
              }}
            />
          )}
          {resultingPdfUrl && (
            <span className="text-red-500 p-1 italic text-sm">
              <i> (Formular wir zurückgesetzt)</i>
            </span>
          )}
          <Container
            bg="bg-green-100 dark:bg-green-700"
            rounded="rounded-lg"
            shadow="shadow-inner"
            className="border border-green-300"
          >
            <div className="text-sm text-gray-700 dark:text-gray-100">
              Bitte das zu faxende PDF hier ablegen, oder klicken um ein PDF
              auszuwählen
            </div>
            <div
              className="mt-4 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer"
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <div className="text-slate-500 dark:text-slate-100">
                  ⊕ Bitte das zu faxende PDF hier ablegen ...
                </div>
              ) : (
                <div className="text-slate-500 dark:text-slate-100">
                  ⊕ Drag & Drop oder Datei auswählen
                </div>
              )}
            </div>
            {uploadMetaData && (
              <div className="p-4 bg-yellow-100 dark:bg-yellow-700 rounded-md border-spacing-1 shadow-inner">
                <p className="text-xs font-mono italic">
                  <div className="flex justify-between items-center">
                    <b>📄 {uploadMetaData?.name}</b>
                    <DeleteButton handleDelete={handleReset} />
                  </div>
                  <div>
                    ({uploadMetaData?.lastModifiedDate.toLocaleString()} -{" "}
                    {uploadMetaData?.size} byte)
                  </div>
                </p>
              </div>
            )}
          </Container>
          {!readyToCreateFax && (
            <Container
              bg="bg-red-100 dark:bg-red-700"
              rounded="rounded-lg"
              shadow="shadow-inner"
              className="border border-red-300"
            >
              <h2 className="text-xl font-semibold text-gray-800 dark:text-red-300">
                Zum Fortfahren bitte prüfen:
              </h2>
              <ul className="text-red-500 dark:text-red-200 font-mono p-1 text-xs list-disc list-inside">
                {!recipientNumberMatch && (
                  <li>Faxnummer im Format &quot;+49293112345&quot; fehlt</li>
                )}
                {!uploadedPdf && <li>Bitte PDF-Dokument hochladen</li>}
                {hasCoverPage && coverPageIncomplete && (
                  <>
                    {!recipientName && (
                      <li>Deckblatt: Name Empfänger:in fehlt</li>
                    )}
                    {!patientName && <li>Deckblatt: Name Patient:in fehlt</li>}
                    {!prescriptionDate && <li>Deckblatt: Datum fehlt</li>}
                    {!content && <li>Deckblatt: Korrekturen fehlen</li>}
                  </>
                )}
              </ul>
            </Container>
          )}
          {readyToCreateFax && !resultingPDF && (
            <TactileButton
              label="🛠️ Fax vorbereiten"
              onClick={handleCreatePdf}
              disabled={!!resultingPdfUrl || !readyToCreateFax}
              color="gray"
            />
          )}

          {resultingPdfUrl && (
            <TactileButton
              label="  ♻️ alles zurücksetzen"
              onClick={() => handleReset()}
              color="gray"
            />
          )}
        </div>
      </Container>
      <FaxPreview
        resultingPdfUrl={resultingPdfUrl}
        fileName={fileName}
        resultingPDFBase64={resultingPDFBase64}
        currentSendActionResult={currentSendActionResult}
        canSendFax={canSendFax}
        recipientName={recipientName}
        recipientNumber={recipientNumber}
      />
      <FaxHistoryView />
    </div>
  );
}
