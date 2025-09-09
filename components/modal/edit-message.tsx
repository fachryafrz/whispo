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

import { handleKeyDown } from "@/utils/handle-textarea-key-down";


export default function EditMessageModal({
  msg,
  message,
  setMessage,
  isOpen,
  onOpenChange,
}: {
  msg: LocalMessage;
  message: string | null;
  setMessage: (message: string) => void;
  isOpen: boolean;
  onOpenChange: () => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  // const editMessage = useMutation(api.chats.editMessage);

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

                  // editMessage({
                  //   messageId: msg._id as Id<"chat_messages">,
                  //   chatId: msg.chatId as Id<"chats">,
                  //   text: message as string,
                  // });

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
