import Chat from "@/components/chat";
import ChatList from "@/components/chat-list";
import ImageCarousel from "@/components/modal/image-carousel";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className={`relative flex h-svh`}>
        <ChatList />

        <Chat />

        {children}
      </div>

      <ImageCarousel />
    </>
  );
}
