import { Form } from "react-router";
import { SimpleButton } from "./buttons";
import { Container } from "./container";

interface FaxPreviewProps {
  recipientName: string;
  recipientNumber: string;
  fileName: string;
  resultingPDFBase64?: string;
  resultingPdfUrl?: string;
  canSendFax: boolean;
  currentSendActionResult?: {
    result: "success" | "error";
    message: string;
    error?: string;
  } | null;
}

export const FaxPreview = ({
  recipientName,
  recipientNumber,
  fileName,
  resultingPDFBase64,
  resultingPdfUrl,
  currentSendActionResult,
  canSendFax,
}: FaxPreviewProps) => {
  return (
    <Container className="h-full overflow-y-auto">
      <div className="h-fit">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Fax Vorschau
        </h2>

        {/* Error Display */}
        {currentSendActionResult?.result === "error" && (
          <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg">
            <h3 className="text-red-800 dark:text-red-200 font-semibold">
              Fehler beim Senden
            </h3>
            <p className="text-red-700 dark:text-red-300 text-sm mt-1">
              {currentSendActionResult.message}
            </p>
            {currentSendActionResult.error && (
              <details className="mt-2">
                <summary className="text-red-600 dark:text-red-400 text-xs cursor-pointer">
                  Technische Details
                </summary>
                <pre className="text-red-600 dark:text-red-400 text-xs mt-1 bg-red-50 dark:bg-red-900/50 p-2 rounded">
                  {currentSendActionResult.error}
                </pre>
              </details>
            )}
          </div>
        )}

        {/* Success Display */}
        {currentSendActionResult?.result === "success" && (
          <div className="mb-4 p-4 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg">
            <h3 className="text-green-800 dark:text-green-200 font-semibold">
              Erfolgreich gesendet
            </h3>
            <p className="text-green-700 dark:text-green-300 text-sm mt-1">
              {currentSendActionResult.message}
            </p>
          </div>
        )}

        {canSendFax && (
          <Form method="POST" action="/fax" navigate={false}>
            <input type="hidden" name="recipientName" value={recipientName} />
            <input
              type="hidden"
              name="recipientNumber"
              value={recipientNumber}
            />
            <input type="hidden" name="fileName" value={fileName + ".pdf"} />
            <input type="hidden" name="pdf" value={resultingPDFBase64} />
            <input type="hidden" name="actionType" value="sendFax" />
            <input type="hidden" name="faxId" value="" />
            <SimpleButton
              label={`📤 Fax senden${
                recipientName ? ` an ${recipientName}` : ""
              }`}
              type="submit"
              color="green"
            />
          </Form>
        )}
      </div>
      {!resultingPdfUrl && (
        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
          Noch kein Fax vorbereitet
        </div>
      )}

      <div className="h-full">
        {resultingPdfUrl && (
          <>
            <a
              href={resultingPdfUrl}
              download={fileName + ".pdf"}
              className="rounded-md  text-xs font-mono italic text-gray-950 dark:text-white hover:underline cursor-pointer text-center"
            >
              📄<b>{fileName + ".pdf"}</b>
            </a>
            <embed
              className="h-96 w-full"
              src={resultingPdfUrl}
              type="application/pdf"
            ></embed>
          </>
        )}
      </div>
    </Container>
  );
};
