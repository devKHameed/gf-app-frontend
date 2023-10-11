import Model from "models";

class UploadDesignModel extends Model<UploadDesign> {
  constructor() {
    super("/upload-design", "gui-fusion");
  }

  async listImport(designSlug: string) {
    return await this.sendRequest<UploadDesignImport[]>(
      `/${designSlug}/import`,
      "GET"
    );
  }

  async createImport(
    designSlug: string,
    files: { filename: string; file_url: string; type: string }[]
  ) {
    return await this.sendRequest<UploadDesignImport>(
      `/${designSlug}/import`,
      "POST",
      {
        files,
      }
    );
  }
}

const model = new UploadDesignModel();
export default model;
