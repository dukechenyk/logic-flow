import { HtmlNode, HtmlNodeModel } from "@logicflow/core";

class ButtonNode extends HtmlNode {
  setHtml(rootEl) {
    const { graphModel, model } = this.props;
    const el = document.createElement("div");
    el.className = `logic-custom uml-wrapper${model.id} logic-${model.properties.type}`;
    // 处理弹出层列表
    const typeList = [
      {type: 'fillet', name: '圆角'},
      {type: 'circle', name: '圆形'},
      {type: 'rect', name: '矩形'},
    ]

    const popover = typeList?.map(item => (
      `<div class="dialog-box" >
        <div onClick="setType('${item.type}')" class="lf-click lf-${item.type}"></div>
        ${item.name}
      </div>`
    )).join('')

    const html = `
      <div id="logic-custom-popover${model.id}" style="--popover-top: 0px; --popover-left: 0px">
        <div popover="auto" id="mypopover${model.id}">
          <div class="dialog-content">
            ${popover}
          </div>
        </div>
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
    window.setType = (type) => {
      graphModel.eventCenter.emit("custom:button-type", { type });
    };
    window.setData = (direction) => {
      graphModel.eventCenter.emit("custom:button-data", { direction });
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
