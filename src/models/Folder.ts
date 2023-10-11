import Model from "models";

class FolderModel extends Model<Folder> {
  constructor() {
    super("/folder", "public-1");
  }
  async sort(data: Partial<Folder>) {
    return await this.sendRequest<Folder>(`/sort`, "POST", data);
  }
}

export default new FolderModel();
