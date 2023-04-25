import Column from "./Column.js";

export default class Kanban {
  constructor(root) {
    this.root = root;
    this.columnViews = [];
    Kanban.columns().forEach((column) => {
      // TODO: create an instance Column class
      const columnView = new Column(column.id, column.title);
      // columnView.renderItems();
      this.columnViews.push(columnView);
      this.root.appendChild(columnView.elements.root);
    });
  }

  async renderColumns() {
    // console.log(items);
    // items.forEach((item) => {
    //   this.renderItem(item);
    // });

    for (const columnView of this.columnViews) {
      // console.log(columnView);
      await columnView.renderItems();
    }
  }

  static columns() {
    return [
      {
        id: 1,
        title: "Not Started",
      },
      {
        id: 2,
        title: "In Progress",
      },
      {
        id: 3,
        title: "Completed",
      },
    ];
  }
}
