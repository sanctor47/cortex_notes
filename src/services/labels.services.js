import debounce from "lodash.debounce";
import { db } from "../config/DBConfig";

export const addLabel = async (text) => {
  const id = await db.labels.add({
    text: text,
  });
  console.log("Label Added: ", id);
  return id;
};

export const getLabelById = async (label) => {
  const item = await db.labels.get(label);
  return item
}

export const deleteLabel = async (labelId) => {
  const id = await db.labels.delete(labelId);
  return id;
};

export const updateLabel = async (labelId, update) => {
  const id = await db.labels.update(labelId, update);
  return id;
};

export const getLabelsArray = async (labels) => {
  const matchingItems = await db.labels.where("id").anyOf(labels).toArray();
  return matchingItems;
};

export const throtteledLabelUpdate = debounce((labelId, update) => {
  const id = updateNote(labelId, update);
  return id;
}, 300);
