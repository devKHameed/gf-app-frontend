import Model from "models";

class ChatWidgetModel extends Model<ChatWidget> {
  constructor() {
    super("/chat-widget", "public-1");
  }
}

export default new ChatWidgetModel();
