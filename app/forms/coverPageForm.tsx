import { DeleteButton } from "../components/buttons";
import { Container } from "../components/container";
import { Input, Label } from "./input";

type CoverPageFormProps = {
  sender: string;
  senderNumber: string;
  recipientName: string;
  patientName: string;
  prescriptionDate: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onRemove: () => void;
  content: string;
};

export const CoverPageForm = ({
  sender,
  senderNumber,
  patientName,
  prescriptionDate,
  recipientName,
  onChange,
  onRemove,
  content,
}: CoverPageFormProps) => {
  return (
    <Container
      className="relative"
      bg="bg-gray-50 dark:bg-gray-800"
      shadow="shadow-inner"
    >
      <DeleteButton
        handleDelete={onRemove}
        className="top-2 right-2 absolute"
      />
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
        Deckblatt ausfüllen{" "}
      </h2>
      <h3 className="italic">&quot;Korrektur der Verordnung notwendig&quot;</h3>
      <Input
        label="Von:"
        name="recipientName"
        value={`${sender} (${senderNumber})`}
        onChange={() => undefined}
        disabled={true}
      />

      <Input
        label="An (Name):"
        name="recipientName"
        value={recipientName}
        onChange={onChange}
      />
      <Input
        label="Patient:"
        name="patientName"
        value={patientName}
        onChange={onChange}
      />

      <Input
        label="Datum der Verordnung:"
        name="prescriptionDate"
        value={prescriptionDate}
        onChange={onChange}
      />

      <Label>
        Korrekturen:{" "}
        <textarea
          className="border border-gray-400 rounded-md p-1 w-full text-black dark:text-white"
          name="content"
          placeholder="z.B. 'Datum der VO muss sein: xx.xx.xxxx'"
          value={content}
          onChange={onChange}
        />
      </Label>
    </Container>
  );
};
