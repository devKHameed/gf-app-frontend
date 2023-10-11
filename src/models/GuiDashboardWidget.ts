import Model from "models";

class GuiDashboardWidgetModal extends Model<GuiDashboardWidget> {
  constructor() {
    super("/gf-dashboard-widget", "gui-fusion");
  }

  async createForm(
    widgetSlug: string,
    formData: Partial<WidgetAction>,
    type: string
  ) {
    return await this.sendRequest<WidgetAction>(`/${widgetSlug}/form`, "POST", {
      type,
      form_data: formData,
    });
  }

  async updateForm(
    widgetSlug: string,
    formId: string,
    formData: Partial<WidgetAction>,
    type: string
  ) {
    return await this.sendRequest(`/${widgetSlug}/form/${formId}`, "PUT", {
      type,
      form_data: formData,
    });
  }
}

const model = new GuiDashboardWidgetModal();

export default model;
