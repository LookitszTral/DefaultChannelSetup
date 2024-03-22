import { useEffect, useState } from "react";
import { useChatContext } from "stream-chat-react";
import CreateChannel from "./CreateChannel"; // Import CreateChannel component

const DefaultChannel = ({ setIsCreating }) => {
  const { client } = useChatContext();
  const [defaultChannelsCreated, setDefaultChannelsCreated] = useState(false);

  useEffect(() => {
    async function createDefaultChannels() {
      try {
        if (!defaultChannelsCreated) {
          // Create default channels with predefined names and members
          const channelsData = [
            {
              type: "team",
              name: "Linear Rail Specialist",
              members: ["user_id_1", "user_id_2", "user_id_3"],
            },
            {
              type: "team",
              name: "Pneumatic Specialist",
              members: ["user_id_1", "user_id_2", "user_id_3"],
            },
            {
              type: "team",
              name: "Modular Aluminum Specialist",
              members: ["user_id_1", "user_id_2", "user_id_3"],
            },
            // Add more default channels here as needed
          ];

          for (const data of channelsData) {
            // Skip creating channels if they already exist
            const existingChannel = await client.getChannelByType(data.type, data.name);
            if (!existingChannel) {
              await createChannel(data);
            }
          }

          setDefaultChannelsCreated(true);
          setIsCreating(false); // Notify parent component that default channels have been created
          console.log("Default channels created");
        }
      } catch (error) {
        console.error("Error creating default channels:", error);
      }
    }

    createDefaultChannels();
  }, [client, defaultChannelsCreated, setIsCreating]);

  const createChannel = async (channelData) => {
    try {
      const newChannel = await client.channel(channelData.type, channelData.name, {
        name: channelData.name,
        members: channelData.members,
      });

      await newChannel.watch();
      console.log(`Channel ${channelData.name} created successfully.`);
    } catch (error) {
      console.error(`Error creating channel ${channelData.name}:`, error);
    }
  };

  return null; // DefaultChannel component doesn't need to render anything
};

export default DefaultChannel;
