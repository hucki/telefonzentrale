import { useFetcher } from "react-router";
import { SimpleButton } from "~/components/buttons";
/**
 * Button to resend a fax.
 * This component is used in the FaxHistoryItemList to allow users to resend a fax.
 *
 * @param {Object} props - The component props.
 * @param {string} props.faxId - The ID of the fax to resend.
 */
export const ResendFaxButton = ({ faxId }: { faxId: string }) => {
  const fetcher = useFetcher();
  const pending = fetcher.state !== "idle";

  return (
    <fetcher.Form method="POST" action="/fax">
      <input type="hidden" name="actionType" value="resendFax" />
      <input type="hidden" name="faxId" value={faxId} />
      <SimpleButton
        label="erneut senden"
        type="submit"
        pending={pending}
        size="xs"
      />
    </fetcher.Form>
  );
};
