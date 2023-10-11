import Model from "models";

class VectorKnowledgebaseTopicModel extends Model<VectorKnowledgebaseTopic> {
  constructor() {
    super("/vector-knowledgebase-topic", "public-1");
  }
}

const model = new VectorKnowledgebaseTopicModel();
export default model;
