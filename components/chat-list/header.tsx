import { useTheme } from "next-themes";
import { Tooltip } from "@heroui/tooltip";
import Link from "next/link";
import { Archive, EllipsisVertical, LogOut, Moon, Sun } from "lucide-react";
import { Skeleton } from "@heroui/skeleton";
import { Avatar } from "@heroui/avatar";

import Logo from "../logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import { siteConfig } from "@/config/site";
import { useArchivedChats } from "@/zustand/archived-chats";
import { signOut, useSession } from "@/lib/auth-client";

export default function ChatListHeader() {
  const { resolvedTheme, setTheme } = useTheme();
  const { open, setOpen } = useArchivedChats();

  const { data } = useSession();

  const onChange = () => {
    resolvedTheme === "light" ? setTheme("dark") : setTheme("light");
  };

  return (
    <header className={`grid grid-cols-3 items-center p-4`}>
      {/* CTA */}
      <div className={`justify-self-start`}>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex h-10 w-10 items-center justify-center rounded-full outline-none transition-all hover:bg-default/40">
            <EllipsisVertical />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {/* Toggle theme */}
            <DropdownMenuItem className="cursor-pointer" onClick={onChange}>
              {resolvedTheme === "light" ? (
                <Moon size={20} />
              ) : (
                <Sun size={20} />
              )}
              <div>
                {resolvedTheme === "light" ? "Dark Mode" : "Light Mode"}
              </div>
            </DropdownMenuItem>

            {/* Archive */}
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                setOpen(true);
              }}
            >
              <Archive size={20} />
              <div>Archived Chats</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* NOTE: Keep this until this Issue is fixed: https://github.com/heroui-inc/heroui/issues/4786 */}
        {/* <Dropdown placement="bottom-start">
          <DropdownTrigger>
            <Button isIconOnly radius="full" variant="light">
              <EllipsisVertical />
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Menu">
            // Toggle theme
            <DropdownItem
              key="toggle-theme"
              startContent={
                resolvedTheme === "light" ? (
                  <Moon size={20} />
                ) : (
                  <Sun size={20} />
                )
              }
              onPress={onChange}
            >
              {resolvedTheme === "light" ? "Dark Mode" : "Light Mode"}
            </DropdownItem>

            // Archive
            <DropdownItem
              key="settings"
              startContent={<Archive size={20} />}
              onPress={() => {
                setOpen(true);
              }}
            >
              Archived Chats
            </DropdownItem>
          </DropdownMenu>
        </Dropdown> */}
        {/* NOTE: Keep this until this Issue is fixed: https://github.com/heroui-inc/heroui/issues/4786 */}
      </div>

      {/* App Name */}
      <Tooltip content={siteConfig.name} placement="bottom">
        <Link className="flex justify-self-center" href={`/`} prefetch={false}>
          <Logo height={30} />

          <h1 className={`sr-only`}>{siteConfig.name}</h1>
        </Link>
      </Tooltip>

      {/* User */}
      {!data ? (
        <Skeleton className="flex h-10 w-10 justify-self-end rounded-full" />
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger className="flex h-10 w-10 items-center justify-center justify-self-end rounded-full outline-none transition-all hover:bg-default/40">
            <Avatar src={data.user.image!} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {/* Sign Out */}
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={async () => {
                await signOut();
              }}
            >
              <LogOut />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </header>
  );
}
