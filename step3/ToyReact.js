let childrenSymbol = Symbol('children');

class ElementWrapper {
    constructor(type) {
        this.type = type;
        this[childrenSymbol] = [];
        // this.comment = false;
        this.props = Object.create(null);
        this.children = [];
    }

    setAttribute(name, value) {
        this.props[name] = value;
    }

    appendChild(vchild) {
        this[childrenSymbol].push(vchild);
        this.children.push(vchild.vdom);
    }

    // 获取 vdom
    get vdom() {
        return this;
    }

    mountTo(range) {
        this.range = range;

        // 获取元素节点
        const placholder = document.createComment("placholder");
        const endRange = document.createRange();
        endRange.setStart(this.range.endContainer, this.range.endOffset);
        endRange.setEnd(this.range.endContainer, this.range.endOffset);
        endRange.insertNode(placholder);

        // 删除原有内容
        range.deleteContents();
        const element = document.createElement(this.type);

        // 处理 props
        for (let name in this.props) {
            const value = this.props[name];
            if (name.match(/^on([A-Z][a-z]+)$/)) {
                const eventName = RegExp.$1.replace(/^[\s\S]/, (e) => e.toLowerCase());
                element.addEventListener(eventName, value);
            }
            if (name === "className") {
                element.setAttribute("class", value);
            }
            element.setAttribute(name, value);
        }
        // 处理子节点
        for (let child of this.children) {
            const range = document.createRange();
            if (element.children.length) {
                range.setStartAfter(element.lastChild);
                range.setEndAfter(element.lastChild);
            } else {
                range.setStart(element, 0);
                range.setEnd(element, 0);
            }
            child.mountTo(range);
        }
        range.insertNode(element);
    }
}

class TextWrapper {
    constructor(content) {
        this.root = document.createTextNode(content);
        this.type = "#text";
        this.children = [];
        this.props = Object.create(null);
    }
    // 获取 vdom
    get vdom() {
        return this;
    }
    mountTo(range) {
        this.range = range;
        range.deleteContents();
        range.insertNode(this.root);
    }
}

export class Component {
    constructor() {
        this.children = [];
        this.props = Object.create(null);
    }
    // 获取 type
    get type() {
        return this.name;
    }
    // 获取 vdom
    get vdom() {
        return this.render().vdom;
    }

    setAttribute(name, value) {
        this.props[name] = value;
        this[name] = value;
    }

    mountTo(range) {
        // 保存内容
        this.range = range;
        this.update();
    }

    update() {
        // vdom 通过内部访问器获取
        const vdom = this.vdom;

        // 检查是否存在 vdom
        if (this.oldVdom) {
            const isSameNode = (node1, node2) => {
                if (node1.type !== node2.type) {
                    return false;
                };

                // 遍历节点属性
                for (let name in node1.props) {
                    // 检查节点属性是否相同
                    if (
                        typeof node1.props[name] === "object" &&
                        typeof node2.props[name] === "object" &&
                        JSON.stringify(node1.props[name]) ===
                        JSON.stringify(node2.props[name])
                    ) {
                        continue;
                    }

                    // 检查节点属性名
                    if (node1.props[name] !== node2.props[name]) return false;
                }
                // 检查属性长度是否相同
                const node1PropsLen = Object.keys(node1.props).length;
                const node2PropsLen = Object.keys(node2.props).length;
                if (node1PropsLen !== node2PropsLen) return false;

                return true;
            };

            const isSameTree = (node1, node2) => {
                /* 检查 vdom 节点 */
                if (!isSameNode(node1, node2)) return false;

                /* 检查子元素个数是否相同 */
                if (node1.children.length !== node2.children.length) return false;

                /* 遍历子元素 */
                for (let i = 0; i < node1.children.length; i++) {
                    // 递归检查子元素 Vdom 数是否相同
                    if (!isSameTree(node1.children[i], node2.children[i])) return false;
                }
                return true;
            };

            const replace = (newTree, oldTree, indent) => {
                /* 如果新旧 vdom 树一致则不更新 */
                if (isSameTree(newTree, oldTree)) return;

                // 如果当前节点不一致，则直接更新该层节点
                if (!isSameNode(newTree, oldTree)) {
                    newTree.mountTo(oldTree.range);
                } else {
                    // 如果当前节点一致,则遍历子元素，查询是否有需要更新的子元素
                    for (let i = 0; i < newTree.children.length; i++) {
                        replace(newTree.children[i], oldTree.children[i], ' ' + indent);
                    }
                }
            };
            // 更新 vdom 元素
            replace(vdom, this.oldVdom, '');
        } else {
            // 如果没有 Vdom 则渲染 vdom
            vdom.mountTo(this.range);
        }
        // 将当前 vdom 保存
        this.oldVdom = vdom;
    }

    appendChild(vchild) {
        this.children.push(vchild);
    }

    setState(state) {
        // merge 合并新状态
        const merge = (oldState, newState) => {
            // 遍历 state 对象
            for (let p in newState) {
                // 如果新状态中包含对象则递归遍历
                if (typeof newState[p] === "object" && newState[p] !== null) {
                    // 如果过去的状态没有对象，则赋空对象，避免递归报错
                    if (typeof oldState[p] !== "object") {
                        if (newState[p] instanceof Array) {
                            oldState[p] = [];
                        } else {
                            oldState[p] = {};
                        }
                    }
                    merge(oldState[p], newState[p]);
                } else {
                    // 状态合并
                    oldState[p] = newState[p];
                }
            }
        };
        if (!this.state && state) {
            this.state = {};
        }
        merge(this.state, state);
        this.update();
    }

}

export const ToyReact = {
    createElement(type, attributes, ...children) {
        let element =
            typeof type === "string" ? new ElementWrapper(type) : new type();

        for (let name in attributes) {
            element.setAttribute(name, attributes[name]);
        }
        const insertChildren = (children) => {
            for (let child of children) {
                // 检查非法子元素
                child = child == null || child == void 0 ? "" : child;
                if (typeof child === "object" && child instanceof Array) {
                    insertChildren(child);
                } else {
                    if (
                        !(child instanceof Component) &&
                        !(child instanceof ElementWrapper) &&
                        !(child instanceof TextWrapper)
                    ) {
                        child = String(child);
                    }
                    if (typeof child === "string") {
                        child = new TextWrapper(child);
                    }
                    element.appendChild(child);
                }
            }
        };
        insertChildren(children);
        return element;
    },

    render(vdom, element) {
        const range = document.createRange();
        if (element.children.length) {
            range.setStartAfter(element.lastChild);
            range.setEndAfter(element.lastChild);
        } else {
            range.setStart(element, 0);
            range.setEnd(element, 0);
        }

        vdom.mountTo(range);
    },
};
