import Model from "models";

class CardModal extends Model<Card> {
  constructor() {
    super("/card", "public-1");
  }
  async makePrimary(cardId: string) {
    return await this.sendRequest<Card>(`/make-primary/${cardId}`, "PUT");
  }
}

export default new CardModal();
