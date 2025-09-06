import { streamClient } from "@/lib/stream";

export const useCreateNewChat = () => {
  const createNewChat = async ({
    members,
    createdBy,
  }: {
    members: string[];
    createdBy: string;
  }) => {
    const existingChannel = await streamClient.queryChannels(
      {
        type: "messaging",
        members: { $eq: members },
      },
      { created_at: -1 },
      { limit: 1 },
    );

    if (existingChannel.length > 0) {
      const channel = existingChannel[0];
      const channelMembers = Object.keys(channel.state.members);

      if (
        channelMembers.length === 2 &&
        members.length === 2 &&
        members.every((member) => channelMembers.includes(member))
      ) {
        return channel;
      }
    }

    const channelId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;

    const channel = streamClient.channel("messaging", channelId, {
      members,
      created_by_id: createdBy,
    });

    // await channel.watch({ presence: true });

    return channel;
  };

  return createNewChat;
};
