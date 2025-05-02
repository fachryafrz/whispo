import { useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { Copy, Pencil, Reply, Trash2, Undo2 } from "lucide-react";
import { useDisclosure } from "@heroui/modal";
import { addToast } from "@heroui/toast";

import { Doc, Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useEditMessage } from "@/zustand/edit-message";
import { useReplyMessage } from "@/zustand/reply-message";
import EditMessageModal from "@/components/modal/edit-message";
import {
  ContextMenuContent,
  ContextMenuItem,
} from "@/components/ui/context-menu";

export default function MessageOptions({
  msg,
  index,
}: {
  msg: Doc<"chat_messages">;
  index: number;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { message, setMessage } = useEditMessage();
  const { setReplyMessageId } = useReplyMessage();

  const currentUser = useQuery(api.users.getCurrentUser);

  const unsendMessage = useMutation(api.chats.unsendMessage);
  const readMessage = useMutation(api.chats.readMessage);
  const deleteMessage = useMutation(api.chats.deleteMessage);

  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(msg.text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset copy status after 2 seconds
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  useEffect(() => {
    if (!isCopied) return;

    addToast({
      title: "Copied",
      description: "Message copied to clipboard",
      color: "success",
    });
  }, [isCopied]);

  return (
    <>
      <ContextMenuContent>
        {/* Copy Message */}
        {!msg.isUnsent && (
          <ContextMenuItem
            className="cursor-pointer gap-2"
            onClick={() => copyToClipboard()}
          >
            <Copy size={20} />
            <div>Copy Message</div>
          </ContextMenuItem>
        )}

        {/* Reply */}
        <ContextMenuItem
          className="cursor-pointer gap-2"
          onClick={() => {
            setReplyMessageId(msg._id);

            readMessage({
              userId: currentUser?._id as Id<"users">,
              chatId: msg.chatId as Id<"chats">,
            });
          }}
        >
          <Reply size={20} />
          <div>Reply</div>
        </ContextMenuItem>

        {/* Options for message by current user */}
        {msg.senderId === currentUser?._id ? (
          <>
            {/* If message is not unsent */}
            {!msg.isUnsent && (
              <>
                {/* Edit */}
                <ContextMenuItem
                  className="cursor-pointer gap-2"
                  onClick={() => {
                    setMessage(msg.text);
                    onOpen();
                  }}
                >
                  <Pencil size={20} />
                  <div>Edit</div>
                </ContextMenuItem>

                {/* Unsend */}
                <ContextMenuItem
                  className="cursor-pointer gap-2 text-danger hover:!bg-danger hover:!text-white"
                  onClick={() => {
                    unsendMessage({
                      messageId: msg._id as Id<"chat_messages">,
                      chatId: msg.chatId as Id<"chats">,
                      index: index,
                    });
                  }}
                >
                  <Undo2 size={20} />
                  <div>Unsend</div>
                </ContextMenuItem>
              </>
            )}
          </>
        ) : null}

        {/* Delete */}
        <ContextMenuItem
          className="cursor-pointer gap-2 text-danger hover:!bg-danger hover:!text-white"
          onClick={() => {
            deleteMessage({
              chatId: msg.chatId as Id<"chats">,
              messageId: msg._id as Id<"chat_messages">,
            });
          }}
        >
          <Trash2 size={20} />
          <div>Delete for me</div>
        </ContextMenuItem>
      </ContextMenuContent>

      {/* NOTE: Keep this until this Issue is fixed: https://github.com/heroui-inc/heroui/issues/4786 */}
      {/* <Dropdown
          placement={
            windowWidth >= 1024
              ? msg.sender === currentUser?._id
                ? "left-start"
                : "right-start"
              : "bottom"
          }
        >
          <DropdownTrigger>
            <Button
              isIconOnly
              className="sticky bottom-0"
              radius="full"
              variant="light"
            >
              <EllipsisVertical />
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Menu">
            // Reply
            <DropdownItem
              key="reply"
              color="default"
              startContent={<Reply size={20} />}
              onPress={() => {
                setReplyMessageId(msg._id);
              }}
            >
              Reply
            </DropdownItem>
  
            {msg.sender === currentUser?._id ? (
              <>
                // Edit
                <DropdownItem
                  key="edit"
                  color="default"
                  startContent={<Pencil size={20} />}
                  onPress={() => {
                    setMessage(msg.content);
                    onOpen();
                  }}
                >
                  Edit
                </DropdownItem>
  
                // Unsend
                {msg._creationTime + 3600000 > Date.now() && (
                  <>
                    {!msg.unsentBy && (
                      <DropdownItem
                        key="unsend"
                        color="default"
                        startContent={<Undo2 size={20} />}
                        onPress={() => {
                          unsendMessage({
                            _id: msg._id as Id<"messages">,
                            unsentBy: currentUser?._id as Id<"users">,
                            unsentAt: Date.now(),
                          });
  
                          if (index === 0) {
                            updateChat({
                              _id: activeChat?._id as Id<"chats">,
                              lastMessage: "_message was unsent_",
                              lastMessageSender: currentUser?._id as Id<"users">,
                              lastMessageTime: Date.now(),
                            });
                          }
                        }}
                      >
                        Unsend
                      </DropdownItem>
                    )}
                  </>
                )}
              </>
            ) : null}
  
            // Delete
            <DropdownItem
              key="delete"
              className="text-danger"
              color="danger"
              startContent={<Trash2 size={20} />}
              onPress={() => {
                deleteMessage({
                  _id: msg._id as Id<"messages">,
                  deletedBy: msg.deletedBy
                    ? [...msg.deletedBy, currentUser?._id as Id<"users">]
                    : [currentUser?._id as Id<"users">],
                  deletedAt: msg.deletedAt
                    ? [...msg.deletedAt, Date.now()]
                    : [Date.now()],
                });
              }}
            >
              Delete for me
            </DropdownItem>
          </DropdownMenu>
        </Dropdown> */}
      {/* NOTE: Keep this until this Issue is fixed: https://github.com/heroui-inc/heroui/issues/4786 */}

      {/* Edit message modal */}
      <EditMessageModal
        isOpen={isOpen}
        message={message}
        msg={msg}
        setMessage={setMessage}
        onOpenChange={onOpenChange}
      />
    </>
  );
}
