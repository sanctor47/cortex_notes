import Dexie from "dexie";

class CortexDB extends Dexie {
  constructor() {
    super("CortexDB");
    this.version(1).stores({
      notes: "++id, title, content, labels, drafts, links, pinned, parents",
      labels: "++id, text, links",
      prompts: "++id, name, text, type, stage, tag",
    });
  }

  async deleteLabel(labelId) {
    console.log("CortexDB ~ labelId:", labelId)
    // Find all notes that have the label to be removed
    const notesToUpdate = await this.notes
      .where("labels")
      .equals(labelId)
      .toArray();

    // Update each note to remove the label from the labels array
    const updatePromises = notesToUpdate.map((note) => {
      const updatedLabels = note.labels.filter((label) => label !== labelId);
      return this.notes.update(note.id, { labels: updatedLabels });
    });

    // Delete the label itself
    const deleteLabelPromise = this.labels.delete(labelId);

    // Wait for all updates and the label deletion to complete
    await Promise.all([...updatePromises, deleteLabelPromise]);
  }
}

export const db = new CortexDB();
