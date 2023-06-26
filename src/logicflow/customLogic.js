import { HtmlNode, HtmlNodeModel } from "@logicflow/core";

class ButtonNode extends HtmlNode {
  setHtml(rootEl) {
    const { graphModel, model } = this.props;
    const el = document.createElement("div");
    el.className = `logic-custom uml-wrapper${model.id} logic-${model.properties.type}`;
    const html = `
      <div>
        <div class="logic-show add-top">
          <button class="logic-btn" onclick="setData('top')" onmousedown="stop(arguments[0])">+</button>
        </div>
        <div class="logic-show add-right">
          <button class="logic-btn" onclick="setData('right')" onmousedown="stop(arguments[0])">+</button>
        </div>
        <div class="logic-show add-bottom">
          <button class="logic-btn" onclick="setData('bottom')" onmousedown="stop(arguments[0])">+</button>
        </div>
        <div class="logic-show add-left">
          <button class="logic-btn" onclick="setData('left')" onmousedown="stop(arguments[0])">+</button>
        </div>
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
