import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { SendHorizontal } from "lucide-react";
import { Textarea } from "@heroui/input";
import { Button } from "@heroui/button";
import { useRef } from "react";
import { LocalMessage } from "stream-chat";
import { useSWRConfig } from "swr";

import { handleKeyDown } from "@/utils/handle-textarea-key-down";
import { streamClient } from "@/lib/stream";
import { useEditMessage } from "@/zustand/edit-message";

export default function EditMessageModal({
  msg,
  isOpen,
  onOpenChange,
}: {
  msg: LocalMessage;
  isOpen: boolean;
  onOpenChange: () => void;
}) {
  const { mutate } = useSWRConfig();
  const { message, setMessage } = useEditMessage();

  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async () => {
    await streamClient.updateMessage({
      id: msg.id,
      text: message!,
    });
  };

  return (
    <Modal
      isDismissable={false}
      isKeyboardDismissDisabled={false}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h3 className="text-2xl font-bold">Edit message</h3>
            </ModalHeader>
            <ModalBody>
              <form
                ref={formRef}
                className="flex items-end gap-2"
                onSubmit={(e) => {
                  e.preventDefault();

                  handleSubmit();

                  onClose();
                }}
              >
                <Textarea
                  minRows={1}
                  placeholder="Type a message"
                  radius="full"
                  value={message || ""}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) =>
                    handleKeyDown(
                      e as React.KeyboardEvent<HTMLTextAreaElement>,
                      formRef,
                    )
                  }
                />

                <Button
                  isIconOnly
                  className="bg-black text-white dark:bg-white dark:text-black"
                  radius="full"
                  type="submit"
                >
                  <SendHorizontal size={20} />
                </Button>
              </form>
            </ModalBody>
            <ModalFooter />
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
