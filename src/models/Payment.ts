import Model from "models";

class Payment extends Model<any> {
  constructor() {
    super("/payment", "public-1");
  }

  async verifyPayment({
    paymentId,
    email,
  }: {
    paymentId: string;
    email: string;
  }) {
    return await this.sendRequest("/verify", "POST", {
      payment_intent_id: paymentId,
      email,
    });
  }
}

export default new Payment();
