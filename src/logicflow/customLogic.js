import { HtmlNode, HtmlNodeModel } from "@logicflow/core";

class ButtonNode extends HtmlNode {
  setHtml(rootEl) {
    const { graphModel, model } = this.props;
    const el = document.createElement("div");
    el.className = `logic-custom uml-wrapper${model.id}`;
    const html = `
      <div>
        <button class="logic-btn add-top" onclick="setData('top')" onmousedown="stop(arguments[0])">+</button>
        <button class="logic-btn add-right" onclick="setData('right')" onmousedown="stop(arguments[0])">+</button>
        <button class="logic-btn add-bottom" onclick="setData('bottom')" onmousedown="stop(arguments[0])">+</button>
        <button class="logic-btn add-left" onclick="setData('left')" onmousedown="stop(arguments[0])">+</button>
      </div>
    `;
    el.innerHTML = html;
    rootEl.innerHTML = "";
    rootEl.appendChild(el);
    window.stop = (ev) => {
      ev.stopPropagation();
    };
    window.setData = (direction) => {
      graphModel.eventCenter.emit("custom:button-click", { direction });
    };
  }
}

class ButtonNodeModel extends HtmlNodeModel {
  setAttributes() {
    this.width = 130;
    this.height = 130;
    this.text.editable = false;
  }
}

export default {
  type: "button-node",
  view: ButtonNode,
  model: ButtonNodeModel
};
