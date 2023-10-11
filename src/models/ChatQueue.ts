import Model from "models";

class ChatQueueModel extends Model<ChatQueue> {
  constructor() {
    super("/chat-queue", "public-1");
  }
}

export default new ChatQueueModel();
